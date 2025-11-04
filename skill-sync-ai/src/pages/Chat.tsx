import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Bell, 
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Mock data for contacts
  const contacts: Contact[] = [
    {
      id: 1,
      name: "Alice Johnson",
      lastMessage: "That sounds great! When can we start?",
      lastMessageTime: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Bob Smith",
      lastMessage: "Thanks for the session yesterday!",
      lastMessageTime: "1h ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Carol White",
      lastMessage: "Let me check my schedule",
      lastMessageTime: "3h ago",
      unread: 1,
      online: false,
    },
    {
      id: 4,
      name: "David Lee",
      lastMessage: "Perfect! See you then.",
      lastMessageTime: "1d ago",
      unread: 0,
      online: false,
    },
  ];

  // Mock messages for selected contact
  const messages: Message[] = selectedContact ? [
    {
      id: 1,
      message: "Hey! I'm interested in learning React from you.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      message: "Hi! That's great! I'd love to help you learn React. In exchange, I'd like to learn UI/UX design from you.",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      message: "Perfect match! I've been doing UI/UX for 5 years now.",
      timestamp: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      message: "Awesome! When would be a good time for our first session?",
      timestamp: "10:37 AM",
      isOwn: true,
    },
    {
      id: 5,
      message: "How about this weekend? Saturday afternoon works for me.",
      timestamp: "10:40 AM",
      isOwn: false,
    },
    {
      id: 6,
      message: "That sounds great! When can we start?",
      timestamp: "10:42 AM",
      isOwn: false,
    },
  ] : [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
                <h1 className="text-xl font-bold font-display">Messages</h1>
              </div>
              <Button variant="ghost" size="icon" className="relative rounded-2xl">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Avatar className="h-9 w-9 ring-2 ring-primary/10 cursor-pointer">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Contacts Sidebar */}
            <aside className="w-80 border-r border-border/40 bg-background flex flex-col">
              <div className="p-4 border-b border-border/40">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    className="pl-10 h-10 bg-muted/50 border-border/40 rounded-2xl"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full p-3 rounded-xl transition-all duration-200 hover:bg-muted/50 flex items-center gap-3 ${
                        selectedContact?.id === contact.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                          <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread > 0 && (
                        <Badge className="bg-primary text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {contact.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </aside>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-muted/30">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border/40 bg-background/95 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                              {selectedContact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {selectedContact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-background" />
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold">{selectedContact.name}</h2>
                          <p className="text-xs text-muted-foreground">
                            {selectedContact.online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Star className="h-4 w-4 mr-2" />
                          Rate after completion
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>View Swap Details</DropdownMenuItem>
                            <DropdownMenuItem>Block User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4 max-w-4xl mx-auto">
                      {messages.map((msg) => (
                        <ChatMessage
                          key={msg.id}
                          message={msg.message}
                          timestamp={msg.timestamp}
                          isOwn={msg.isOwn}
                          senderName={selectedContact.name}
                        />
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex gap-3 mb-4 animate-fade-in">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                              {selectedContact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-2xl px-4 py-2.5 flex items-center gap-1">
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur">
                    <div className="flex items-end gap-2 max-w-4xl mx-auto">
                      <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="min-h-[60px] max-h-[120px] resize-none rounded-2xl pr-12"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute bottom-2 right-2 rounded-xl h-8 w-8"
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                      </div>
                      <Button 
                        variant="gradient" 
                        size="icon" 
                        className="rounded-2xl h-10 w-10"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 inline-block">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a contact from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
