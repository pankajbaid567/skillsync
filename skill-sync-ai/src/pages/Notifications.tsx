import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Search,
    Check,
    X,
    MessageSquare,
    Users,
    Repeat,
    Star,
    Heart,
    AlertCircle,
    Trash2
} from "lucide-react";
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

const Notifications = () => {
    const { user } = useAuth();
    const { notifications, markNotificationAsRead, deleteNotification, clearAllNotifications } = useSocket();
    const [activeTab, setActiveTab] = useState("all");

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "match":
                return <Users className="h-5 w-5 text-primary" />;
            case "message":
                return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case "swap":
                return <Repeat className="h-5 w-5 text-secondary" />;
            case "review":
                return <Star className="h-5 w-5 text-warning" />;
            case "system":
                return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const markAllAsRead = () => {
        notifications.forEach(n => {
            if (!n.read) {
                markNotificationAsRead(n.id);
            }
        });
    };

    const clearAll = () => {
        if (confirm("Are you sure you want to clear all notifications?")) {
            clearAllNotifications();
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === "all") return true;
        if (activeTab === "unread") return !notif.read;
        return notif.type === activeTab;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const userInitials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex h-16 items-center gap-4 px-6">
                            <SidebarTrigger />
                            <div className="flex-1 flex items-center gap-4">
                                <div className="relative max-w-md w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search notifications..."
                                        className="pl-10 h-10 bg-muted/50 border-border/40 rounded-2xl"
                                    />
                                </div>
                            </div>
                            <Avatar className="h-9 w-9 ring-2 ring-primary/10 cursor-pointer">
                                <AvatarImage src={user?.avatar} alt={user?.name} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto bg-muted/30">
                        <div className="container mx-auto p-6 max-w-4xl">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold font-display">Notifications</h1>
                                    <p className="text-muted-foreground mt-1">
                                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            className="rounded-xl"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Mark all as read
                                        </Button>
                                    )}
                                    {notifications.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearAll}
                                            className="rounded-xl"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Clear all
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid rounded-2xl">
                                    <TabsTrigger value="all" className="rounded-xl">
                                        All
                                        {notifications.length > 0 && (
                                            <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                                                {notifications.length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="unread" className="rounded-xl">
                                        Unread
                                        {unreadCount > 0 && (
                                            <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1">
                                                {unreadCount}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="match" className="rounded-xl">
                                        <Users className="h-4 w-4 lg:mr-2" />
                                        <span className="hidden lg:inline">Matches</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="message" className="rounded-xl">
                                        <MessageSquare className="h-4 w-4 lg:mr-2" />
                                        <span className="hidden lg:inline">Messages</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="swap" className="rounded-xl">
                                        <Repeat className="h-4 w-4 lg:mr-2" />
                                        <span className="hidden lg:inline">Swaps</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="review" className="rounded-xl">
                                        <Star className="h-4 w-4 lg:mr-2" />
                                        <span className="hidden lg:inline">Reviews</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value={activeTab} className="space-y-3">
                                    {filteredNotifications.length === 0 ? (
                                        <Card className="border-border/40 shadow-md rounded-2xl">
                                            <CardContent className="flex flex-col items-center justify-center py-12">
                                                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                                                <p className="text-sm text-muted-foreground text-center">
                                                    {activeTab === "unread"
                                                        ? "You're all caught up! No unread notifications."
                                                        : "You don't have any notifications yet."}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        filteredNotifications.map((notification) => (
                                            <Card
                                                key={notification.id}
                                                className={`border-border/40 shadow-sm rounded-2xl transition-all hover:shadow-md ${!notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                                                    }`}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        {notification.avatar ? (
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarImage src={notification.avatar} alt={notification.userName} />
                                                                <AvatarFallback>
                                                                    {notification.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                                                                {getNotificationIcon(notification.type)}
                                                            </div>
                                                        )}

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-sm mb-1">
                                                                        {notification.title}
                                                                    </h4>
                                                                    <p className="text-sm text-muted-foreground mb-2">
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {!notification.read && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 rounded-full"
                                                                            onClick={() => markNotificationAsRead(notification.id)}
                                                                        >
                                                                            <Check className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Notifications;
