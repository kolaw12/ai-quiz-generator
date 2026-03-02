import Link from "next/link";
import { Brain, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Brain className="w-8 h-8 text-primary-500" />
                            <span className="font-jakarta font-bold text-2xl text-white">JAMB Master</span>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                            Empowering Nigerian students to crush their JAMB exams with completely personalized, AI-driven practice quizzes and instant feedback.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Practice</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Biology Quizzes</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Chemistry Quizzes</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Physics Quizzes</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">English Language</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
                    <p className="text-slate-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} JAMB AI Quiz Master. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                        Built with <Heart className="w-4 h-4 text-accent-500" /> for Nigeria.
                    </p>
                </div>
            </div>
        </footer>
    );
}
