"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud, CheckCircle2, Loader2, FileText, AlertCircle } from "lucide-react";

export default function AdminUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "SUCCESS" | "ERROR">("IDLE");
    const [progress, setProgress] = useState(0); // Optional visual filler

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                toast.error("Format Rejected. Must be a precise PDF document.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setStatus("IDLE");
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus("UPLOADING");

        try {
            const formData = new FormData();
            formData.append("file", file);

            // POST to NextJs proxy which routes to FastAPI Admin Endpoints automatically handling MultiPart Form Data
            const response = await axios.post("/api/admin/rag/upload", formData, {
                headers: {
                    // Let Axios auto-generate boundary headers for multipart/form-data
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setProgress(percentCompleted);
                }
            });

            setStatus("SUCCESS");
            toast.success(response.data.message);
            setFile(null);
        } catch (error: any) {
            console.error(error);
            setStatus("ERROR");
            toast.error(error.response?.data?.detail || "Transfer pipeline failed.");
        }
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-black font-jakarta text-white">RAG Ingestion Queue</h1>
                <p className="text-slate-400 mt-2">
                    Deposit raw JAMB syllabuses or questions into the central neural store. Files are processed synchronously in the background.
                </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-10 text-center relative overflow-hidden group hover:border-indigo-500/20 transition-all shadow-2xl">
                <input
                    type="file"
                    id="doc-upload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <label
                    htmlFor="doc-upload"
                    className="flex flex-col items-center justify-center cursor-pointer min-h-[250px] border-2 border-dashed border-slate-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-2xl transition-all p-6"
                >
                    {status === "SUCCESS" ? (
                        <div className="text-emerald-500 flex flex-col items-center">
                            <CheckCircle2 className="w-16 h-16 mb-4 drop-shadow-lg" />
                            <h3 className="text-xl font-bold font-jakarta text-white">Transfer Completed</h3>
                            <p className="text-sm font-medium mt-2 text-emerald-400/80">
                                Vector Generation Initiated. The neural store will align indices shortly.
                            </p>
                        </div>
                    ) : status === "UPLOADING" ? (
                        <div className="text-indigo-400 flex flex-col items-center">
                            <Loader2 className="w-16 h-16 mb-4 animate-spin drop-shadow-lg" />
                            <h3 className="text-xl font-bold font-jakarta text-white">Transmitting Payload...</h3>

                            <div className="w-full max-w-sm mt-6">
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 font-bold mt-2 font-mono">{progress}% COMPLETED</p>
                            </div>
                        </div>
                    ) : file ? (
                        <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                <FileText className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold font-jakarta text-white">{file.name}</h3>
                            <p className="text-sm font-medium text-slate-400 mt-2">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for Ingestion
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                                <UploadCloud className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold font-jakarta text-white mb-2">Drag & Drop Documents</h3>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm">
                                Support for `.PDF` syllabus materials. Limit payload to 50MB.
                            </p>

                            <div className="mt-8 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm tracking-wide group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                SELECT FILE
                            </div>
                        </div>
                    )}
                </label>
            </div>

            <div className="flex justify-between items-start pt-6 border-t border-slate-800">
                <div className="flex gap-3 text-slate-400 max-w-md">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
                    <p className="text-xs leading-relaxed">
                        <strong className="text-slate-200">Processing Warning:</strong> Heavy payloads may require 3-5 minutes for ChromDB to finalize embedding dimensions onto the cluster. Monitor terminal logs.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        disabled={!file || status === "UPLOADING"}
                        onClick={() => { setFile(null); setStatus("IDLE"); setProgress(0); }}
                        className="px-6 py-3 font-bold text-sm rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear
                    </button>
                    <button
                        disabled={!file || status === "UPLOADING"}
                        onClick={handleUpload}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {status === "UPLOADING" ? "INITIALIZING..." : "COMMENCE RAG"}
                    </button>
                </div>
            </div>
        </div>
    );
}
