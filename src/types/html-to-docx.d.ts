declare module 'html-to-docx' {
    interface DocumentOptions {
        orientation?: 'portrait' | 'landscape';
        pageSize?: {
            width: number;
            height: number;
        };
        margins?: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
    }

    export default function HTMLtoDOCX(params: {
        html: string;
        documentOptions?: DocumentOptions;
    }): Promise<Blob>;
}
