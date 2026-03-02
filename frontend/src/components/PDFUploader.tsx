"use client";

import { useState } from "react";
import { UploadCloud, File, CheckCircle2 } from "lucide-react";

export function PDFUploader() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDrag = function (e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <form
                className={`glass-card p-12 text-center border-4 border-dashed rounded-3xl transition-all duration-300 ${dragActive ? "border-primary-500 bg-primary-500/5 shadow-[0_0_30px_-5px_#6C63FF]" : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
                    }`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="pdf-upload"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="hidden"
                />

                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    {file ? (
                        <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                            <p className="text-xl font-bold text-white mb-2">{file.name}</p>
                            <p className="text-slate-400 font-medium">Ready to be analyzed.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                                <UploadCloud className="w-10 h-10 text-primary-400" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 font-jakarta">Upload Past Questions</h3>
                            <p className="text-slate-400 mb-6 max-w-sm">
                                Drag and drop your PDF file here, or click to browse. We will extract all knowledge instantly.
                            </p>
                            <div className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
                                Select File
                            </div>
                        </div>
                    )}
                </label>
            </form>

            {file && (
                <button className="w-full mt-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-black text-xl rounded-2xl shadow-[0_0_20px_-5px_#6C63FF] hover:shadow-[0_0_30px_-5px_#6C63FF] transition-all flex items-center justify-center gap-3">
                    <File className="w-6 h-6 fill-current" /> Process Document
                </button>
            )}
        </div>
    );
}
