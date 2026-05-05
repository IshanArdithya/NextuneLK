"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } = await authClient.signIn.email({
                email,
                password,
            });

            if (authError) {
                setError(authError.message || "Invalid credentials. Please try again.");
                return;
            }

            const user = data?.user as any;
            const secretPath = process.env.NEXT_PUBLIC_ADMIN_URI_PATH || "admin";

            if (user?.needsPasswordChange) {
                router.push(`/${secretPath}/admin/setup`);
            } else {
                router.push(`/${secretPath}/admin`);
            }

        } catch (err: any) {
            setError("A connection error occurred. Please check your internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa] selection:bg-orange-600/10 font-sans">
            <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
            />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#fafafa_100%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-1">
                        Nextune
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                        <div className="h-px w-4 bg-slate-200" />
                        Administrator Login
                        <div className="h-px w-4 bg-slate-200" />
                    </div>
                </div>

                {/* Login Card */}
                <Card className="bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-t-2 border-t-orange-600">
                    <CardContent className="p-8">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Alert className="bg-red-50 border-red-100 text-red-600 py-2.5 px-3">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription className="text-xs font-semibold ml-2">{error}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">
                                        Email Address
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@nextune.com"
                                            className="pl-9 h-11 bg-white border-slate-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 transition-all text-slate-900 placeholder:text-slate-300"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-0.5">
                                        Password
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••••••"
                                            className="pl-9 h-11 bg-white border-slate-200 focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 transition-all text-slate-900 placeholder:text-slate-300"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all duration-200 shadow-md shadow-orange-600/10 mt-2 active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
