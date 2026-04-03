import React from "react";
import { Bell, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/context/NotificationContext";

const NotificationBell = () => {
  const { notifications, markAsRead, markAllRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        {notifications.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground">No notifications</div>
        )}
        {notifications.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className={`flex justify-between ${n.read ? "text-muted-foreground" : "font-medium"}`}
            onSelect={() => markAsRead(n.id)}
          >
            <div className="truncate">{n.message}</div>
            {!n.read && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <button
              className="w-full text-xs text-center text-primary"
              onClick={markAllRead}
            >
              Mark all read
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
