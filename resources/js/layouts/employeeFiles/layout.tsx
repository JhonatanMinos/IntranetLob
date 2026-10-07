import type { ReactNode } from 'react';
import { PageHeader } from '@/components/page-header';

interface EmployeeFilesProps {
  children: ReactNode;
}

export default function EmployeeFilesLayout({ children }: EmployeeFilesProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6">
      <PageHeader
        title="Expedientes"
        description="Consulta el avance y administra la documentación de los colaboradores."
        eyebrow="Personas"
      />
      <main>{children}</main>
    </div>
  );
}
