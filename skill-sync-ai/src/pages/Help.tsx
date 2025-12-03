import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Search,
    HelpCircle,
    MessageCircle,
    Book,
    Video,
    Mail,
    Send
} from "lucide-react";
import { toast } from "sonner";

const faqs = [
    {
        category: "Getting Started",
        questions: [
            {
                question: "How do I create an account?",
                answer: "Click on the 'Sign Up' button in the top right corner, fill in your details including your email, name, and password. You'll also be asked to add skills you can teach and skills you want to learn."
            },
            {
                question: "How does skill matching work?",
                answer: "Our AI-powered matching algorithm analyzes your skills offered and skills wanted, then finds users whose skills complement yours. For example, if you offer React and want to learn Python, we'll match you with users who offer Python and want to learn React."
            },
            {
                question: "Is SkillSync free to use?",
                answer: "Yes! SkillSync is completely free to use. We believe in democratizing education and making skill exchange accessible to everyone."
            }
        ]
    },
    {
        category: "Skill Swaps",
        questions: [
            {
                question: "How do I request a skill swap?",
                answer: "Navigate to the Matches or Discover page, find a user you'd like to swap with, and click the 'Request Swap' button. Specify which skills you want to exchange and add a personalized message."
            },
            {
                question: "What happens after I send a swap request?",
                answer: "The other user will receive a notification about your request. They can accept, decline, or send you a message to discuss details. Once accepted, you can coordinate learning sessions through our messaging system."
            },
            {
                question: "Can I swap multiple skills with the same person?",
                answer: "Absolutely! You can create multiple swap requests with the same person for different skill combinations."
            },
            {
                question: "How do I cancel a swap?",
                answer: "Go to the Swaps page, find the swap you want to cancel, and click the 'Cancel' button. Both parties will be notified of the cancellation."
            }
        ]
    },
    {
        category: "Profile & Settings",
        questions: [
            {
                question: "How do I update my skills?",
                answer: "Go to your Profile page and click 'Edit Profile'. You can add or remove skills from both your 'Skills Offered' and 'Skills Wanted' lists."
            },
            {
                question: "Can I change my email address?",
                answer: "For security reasons, email changes require verification. Please contact our support team at support@skillsync.com to initiate an email change."
            },
            {
                question: "How do I delete my account?",
                answer: "Go to Settings > Account > Danger Zone and click 'Delete Account'. Please note that this action is irreversible and will permanently delete all your data."
            }
        ]
    },
    {
        category: "Reviews & Ratings",
        questions: [
            {
                question: "How do reviews work?",
                answer: "After completing a skill swap, both parties can leave reviews for each other. Reviews include a star rating (1-5) and optional written feedback about the learning experience."
            },
            {
                question: "Can I edit or delete my review?",
                answer: "You can edit your review within 48 hours of posting. After that, reviews become permanent to maintain authenticity and trust in the community."
            },
            {
                question: "What if I receive an unfair review?",
                answer: "If you believe a review violates our community guidelines, you can report it. Our team will investigate and take appropriate action."
            }
        ]
    },
    {
        category: "Safety & Privacy",
        questions: [
            {
                question: "Is my personal information safe?",
                answer: "Yes! We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties without your consent."
            },
            {
                question: "Can I control who sees my profile?",
                answer: "Yes! In Settings > Privacy, you can control your profile visibility, choose what information to display, and manage who can contact you."
            },
            {
                question: "How do I report inappropriate behavior?",
                answer: "Click the report button on any user's profile or message. Our moderation team reviews all reports within 24 hours and takes appropriate action."
            }
        ]
    }
];

const Help = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const [supportSubject, setSupportSubject] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // TODO: Implement API call to send support message
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Support request sent! We'll get back to you soon.");
            setSupportMessage("");
            setSupportSubject("");
        } catch (error) {
            toast.error("Failed to send support request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            q =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

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
                            <div className="flex-1" />
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
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    <HelpCircle className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-4xl font-bold font-display mb-2">How can we help?</h1>
                                <p className="text-muted-foreground text-lg">
                                    Search our FAQ or contact support
                                </p>
                            </div>

                            {/* Search Bar */}
                            <Card className="border-border/40 shadow-lg rounded-2xl mb-8">
                                <CardContent className="p-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search for help..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-12 h-12 text-base rounded-xl"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Links */}
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                <Card className="border-border/40 shadow-md rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-3">
                                            <Book className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Documentation</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Comprehensive guides and tutorials
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/40 shadow-md rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-3">
                                            <Video className="h-6 w-6 text-purple-500" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Video Tutorials</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Watch step-by-step video guides
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/40 shadow-md rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
                                            <MessageCircle className="h-6 w-6 text-green-500" />
                                        </div>
                                        <h3 className="font-semibold mb-1">Community Forum</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Connect with other users
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* FAQ Section */}
                            <Card className="border-border/40 shadow-md rounded-2xl mb-8">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                                    <CardDescription>
                                        Find answers to common questions about SkillSync
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredFaqs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground">
                                                No results found for "{searchQuery}"
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {filteredFaqs.map((category, categoryIndex) => (
                                                <div key={categoryIndex}>
                                                    <h3 className="font-semibold text-lg mb-3 text-primary">
                                                        {category.category}
                                                    </h3>
                                                    <Accordion type="single" collapsible className="space-y-2">
                                                        {category.questions.map((faq, faqIndex) => (
                                                            <AccordionItem
                                                                key={faqIndex}
                                                                value={`${categoryIndex}-${faqIndex}`}
                                                                className="border border-border/40 rounded-xl px-4"
                                                            >
                                                                <AccordionTrigger className="hover:no-underline">
                                                                    {faq.question}
                                                                </AccordionTrigger>
                                                                <AccordionContent className="text-muted-foreground">
                                                                    {faq.answer}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Support */}
                            <Card className="border-border/40 shadow-md rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Contact Support
                                    </CardTitle>
                                    <CardDescription>
                                        Can't find what you're looking for? Send us a message
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                placeholder="What do you need help with?"
                                                value={supportSubject}
                                                onChange={(e) => setSupportSubject(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Describe your issue or question..."
                                                rows={5}
                                                value={supportMessage}
                                                onChange={(e) => setSupportMessage(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="rounded-xl"
                                        >
                                            {isSubmitting ? (
                                                <>Sending...</>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Help;
