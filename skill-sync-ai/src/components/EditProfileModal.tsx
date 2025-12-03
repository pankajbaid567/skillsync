import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditProfileModal = ({ open, onOpenChange }: EditProfileModalProps) => {
    const { user, refreshUser } = useAuth();
    const queryClient = useQueryClient();
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [location, setLocation] = useState(user?.location || "");
    const [skillsOffered, setSkillsOffered] = useState<string[]>(user?.skillsOffered || []);
    const [skillsWanted, setSkillsWanted] = useState<string[]>(user?.skillsWanted || []);
    const [newSkillOffered, setNewSkillOffered] = useState("");
    const [newSkillWanted, setNewSkillWanted] = useState("");

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: async () => {
            await refreshUser();
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            toast.success("Profile updated successfully!");
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    const handleAddSkillOffered = () => {
        if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
            setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
            setNewSkillOffered("");
        }
    };

    const handleAddSkillWanted = () => {
        if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
            setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
            setNewSkillWanted("");
        }
    };

    const handleRemoveSkillOffered = (skill: string) => {
        setSkillsOffered(skillsOffered.filter(s => s !== skill));
    };

    const handleRemoveSkillWanted = (skill: string) => {
        setSkillsWanted(skillsWanted.filter(s => s !== skill));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate({
            name,
            bio,
            location,
            skillsOffered,
            skillsWanted,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto rounded-2xl">
                <DialogHeader className="text-center sm:text-left">
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information and skills
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell others about yourself..."
                            rows={3}
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                        />
                    </div>

                    {/* Skills Offered */}
                    <div className="space-y-2">
                        <Label>Skills You Offer</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newSkillOffered}
                                onChange={(e) => setNewSkillOffered(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkillOffered())}
                                placeholder="Add a skill you can teach"
                            />
                            <Button type="button" onClick={handleAddSkillOffered} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skillsOffered.map((skill) => (
                                <Badge
                                    key={skill}
                                    className="bg-primary/10 text-primary border-primary/20 pr-1"
                                >
                                    {skill}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                        onClick={() => handleRemoveSkillOffered(skill)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Skills Wanted */}
                    <div className="space-y-2">
                        <Label>Skills You Want to Learn</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newSkillWanted}
                                onChange={(e) => setNewSkillWanted(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkillWanted())}
                                placeholder="Add a skill you want to learn"
                            />
                            <Button type="button" onClick={handleAddSkillWanted} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skillsWanted.map((skill) => (
                                <Badge
                                    key={skill}
                                    className="bg-secondary/10 text-secondary border-secondary/20 pr-1"
                                >
                                    {skill}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                        onClick={() => handleRemoveSkillWanted(skill)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
