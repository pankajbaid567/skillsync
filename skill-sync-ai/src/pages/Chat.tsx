import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { getSwapMessages } from "@/services/message.service";
import { getMySwaps } from "@/services/swap.service";
import { getUserById } from "@/services/user.service";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationBell } from "@/components/NotificationBell";
import { EmptyState } from "@/components/EmptyState";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Star,
  Loader2,
  MessageSquare,
  Repeat,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ConversationUser {
  id: number;
  name: string;
  avatar?: string;
}

interface Conversation {
  swapId: number;
  partner: ConversationUser;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  skillOffered: string;
  skillRequested: string;
  status: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { socket, isConnected, joinSwapRoom, leaveSwapRoom } = useSocket();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSwapId, setSelectedSwapId] = useState<number | null>(null);
  const [directUserId, setDirectUserId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Join swap room when selected
  useEffect(() => {
    if (selectedSwapId && isConnected) {
      joinSwapRoom(selectedSwapId);

      return () => {
        leaveSwapRoom(selectedSwapId);
      };
    }
  }, [selectedSwapId, isConnected, joinSwapRoom, leaveSwapRoom]);

  // Get swapId or userId from URL params
  useEffect(() => {
    const swapIdParam = searchParams.get('swapId');
    const userIdParam = searchParams.get('userId');

    if (swapIdParam) {
      setSelectedSwapId(Number(swapIdParam));
      setDirectUserId(null);
    } else if (userIdParam) {
      setDirectUserId(Number(userIdParam));
      setSelectedSwapId(null);
    }
  }, [searchParams]);

  // Fetch all swaps to build conversations list
  const { data: swaps = [], isLoading: swapsLoading } = useQuery({
    queryKey: ['mySwaps'],
    queryFn: getMySwaps,
  });

  // Fetch direct user data if userId is provided
  const { data: directUser, isLoading: directUserLoading } = useQuery({
    queryKey: ['directUser', directUserId],
    queryFn: () => getUserById(directUserId!),
    enabled: !!directUserId,
  });

  // Fetch messages for selected swap
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['swapMessages', selectedSwapId],
    queryFn: () => getSwapMessages(selectedSwapId!),
    enabled: !!selectedSwapId,
  });

  // For direct messaging, we'll use an empty array for now (no message history)
  const directMessages: any[] = [];

  // Build conversations from swaps
  const conversations: Conversation[] = swaps
    .filter(swap => swap.status === 'ACCEPTED' || swap.status === 'COMPLETED')
    .map(swap => {
      const isRequester = swap.requester.id === user?.id;
      const partner = isRequester ? swap.receiver : swap.requester;

      return {
        swapId: swap.id,
        partner: {
          id: partner.id,
          name: partner.name,
          avatar: partner.avatar,
        },
        lastMessage: swap.lastMessage?.content,
        lastMessageTime: swap.lastMessage?.createdAt ? new Date(swap.lastMessage.createdAt) : undefined,
        unreadCount: swap.unreadCount || 0,
        skillOffered: swap.skillOffered,
        skillRequested: swap.skillRequested,
        status: swap.status,
      };
    });

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(c => c.swapId === selectedSwapId);

  // Create direct conversation object if userId is provided
  const directConversation = directUser ? {
    partner: {
      id: directUser.id,
      name: directUser.name,
      avatar: directUser.avatar,
    },
    skillOffered: 'Direct Message',
    skillRequested: '',
    status: 'DIRECT',
  } : null;

  // Determine which conversation/messages to show
  const activeConversation = selectedConversation || directConversation;
  const activeMessages = selectedSwapId ? messages : directMessages;
  const isDirectMessage = !!directUserId && !selectedSwapId;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: any) => {
      if (message.swapId === selectedSwapId) {
        refetchMessages();
      }
    };

    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [socket, isConnected, selectedSwapId, refetchMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (isDirectMessage) {
      // For direct messages, prompt user to create a swap first
      toast.info("To send messages, please create a skill swap request first.", {
        description: "Click 'Request Swap' button above to start exchanging skills.",
      });
      return;
    }

    if (!selectedSwapId || !socket || !isConnected) {
      if (!isConnected) {
        toast.error("Not connected to chat server");
      }
      return;
    }

    // Send message via socket
    socket.emit('message', {
      swapId: selectedSwapId,
      content: messageInput.trim(),
    });

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (swapId: number) => {
    setSelectedSwapId(swapId);
    setSearchParams({ swapId: swapId.toString() });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = user?.name ? getUserInitials(user.name) : "U";

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
              <NotificationBell />
              <Avatar className="h-9 w-9 ring-2 ring-primary/10 cursor-pointer" onClick={() => navigate('/profile')}>
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Conversations Sidebar */}
            <aside className="w-80 border-r border-border/40 bg-background flex flex-col">
              <div className="p-4 border-b border-border/40">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 bg-muted/50 border-border/40 rounded-2xl"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                {swapsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? "No conversations found" : "No active conversations yet"}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 rounded-xl"
                        onClick={() => navigate('/matches')}
                      >
                        Find Matches
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.swapId}
                        onClick={() => handleSelectConversation(conversation.swapId)}
                        className={`w-full p-3 rounded-xl transition-all duration-200 hover:bg-muted/50 flex items-center gap-3 ${selectedSwapId === conversation.swapId ? "bg-muted" : ""
                          }`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.partner.avatar} alt={conversation.partner.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                              {getUserInitials(conversation.partner.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{conversation.partner.name}</h3>
                            {conversation.lastMessageTime && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage || `${conversation.skillOffered} ↔ ${conversation.skillRequested}`}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-primary text-white h-5 min-w-5 px-1.5 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </aside>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-muted/30">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border/40 bg-background/95 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate(`/profile/${activeConversation.partner.id}`)}>
                          <AvatarImage src={activeConversation.partner.avatar} alt={activeConversation.partner.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {getUserInitials(activeConversation.partner.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold cursor-pointer hover:text-primary" onClick={() => navigate(`/profile/${activeConversation.partner.id}`)}>
                            {activeConversation.partner.name}
                          </h2>
                          <p className="text-xs text-muted-foreground">
                            {isDirectMessage ? 'Direct Message' : `${activeConversation.skillOffered} ↔ ${activeConversation.skillRequested}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isDirectMessage && activeConversation.status === 'COMPLETED' && (
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Star className="h-4 w-4 mr-2" />
                            Leave Review
                          </Button>
                        )}
                        {isDirectMessage && (
                          <Button variant="gradient" size="sm" className="rounded-xl" onClick={() => navigate(`/profile/${activeConversation.partner.id}`)}>
                            <Repeat className="h-4 w-4 mr-2" />
                            Request Swap
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/profile/${activeConversation.partner.id}`)}>
                              View Profile
                            </DropdownMenuItem>
                            {!isDirectMessage && (
                              <DropdownMenuItem onClick={() => navigate(`/swaps`)}>
                                View Swap Details
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    {(messagesLoading || directUserLoading) ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : isDirectMessage ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md">
                          <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            To send messages to {activeConversation.partner.name}, you'll need to create a skill swap request first.
                          </p>
                          <Button variant="gradient" className="rounded-xl" onClick={() => navigate(`/profile/${activeConversation.partner.id}`)}>
                            <Repeat className="h-4 w-4 mr-2" />
                            Request Skill Swap
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-4xl mx-auto">
                        {activeMessages.map((msg: any) => (
                          <ChatMessage
                            key={msg.id}
                            message={msg.content}
                            timestamp={new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            isOwn={msg.senderId === user?.id}
                            senderName={activeConversation.partner.name}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
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
                        disabled={!messageInput.trim() || !isConnected}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    {!isConnected && (
                      <p className="text-xs text-destructive text-center mt-2">
                        Not connected to chat server
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    title="Select a conversation"
                    description="Choose a contact from the list to start chatting"
                  />
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
