"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    FileText, 
    Upload, 
    Trash2, 
    Download, 
    File,
    Image,
    Loader2,
    FolderLock,
    FileArchive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
    uploadVaultDocument, 
    getVaultDocuments, 
    getSignedDocumentUrl, 
    deleteVaultDocument,
    VaultDocument 
} from "@/actions/vault-documents";

interface DocumentVaultProps {
    leaseId: string;
}

function getFileIcon(fileType: string) {
    if (fileType.includes("pdf")) return FileText;
    if (fileType.includes("image")) return Image;
    if (fileType.includes("zip") || fileType.includes("archive")) return FileArchive;
    return File;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

export function DocumentVault({ leaseId }: DocumentVaultProps) {
    const [documents, setDocuments] = useState<VaultDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        const docs = await getVaultDocuments(leaseId);
        setDocuments(docs);
        setIsLoading(false);
    }, [leaseId]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    useEffect(() => {
        const getUrls = async () => {
            const urls: Record<string, string> = {};
            for (const doc of documents) {
                const url = await getSignedDocumentUrl(doc.file_path);
                if (url) urls[doc.id] = url;
            }
            setSignedUrls(urls);
        };
        if (documents.length > 0) {
            getUrls();
        }
    }, [documents]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadVaultDocument(leaseId, formData);
        
        if (result.error) {
            alert(result.error);
        } else {
            await loadDocuments();
        }
        
        setIsUploading(false);
        e.target.value = "";
    };

    const handleDelete = async (doc: VaultDocument) => {
        if (!confirm(`Delete "${doc.file_name}"?`)) return;
        
        setDeletingId(doc.id);
        const result = await deleteVaultDocument(doc.id, doc.file_path, leaseId);
        
        if (result.error) {
            alert(result.error);
        } else {
            await loadDocuments();
        }
        setDeletingId(null);
    };

    const handleDownload = (docId: string) => {
        const url = signedUrls[docId];
        if (url) {
            window.open(url, "_blank");
        }
    };

    return (
        <Card className="border-slate-200 shadow-sm" style={{ borderRadius: 'var(--fluid-radius)' }}>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100" style={{ padding: 'var(--fluid-p)' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#1e3a5f] p-2 rounded-xl">
                            <FolderLock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                                Secure Document Vault
                            </CardTitle>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                Store lease-related documents securely
                            </p>
                        </div>
                    </div>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="application/pdf,image/*,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Add Document
                                </>
                            )}
                        </Button>
                    </label>
                </div>
            </CardHeader>
            <CardContent style={{ padding: 'var(--fluid-p)' }}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#1e3a5f]" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mx-auto bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                            <FileText className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                            No documents stored yet
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                            Upload lease agreements, amendments, or other important documents
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => {
                            const FileIcon = getFileIcon(doc.file_type);
                            const signedUrl = signedUrls[doc.id];
                            
                            return (
                                <div 
                                    key={doc.id}
                                    className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn(
                                            "p-2 rounded-lg shrink-0",
                                            doc.file_type.includes("pdf") ? "bg-red-100" :
                                            doc.file_type.includes("image") ? "bg-blue-100" : "bg-slate-100"
                                        )}>
                                            <FileIcon className={cn(
                                                "h-4 w-4",
                                                doc.file_type.includes("pdf") ? "text-red-600" :
                                                doc.file_type.includes("image") ? "text-blue-600" : "text-slate-600"
                                            )} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">
                                                {doc.file_name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {formatFileSize(doc.file_size)} • {formatDate(doc.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {signedUrl && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-[#1e3a5f]"
                                                onClick={() => handleDownload(doc.id)}
                                                title="View/Download"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-red-600"
                                            onClick={() => handleDelete(doc)}
                                            disabled={deletingId === doc.id}
                                            title="Delete"
                                        >
                                            {deletingId === doc.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
