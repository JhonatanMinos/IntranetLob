import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FormUser } from '../form-user';
import { SimpleModel, Store, User } from '@/types';

interface EditUserDialogProps {
    user: User | null; // puede ser null si no hay usuario seleccionado
    open: boolean;
    onClose: () => void;
    departments: SimpleModel[];
    stores: Store[];
    company: SimpleModel[];
}

export function EditUserDialog({
    user,
    open,
    onClose,
    departments,
    stores,
    company,
}: EditUserDialogProps) {
    if (!user) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Editar Usuario </DialogTitle>
                    <DialogDescription>
                        Actualizar los detalles del perfil del colaborador
                    </DialogDescription>
                </DialogHeader>
                <FormUser
                    departments={departments}
                    stores={stores}
                    company={company}
                    user={user}
                />
            </DialogContent>
        </Dialog>
    );
}
