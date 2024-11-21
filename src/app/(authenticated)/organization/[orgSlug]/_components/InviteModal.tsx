'use client';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, KeyboardEvent, FormEvent } from "react";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendEmailInvitationforOrg } from "@/server/action/organization"; // You'll need to create this

export function InviteMemberModal({ orgId }: { orgId: string }) {
    const [emails, setEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleAddEmail = () => {
        const trimmedEmail = inputValue.trim();
        
        if (!trimmedEmail) return;

        if (!validateEmail(trimmedEmail)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return;
        }

        if (emails.includes(trimmedEmail)) {
            toast({
                title: "Duplicate email",
                description: "This email has already been added",
                variant: "destructive",
            });
            return;
        }

        setEmails([...emails, trimmedEmail]);
        setInputValue("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const removeEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove));
    };

    const handleInvite = async () => {
        if (emails.length === 0) {
            toast({
                title: "No emails added",
                description: "Please add at least one email address",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await sendEmailInvitationforOrg(orgId, emails);
            toast({
                title: "Invites sent successfully",
                description: `Invitations sent to ${emails.length} email${emails.length > 1 ? 's' : ''}`,
            });
            setEmails([]);
            setIsOpen(false);
        } catch (error) {
            toast({
                title: "Failed to send invites",
                description: "An error occurred while sending invitations",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    Invite Members
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                    <DialogDescription>
                        Enter email and then press 'Return ⏎' or click Add to add to invite list.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="email@example.com"
                        type="email"
                    />
                    <Button onClick={handleAddEmail}>Add</Button>
                </div>
                
                {emails.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {emails.map((email) => (
                            <div 
                                key={email} 
                                className="flex items-center justify-between bg-secondary p-2 rounded-md"
                            >
                                <span className="text-sm">{email}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEmail(email)}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter className="flex justify-between mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleInvite} 
                        disabled={emails.length === 0 || isLoading}
                    >
                        {isLoading ? "Sending invites..." : "Send Invites"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}