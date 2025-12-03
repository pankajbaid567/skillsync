import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, X, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    type: "match" | "message" | "swap" | "review" | "system";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    avatar?: string;
    userName?: string;
}

export const NotificationBell = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const { notifications, markNotificationAsRead, deleteNotification } = useSocket();

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.id);
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            setOpen(false);
        }
    };

    const viewAllNotifications = () => {
        navigate("/notifications");
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-2xl">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="rounded-full">
                            {unreadCount} new
                        </Badge>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground text-center">
                                No notifications yet
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.slice(0, 5).map((notification, index) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-3">
                                        {notification.avatar && (
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={notification.avatar} alt={notification.userName} />
                                                <AvatarFallback>
                                                    {notification.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium mb-0.5">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {!notification.read && (
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <>
                        <Separator />
                        <div className="p-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-center rounded-xl"
                                onClick={viewAllNotifications}
                            >
                                View all notifications
                                <ExternalLink className="h-3 w-3 ml-2" />
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
};
