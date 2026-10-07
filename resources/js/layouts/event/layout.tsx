import { router } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { CreateEvent } from '@/pages/Events/create-event';

interface EventLayoutProps {
  children: ReactNode;
  canCreate?: boolean;
}

export default function EventLayout({ children, canCreate = false }: EventLayoutProps) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6">
      <PageHeader
        title="Calendario corporativo"
        description="Consulta y administra los eventos del calendario corporativo."
        eyebrow="Calendario"
        actions={
          canCreate ? (
            <Button className="shrink-0" onClick={() => setOpenModal(true)}>
              <Plus size={16} /> Agregar evento
            </Button>
          ) : undefined
        }
      />
      <main>{children}</main>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear nuevo evento</DialogTitle>
          </DialogHeader>
          <CreateEvent
            onSuccess={() => {
              setOpenModal(false);
              router.reload({ only: ['results', 'calendarEvents'] });
              toast.success('Evento creado correctamente', {
                position: 'bottom-right',
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
