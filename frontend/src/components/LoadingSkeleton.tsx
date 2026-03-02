export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="w-full space-y-4 animate-pulse">
            {/* Simulate Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-slate-800 rounded-full" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                </div>
            </div>

            {/* Simulate Content Lines */}
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="glass p-6 rounded-2xl border-slate-800/50">
                    <div className="h-4 bg-slate-800/80 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-slate-800/50 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-slate-800/50 rounded w-5/6 mb-4" />
                    <div className="h-10 bg-slate-800/80 rounded-xl w-full mt-4" />
                </div>
            ))}
        </div>
    );
}
