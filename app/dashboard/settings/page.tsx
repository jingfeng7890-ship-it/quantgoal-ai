'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { Save, User, Bell, Shield, Smartphone, Globe } from 'lucide-react';

export default function SettingsPage() {
    const { user, isPro } = useAuth();

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">System Configuration</h1>
                <p className="text-zinc-400">Manage your profile, notifications, and algorithm preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card className="p-6 border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)]">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Profile Identity</h2>
                            <p className="text-xs text-zinc-500">Your digital footprint in the league.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Email Address</label>
                            <Input value={user?.email || ''} readOnly className="bg-zinc-950 border-zinc-800 text-zinc-400" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Membership Tier</label>
                            <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-zinc-800 bg-zinc-950 text-white font-mono text-sm">
                                {isPro ? 'PRO ACCESS' : 'Basic Plan'}
                                {isPro && <span className="ml-auto w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Preferences */}
                <Card className="p-6 border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Odds & Localization</h2>
                            <p className="text-xs text-zinc-500">Customize how data is presented.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Odds Format</label>
                            <select className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-950 text-white text-sm focus:outline-none focus:border-[var(--brand)]">
                                <option>Decimal (2.50)</option>
                                <option>Fractional (3/2)</option>
                                <option>American (+150)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Timezone</label>
                            <select className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-950 text-white text-sm focus:outline-none focus:border-[var(--brand)]">
                                <option>UTC (Coordinated Universal Time)</option>
                                <option>EST (New York)</option>
                                <option>PST (Los Angeles)</option>
                                <option>CET (London)</option>
                                <option>CST (Beijing)</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="p-6 border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-10 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Notifications</h2>
                            <p className="text-xs text-zinc-500">Control your alert stream.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded bg-zinc-950 border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Shield size={16} className="text-zinc-500" />
                                <div>
                                    <div className="text-sm font-medium text-white">High Alpha Alerts</div>
                                    <div className="text-xs text-zinc-500">Get notified when Edge &gt; 10%</div>
                                </div>
                            </div>
                            <div className="h-5 w-9 bg-[var(--brand)] rounded-full relative cursor-pointer">
                                <div className="absolute top-1 right-1 h-3 w-3 bg-black rounded-full" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded bg-zinc-950 border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Smartphone size={16} className="text-zinc-500" />
                                <div>
                                    <div className="text-sm font-medium text-white">War Room Pings</div>
                                    <div className="text-xs text-zinc-500">Updates when AI debate concludes</div>
                                </div>
                            </div>
                            <div className="h-5 w-9 bg-zinc-700 rounded-full relative cursor-pointer">
                                <div className="absolute top-1 left-1 h-3 w-3 bg-zinc-400 rounded-full" />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button variant="accent" size="lg" className="gap-2">
                        <Save size={16} /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
