import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

interface UserAvatarProps {
  name: string;
  email?: string;
  photoUrl?: string;
  size?: 'sm' | 'md';
  nameAsLink?: string;
}

export function UserAvatar({
  name,
  email,
  photoUrl,
  size = 'sm',
  nameAsLink,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className={cn(size === 'sm' && 'h-8 w-8', size === 'md' && 'h-10 w-10')}>
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        {nameAsLink ? (
          <Link
            href={nameAsLink}
            className="text-sm font-medium text-primary hover:underline truncate"
          >
            {name}
          </Link>
        ) : (
          <span className="text-sm font-medium text-foreground truncate">{name}</span>
        )}
        {email && (
          <span className="text-xs text-muted-foreground truncate">{email}</span>
        )}
      </div>
    </div>
  );
}
