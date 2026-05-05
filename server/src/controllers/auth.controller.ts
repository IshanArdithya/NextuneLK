import { AuthService } from "../services/auth.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const finalizeSetup = catchAsync(async (req: any, res: any) => {
    const { newEmail, newPassword } = req.body;
    const userId = req.user.id;

    if (!newEmail || !newPassword) {
        throw new AppError("New email and password are required.", 400);
    }

    await AuthService.finalizeSetup(userId, newEmail, newPassword);

    return res.json({ success: true, msg: "Account secured successfully!" });
});
