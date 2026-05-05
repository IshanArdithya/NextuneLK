"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Mail, Lock, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminSetupPage() {
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        const secretPath = process.env.NEXT_PUBLIC_ADMIN_URI_PATH || "admin";
        if (!isPending && !session) {
            router.push(`/${secretPath}/admin/login`);
        }
        if (session?.user && !(session.user as any).needsPasswordChange) {
            router.push(`/${secretPath}/admin`);
        }
    }, [session, isPending, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.post(
                "/admin/auth/finalize-setup",
                { newEmail, newPassword }
            );

            if (!response.data.success) {
                setError(response.data.msg || "Failed to finalize setup.");
                setLoading(false);
                return;
            }

            setSuccess(true);
            const secretPath = process.env.NEXT_PUBLIC_ADMIN_URI_PATH || "admin";
            setTimeout(() => {
                router.push(`/${secretPath}/admin`);
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.msg || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };


    if (isPending) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-100/30 via-slate-50 to-slate-50 dark:from-emerald-900/10 dark:via-slate-950 dark:to-slate-950">
            <div className="w-full max-w-lg">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                        <ShieldCheck className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center">Finalize Your Security</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">
                        Welcome to your new dashboard. Please set up your permanent admin credentials to proceed.
                    </p>
                </div>

                <Card className="border-none shadow-2xl dark:bg-slate-900/50 backdrop-blur-sm border-t-4 border-t-orange-500">
                    <CardHeader>
                        <CardTitle>Account Setup</CardTitle>
                        <CardDescription>
                            Configure your permanent administrative access
                        </CardDescription>
                    </CardHeader>
                    {success ? (
                        <CardContent className="flex flex-col items-center py-12">
                            <CheckCircle2 className="h-16 w-16 text-orange-500 mb-4 animate-in zoom-in duration-300" />
                            <h2 className="text-xl font-semibold">Security Setup Complete!</h2>
                            <p className="text-slate-500 mt-2">Redirecting you to the dashboard...</p>
                        </CardContent>
                    ) : (
                        <form onSubmit={handleUpdate}>
                            <CardContent className="space-y-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="new-email">New Admin Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                        <Input
                                            id="new-email"
                                            type="email"
                                            placeholder="your-name@nextune.com"
                                            className="pl-10 h-11 bg-white dark:bg-slate-950"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-11"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-11"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Securing Account...
                                        </>
                                    ) : (
                                        "Save Credentials & Continue"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
