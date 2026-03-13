import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

interface EmployeeFilesProps {
    children: ReactNode;
}

export default function EmployeeFilesLayout({ children }: EmployeeFilesProps) {
    return (
        <div className="flex h-full flex-col space-y-6 overflow-y-auto px-3 py-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Listado de Expedientes
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Gestiona y organiza todos los expedientes de la empresa.
                    </p>
                </div>
            </div>
            <main>{children}</main>
            <Toaster richColors />
        </div>
    );
}
