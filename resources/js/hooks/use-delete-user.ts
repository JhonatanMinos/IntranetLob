import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { destroy } from '@/routes/users';

export function useDeleteUser() {
  return (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    router.delete(destroy.delete(id), {
      onSuccess: () =>
        toast.success('Usuario eliminado', {
          position: 'bottom-right',
        }),
      onError: () =>
        toast.error('Error al eliminar usuario', {
          position: 'bottom-right',
        }),
    });
  };
}
