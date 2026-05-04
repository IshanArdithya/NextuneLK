// @ts-nocheck
import { XuiService } from "../services/xui.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getInbounds = catchAsync(async (req: any, res: any) => {
  const inbounds = await XuiService.getEnrichedInbounds();
  return res.json({ success: true, obj: inbounds });
});
