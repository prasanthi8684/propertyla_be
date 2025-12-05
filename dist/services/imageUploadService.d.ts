import multer from 'multer';
export declare const upload: multer.Multer;
export declare const uploadToSpaces: (file: Express.Multer.File, folder?: string) => Promise<string>;
export declare const uploadMultipleToSpaces: (files: Express.Multer.File[], folder?: string) => Promise<string[]>;
export declare const deleteFromSpaces: (fileUrl: string) => Promise<void>;
export declare const deleteMultipleFromSpaces: (fileUrls: string[]) => Promise<void>;
//# sourceMappingURL=imageUploadService.d.ts.map