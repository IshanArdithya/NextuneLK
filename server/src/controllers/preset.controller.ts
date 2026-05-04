// @ts-nocheck
import { PresetService } from "../services/preset.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const getPresets = catchAsync(async (req, res) => {
  const presets = await PresetService.getPresets();
  return res.json({ success: true, obj: presets });
});

export const getAllPresets = catchAsync(async (req, res) => {
  const presets = await PresetService.getAllPresets();
  return res.json({ success: true, obj: presets });
});

export const createPreset = catchAsync(async (req, res) => {
  const { name, quotaGB, days, amount, currency } = req.body;

  if (!name || !quotaGB || !days || amount === undefined) {
    throw new AppError("name, quotaGB, days, and amount are required", 400);
  }

  const preset = await PresetService.createPreset({
    name,
    quotaGB: parseFloat(quotaGB),
    days: parseInt(days),
    amount: parseFloat(amount),
    currency,
  });

  return res.json({ success: true, msg: "Preset created", obj: preset });
});

export const updatePreset = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, quotaGB, days, amount, currency, isActive } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (quotaGB !== undefined) updateData.quotaGB = parseFloat(quotaGB);
  if (days !== undefined) updateData.days = parseInt(days);
  if (amount !== undefined) updateData.amount = parseFloat(amount);
  if (currency !== undefined) updateData.currency = currency;
  if (isActive !== undefined) updateData.isActive = isActive;

  const preset = await PresetService.updatePreset(id, updateData);

  return res.json({ success: true, msg: "Preset updated", obj: preset });
});

export const deletePreset = catchAsync(async (req, res) => {
  const { id } = req.params;
  await PresetService.deletePreset(id);
  return res.json({ success: true, msg: "Preset deleted" });
});
