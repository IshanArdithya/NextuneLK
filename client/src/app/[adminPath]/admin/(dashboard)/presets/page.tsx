"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Zap,
  Clock,
  Database,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface Preset {
  id: string;
  name: string;
  quotaGB: number;
  days: number;
  amount: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export default function PresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formName, setFormName] = useState("");
  const [formQuotaGB, setFormQuotaGB] = useState("");
  const [formDays, setFormDays] = useState("");
  const [formAmount, setFormAmount] = useState("");

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/presets/all");
      if (res.data.success) {
        setPresets(res.data.obj);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch presets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (preset: Preset | null = null) => {
    if (preset) {
      setEditingPreset(preset);
      setFormName(preset.name);
      setFormQuotaGB(preset.quotaGB.toString());
      setFormDays(preset.days.toString());
      setFormAmount(preset.amount.toString());
    } else {
      setEditingPreset(null);
      setFormName("");
      setFormQuotaGB("");
      setFormDays("");
      setFormAmount("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: formName,
        quotaGB: parseFloat(formQuotaGB),
        days: parseInt(formDays),
        amount: parseFloat(formAmount),
      };

      if (editingPreset) {
        await api.put(`/admin/presets/${editingPreset.id}`, data);
        toast({
          title: "Preset Updated",
          description: `'${formName}' has been updated.`,
        });
      } else {
        await api.post("/admin/presets", data);
        toast({
          title: "Preset Created",
          description: `'${formName}' has been created.`,
        });
      }
      setIsModalOpen(false);
      fetchPresets();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save preset",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (preset: Preset) => {
    try {
      setPresets(presets.map(p => p.id === preset.id ? { ...p, isActive: !p.isActive } : p));

      await api.put(`/admin/presets/${preset.id}`, {
        isActive: !preset.isActive,
      });
      toast({
        description: `Preset '${preset.name}' is now ${!preset.isActive ? "active" : "inactive"}.`,
      });
    } catch {
      fetchPresets();
      toast({
        title: "Error",
        description: "Failed to update preset status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this preset?")) return;
    try {
      await api.delete(`/admin/presets/${id}`);
      toast({
        title: "Preset Deleted",
        description: "The preset has been removed.",
      });
      fetchPresets();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete preset",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-headline)] tracking-tight">
            Service Presets
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your predefined VPN plans and pricing configurations.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 group text-xs h-9"
        >
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Create New Plan
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden py-0 gap-0 border border-border/50 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all duration-300 hover:border-foreground/20 hover:shadow-md rounded-2xl">

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading presets...</p>
              </div>
            ) : presets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Presets Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                  You haven&apos;t created any service plans yet. Create your first one to start adding clients.
                </p>
                <Button onClick={() => handleOpenModal()} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Plan
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto px-4 py-4 sm:px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-0">
                      <TableHead>Plan Name</TableHead>
                      <TableHead className="text-center">Data Quota</TableHead>
                      <TableHead className="text-center">Validity</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence initial={false}>
                      {presets.map((preset) => (
                        <TableRow
                          key={preset.id}
                          className={`group transition-colors border-border/40 ${!preset.isActive ? 'opacity-60 bg-muted/20' : 'hover:bg-muted/20'}`}
                        >
                          <TableCell>
                            <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">{preset.name}</div>
                          </TableCell>
                          <TableCell className="text-center font-medium text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <Database className="h-3 w-3 text-muted-foreground" />
                              {preset.quotaGB === 0 ? "Unlimited" : `${preset.quotaGB} GB`}
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="h-3 w-3" />
                              {preset.days} Days
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-slate-900 dark:text-zinc-100 text-sm">
                            {preset.currency || "LKR"} {preset.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={preset.isActive}
                              onCheckedChange={() => handleToggleActive(preset)}
                              className="scale-75"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleOpenModal(preset)} className="cursor-pointer">
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  Edit Plan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(preset.id)}
                                  className="text-destructive focus:text-destructive cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Plan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-violet-500" />
              {editingPreset ? "Edit Service Plan" : "Create Service Plan"}
            </DialogTitle>
            <DialogDescription>
              Configure the details of your service offering.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Plan Display Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Standard 30GB"
                  className="pl-3 h-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quota" className="text-sm font-semibold">Quota (GB)</Label>
                <div className="relative">
                  <Database className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="quota"
                    type="number"
                    value={formQuotaGB}
                    onChange={(e) => setFormQuotaGB(e.target.value)}
                    placeholder="30"
                    className="pl-10 h-11"
                    required
                  />
                  <div className="absolute right-3 top-3.5 text-[10px] text-muted-foreground uppercase font-bold">GB</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days" className="text-sm font-semibold">Validity (Days)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="days"
                    type="number"
                    value={formDays}
                    onChange={(e) => setFormDays(e.target.value)}
                    placeholder="30"
                    className="pl-10 h-11"
                    required
                  />
                  <div className="absolute right-3 top-3.5 text-[10px] text-muted-foreground uppercase font-bold">Days</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">Price (LKR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-muted-foreground font-bold text-xs">LKR</span>
                <Input
                  id="amount"
                  type="number"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="1500"
                  className="pl-12 h-11 text-lg font-bold"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  editingPreset ? "Update Plan" : "Create Plan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
