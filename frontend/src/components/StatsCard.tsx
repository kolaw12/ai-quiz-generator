import { ReactNode } from "react";

export function StatsCard({ title, value, subtitle, icon, highlight }: { title: string, value: string | number, subtitle?: string, icon: ReactNode, highlight?: boolean }) {
    return (
        <div className={`glass-card p-6 flex items-start justify-between relative overflow-hidden ${highlight ? 'border-primary-500/50 bg-primary-500/5' : ''}`}>
            {highlight && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/10 blur-2xl rounded-full pointer-events-none" />
            )}
            <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-white mb-1">{value}</p>
                {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
            </div>
            <div className="p-3 bg-slate-800 rounded-xl text-slate-300">
                {icon}
            </div>
        </div>
    );
}
