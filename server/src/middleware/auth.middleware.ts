import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import logger from "../utils/logger.js";

export const protectDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: new Headers(req.headers as any),
        });

        if (!session) {
            logger.warn(`Unauthorized access attempt to ${req.originalUrl} - No session found`);
            return res.status(401).json({ 
                success: false, 
                msg: "Unauthorized: Please log in to access the dashboard." 
            });
        }

        const user = session.user;

        const isFinalizingSetup = req.path.includes("/finalize-setup");
        
        if (user.needsPasswordChange && !isFinalizingSetup) {
            return res.status(403).json({ 
                success: false, 
                msg: "Security Setup Required: You must finalize your account setup before accessing dashboard data.",
                code: "SETUP_REQUIRED"
            });
        }

        // add session data to request
        (req as any).user = user;
        (req as any).session = session.session;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ 
            success: false, 
            msg: "Internal Server Error during Authentication" 
        });
    }
};
