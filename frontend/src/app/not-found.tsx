import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-7xl mb-6">😅</div>
            <h1 className="text-3xl font-black font-jakarta text-white mb-4">
                Oops! We can't find that page
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-sm leading-relaxed">
                The page you are looking for might have been moved or doesn't exist anymore.
            </p>

            <Link
                href="/"
                className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
            >
                <Home className="w-5 h-5" /> Let's go back home
            </Link>
        </div>
    )
}
