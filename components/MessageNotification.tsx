'use client';

import { useMessages } from '@/hooks/use-messages';
import { Badge } from '@/components/ui/badge';

interface MessageNotificationProps {
  className?: string;
}

export function MessageNotification({ className }: MessageNotificationProps) {
  const { unreadCount } = useMessages();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge 
      variant="destructive" 
      className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${className}`}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  );
}
