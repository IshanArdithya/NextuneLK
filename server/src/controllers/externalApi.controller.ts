// @ts-nocheck
import { XuiService } from "../services/xui.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getSessionStatus = catchAsync(async (req: any, res: any) => {
    res.json(XuiService.getSessionStatus());
});

export const getClientUsage = catchAsync(async (req: any, res: any) => {
    const data = await XuiService.getEnrichedClientUsage(req.params.email);
    if (!data) {
        throw new AppError("User not found", 404);
    }
    return res.json(data);
});
