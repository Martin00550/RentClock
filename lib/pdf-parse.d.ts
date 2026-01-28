declare module 'pdf-parse' {
    interface PDFData {
        numpages: number;
        numrender: number;
        info: unknown;
        metadata: unknown;
        version: string;
        text: string;
    }

    function pdfParse(dataBuffer: Buffer): Promise<PDFData>;
    export = pdfParse;
}
