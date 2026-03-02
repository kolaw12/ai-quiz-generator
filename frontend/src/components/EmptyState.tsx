import { ReactNode } from "react";

export function EmptyState({
    icon,
    title,
    description,
    action
}: {
    icon: ReactNode,
    title: string,
    description: string,
    action?: ReactNode
}) {
    return (
        <div className="w-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 bg-slate-900/30 rounded-3xl">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6 border border-slate-700 shadow-inner">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                {description}
            </p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
