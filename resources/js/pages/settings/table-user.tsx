import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import type { Role, User } from '@/types';

interface UsersTableProps {
  data: User[];
  roles: Role[];
  handleChange: (userId: string, roleId: string) => void;
}

export function TableUser({ data, roles, handleChange }: UsersTableProps) {
  const getInitials = useInitials();

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((user) => (
        <Card key={user.id}>
          <CardHeader className="flex justify-center">
            <Avatar className="h-30 w-30 overflow-hidden rounded-full">
              <AvatarImage
                src={`/storage/${user?.avatarPath}`}
                alt={user.name}
                className="object-cover object-center"
              />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <p className="line-clamp-2 text-center break-words">{user.name}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="line-clamp-1 text-center font-light break-words text-blue-500">
                  {user.position}
                </p>
              </TooltipTrigger>
              <TooltipContent>{user.position}</TooltipContent>
            </Tooltip>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-center">
            <div className="flex justify-center gap-2">
              <Select
                className="w-full rounded px-3 py-2"
                defaultValue={user.roles?.[0]?.id?.toString() ?? ''}
                onValueChange={(value) => {
                  handleChange(user.id.toString(), value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.id} value={rol.id.toString()}>
                      {rol.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
