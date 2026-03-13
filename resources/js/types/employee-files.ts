export type DocumentStatus = 'pending' | 'approved' | 'rejected' | null;

export type Document = {
    path: string | null;
    status: DocumentStatus;
    note: string | null;
};

