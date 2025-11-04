import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sparkles, Search, Bell, MessageSquare, Brain, Menu, Home, Compass, Shuffle, Zap, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [notificationCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Navigation links for authenticated users
  const authenticatedLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/discover", label: "Discover", icon: Compass },
    { path: "/matches", label: "AI Matches", icon: Zap },
    { path: "/swaps", label: "My Swaps", icon: Shuffle },
    { path: "/messages", label: "Messages", icon: MessageSquare },
  ];

  // Navigation links for public users
  const publicLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/#about", label: "About", icon: HelpCircle },
  ];

  const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left Section - Branding */}
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-primary to-emerald-500 shadow-md group-hover:shadow-lg transition-shadow">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            SkillSync
          </span>
        </Link>

        {/* Center Section - Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section - Actions & User Menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Search Icon (Desktop) */}
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5 text-gray-600" />
              </Button>

              {/* AI Match Button */}
              <Link to="/matches">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden xl:inline">Find Match</span>
                </Button>
              </Link>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hidden md:flex">
                <Bell className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </Button>

              {/* Messages */}
              <Link to="/messages" className="hidden md:block">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                </Button>
              </Link>

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                      <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/help" className="cursor-pointer flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Help Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Public/Unauthenticated state */}
              <Link to="/login" className="hidden md:block">
                <Button variant="outline" size="sm" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="hidden md:block">
                <Button
                  size="sm"
                  className="text-sm bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl"
                >
                  Join SkillSync 🚀
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-gradient-to-br from-gray-50 to-blue-50">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                    SkillSync
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <SheetClose asChild key={link.path}>
                      <Link
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          isActive(link.path)
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-white/70"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                {isAuthenticated ? (
                  <>
                    <hr className="my-2" />
                    <SheetClose asChild>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-white/70"
                      >
                        <User className="h-5 w-5" />
                        My Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-white/70"
                      >
                        <Settings className="h-5 w-5" />
                        Settings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-white/70 w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <div className="mt-4 space-y-3 px-4">
                    <SheetClose asChild>
                      <Link to="/login" className="block w-full">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/signup" className="block w-full">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600">
                          Join SkillSync 🚀
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
