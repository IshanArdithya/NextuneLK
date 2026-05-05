import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

//format zod validation errors
const handleZodError = (err: ZodError) => {
    const errors = err.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
    return new AppError(`Validation failed: ${errors.join('; ')}`, 400, 'VALIDATION_ERROR');
};

//format prisma database errors
const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
    switch (err.code) {
        case 'P2002':
            const field = (err.meta?.target as string[])?.join(', ') || 'field';
            return new AppError(`A record with this ${field} already exists.`, 400, 'DUPLICATE_RECORD');
        
        case 'P2025':
            return new AppError("The requested record was not found or has already been deleted.", 404, 'RECORD_NOT_FOUND');
        
        case 'P2003':
            // foreign key constraint failed
            return new AppError("This record cannot be deleted because it is linked to other data.", 400, 'LINKED_RECORD_CONFLICT');

        default:
            return new AppError(`Database Error: ${err.message}`, 500, 'DB_ERROR');
    }
};

//global error handler
export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(`${req.method} ${req.originalUrl}`, {
        message: err.message,
        stack: err.stack,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    // library error translation
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaError(err);
    }
    
    if (err instanceof ZodError) {
        error = handleZodError(err);
    }

    // in dev,to get details
    if (process.env.NODE_ENV === 'development') {
        return res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message,
            code: error.code,
            stack: err.stack,
            error: err
        });
    }

    // in prod
    return res.status(error.statusCode).json({
        success: false,
        status: error.status,
        message: error.isOperational ? error.message : 'Something went very wrong!',
        code: error.code
    });
};
