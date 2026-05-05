import { XuiService } from "../services/xui.service.js";
import { ClientService } from "../services/client.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getInbounds = catchAsync(async (req: any, res: any) => {
  // trigger reconciliation to ensure db matches panel before fetching
  await ClientService.syncPanelToDb();
  
  const inbounds = await XuiService.getEnrichedInbounds();
  return res.json({ success: true, obj: inbounds });
});
