import { router } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { CreateEvent } from '@/pages/Events/create-event';

interface EventLayoutProps {
  children: ReactNode;
}

export default function EventLayout({ children }: EventLayoutProps) {
  const [openModal, setOpenModal] = useState(false);
  const today = new Date();
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6">
      <PageHeader
        title={format(today, 'MMMM yyyy', {
          locale: es,
        })}
        description="Consulta y administra los eventos del calendario corporativo."
        eyebrow="Calendario"
        actions={
          <Button className="shrink-0" onClick={() => setOpenModal(true)}>
            <Plus size={16} /> Agregar evento
          </Button>
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
              router.reload({ only: ['results'] });
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
