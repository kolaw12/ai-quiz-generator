import Navbar from "@/components/Navbar";
import { PDFUploader } from "@/components/PDFUploader";
import { FileText, Database, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-32 max-w-4xl flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-black font-jakarta text-white mb-6 text-center">Injest Syllabus Knowledge</h1>
                <p className="text-slate-400 text-lg mb-12 text-center max-w-2xl">
                    Upload any PDF containing JAMB past questions or textbook material. Our AI RAG system will instantly vectorize the content, creating a personalized quiz bank just for you.
                </p>

                <PDFUploader />

                <div className="grid md:grid-cols-3 gap-8 mt-16 w-full text-center">
                    <div className="flex flex-col items-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                        <div className="w-12 h-12 bg-primary-500/10 text-primary-400 rounded-full flex items-center justify-center mb-4"><Database className="w-6 h-6" /></div>
                        <h3 className="text-slate-200 font-bold mb-2">Vectorized Storage</h3>
                        <p className="text-slate-500 text-sm">We use ChromaDB to store embeddings and quickly search text.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4"><ShieldCheck className="w-6 h-6" /></div>
                        <h3 className="text-slate-200 font-bold mb-2">Secure Parsing</h3>
                        <p className="text-slate-500 text-sm">Your files are parsed securely without sharing data externally.</p>
                    </div>
                    <div className="flex flex-col items-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                        <div className="w-12 h-12 bg-accent-500/10 text-accent-400 rounded-full flex items-center justify-center mb-4"><FileText className="w-6 h-6" /></div>
                        <h3 className="text-slate-200 font-bold mb-2">Instant Quizzes</h3>
                        <p className="text-slate-500 text-sm">Generate thousands of questions dynamically from one file.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
