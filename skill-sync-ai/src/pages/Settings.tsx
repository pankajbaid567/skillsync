import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Lock,
    User,
    Mail,
    Shield,
    Trash2,
    Search,
    Loader2,
    Camera,
    Save
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [matchNotifications, setMatchNotifications] = useState(true);
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [swapNotifications, setSwapNotifications] = useState(true);

    // Privacy settings
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showLocation, setShowLocation] = useState(true);

    // Account settings
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSaveNotifications = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement API call to save notification preferences
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Notification preferences saved!");
        } catch (error) {
            toast.error("Failed to save preferences");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePrivacy = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement API call to save privacy settings
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Privacy settings saved!");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement API call to change password
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement API call to delete account
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Account deleted successfully");
            // Redirect to login or home
        } catch (error) {
            toast.error("Failed to delete account");
        } finally {
            setIsLoading(false);
        }
    };

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
                                        placeholder="Search settings..."
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
                        <div className="container mx-auto p-6 max-w-5xl">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold font-display">Settings</h1>
                                <p className="text-muted-foreground mt-1">
                                    Manage your account settings and preferences
                                </p>
                            </div>

                            <Tabs defaultValue="account" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid rounded-2xl">
                                    <TabsTrigger value="account" className="rounded-xl">
                                        <User className="h-4 w-4 mr-2" />
                                        Account
                                    </TabsTrigger>
                                    <TabsTrigger value="notifications" className="rounded-xl">
                                        <Bell className="h-4 w-4 mr-2" />
                                        Notifications
                                    </TabsTrigger>
                                    <TabsTrigger value="privacy" className="rounded-xl">
                                        <Shield className="h-4 w-4 mr-2" />
                                        Privacy
                                    </TabsTrigger>
                                    <TabsTrigger value="security" className="rounded-xl">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Security
                                    </TabsTrigger>
                                </TabsList>

                                {/* Account Tab */}
                                <TabsContent value="account" className="space-y-6">
                                    <Card className="border-border/40 shadow-md rounded-2xl">
                                        <CardHeader>
                                            <CardTitle>Profile Information</CardTitle>
                                            <CardDescription>
                                                Update your account profile information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <Avatar className="h-24 w-24">
                                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                                                            {userInitials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                                                    >
                                                        <Camera className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{user?.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input id="name" defaultValue={user?.name} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" type="email" defaultValue={user?.email} disabled />
                                                    <p className="text-xs text-muted-foreground">
                                                        Contact support to change your email address
                                                    </p>
                                                </div>
                                            </div>

                                            <Button className="rounded-xl">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/40 shadow-md rounded-2xl border-destructive/50">
                                        <CardHeader>
                                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                            <CardDescription>
                                                Irreversible actions for your account
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                variant="destructive"
                                                onClick={handleDeleteAccount}
                                                disabled={isLoading}
                                                className="rounded-xl"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Notifications Tab */}
                                <TabsContent value="notifications" className="space-y-6">
                                    <Card className="border-border/40 shadow-md rounded-2xl">
                                        <CardHeader>
                                            <CardTitle>Notification Preferences</CardTitle>
                                            <CardDescription>
                                                Choose how you want to be notified
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Email Notifications</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Receive notifications via email
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={emailNotifications}
                                                        onCheckedChange={setEmailNotifications}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Push Notifications</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Receive push notifications in browser
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={pushNotifications}
                                                        onCheckedChange={setPushNotifications}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>New Matches</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Get notified when you have new skill matches
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={matchNotifications}
                                                        onCheckedChange={setMatchNotifications}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Messages</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Get notified about new messages
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={messageNotifications}
                                                        onCheckedChange={setMessageNotifications}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Swap Requests</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Get notified about swap requests and updates
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={swapNotifications}
                                                        onCheckedChange={setSwapNotifications}
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleSaveNotifications}
                                                disabled={isLoading}
                                                className="rounded-xl"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Preferences
                                                    </>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Privacy Tab */}
                                <TabsContent value="privacy" className="space-y-6">
                                    <Card className="border-border/40 shadow-md rounded-2xl">
                                        <CardHeader>
                                            <CardTitle>Privacy Settings</CardTitle>
                                            <CardDescription>
                                                Control who can see your information
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Public Profile</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Make your profile visible to other users
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={profileVisibility}
                                                        onCheckedChange={setProfileVisibility}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Show Email</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Display your email on your public profile
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={showEmail}
                                                        onCheckedChange={setShowEmail}
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label>Show Location</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Display your location on your profile
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={showLocation}
                                                        onCheckedChange={setShowLocation}
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={handleSavePrivacy}
                                                disabled={isLoading}
                                                className="rounded-xl"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Settings
                                                    </>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Security Tab */}
                                <TabsContent value="security" className="space-y-6">
                                    <Card className="border-border/40 shadow-md rounded-2xl">
                                        <CardHeader>
                                            <CardTitle>Change Password</CardTitle>
                                            <CardDescription>
                                                Update your password to keep your account secure
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleChangePassword} className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="current-password">Current Password</Label>
                                                    <Input
                                                        id="current-password"
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="new-password">New Password</Label>
                                                    <Input
                                                        id="new-password"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="rounded-xl"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Changing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="h-4 w-4 mr-2" />
                                                            Change Password
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Settings;
