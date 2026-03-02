import { router } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { CreateEvent } from '@/pages/Events/create-event';
import { Toaster } from '@/components/ui/sonner';

interface EventLayoutProps {
    children: ReactNode;
}

export default function EventLayout({ children }: EventLayoutProps) {
    const [openModal, setOpenModal] = useState(false);
    const today = new Date();
    return (
        <div className="flex h-full flex-col space-y-6 overflow-y-auto px-3 py-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {format(today, 'MMMM', {
                            locale: es,
                        }).toUpperCase()}
                    </h2>
                </div>
                <Button
                    className="shrink-0 bg-blue-500 text-white"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={16} /> agregar Evento
                </Button>
            </div>
            <main>{children}</main>
            <Toaster richColors />
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="sm:max-w-[500px]">
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
