import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { Plane } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';

/**
 * Header component with navigation and authentication
 * Handles Google OAuth login and displays user menu when authenticated
 */
function Header() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [openDialogue, setOpenDialogue] = useState(false);


    // Google OAuth login configuration
    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: () => {
            toast.error('Failed to sign in');
        },
        scope: "profile email"
    })

    // Fetch user profile after successful OAuth authentication
    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialogue(false);
            window.location.reload()
        })
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 py-3">
                    <div className="flex items-center space-x-2 flex-1">
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-muted shadow-warm">
                                <Plane className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-base text-foreground">TripKitAI</span>
                                <span className="hidden sm:block text-[9px] mt-1 uppercase tracking-[0.16em] text-muted-foreground">Go somewhere good</span>
                            </div>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1 justify-end mr-4">
                        <Link to="/create-trip" className="text-muted-foreground hover:text-foreground">Plan a trip</Link>
                        <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                            FAQ
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-2 justify-end">
                        {user ? (
                            <div className='flex items-center gap-3'>
                                <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <Link to='/create-trip'>Plan trip</Link>
                                </Button>
                                <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <Link to='/my-trips'>My trips</Link>
                                </Button>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button aria-label="Open account menu" className="rounded-full"><img src={user?.picture}
                                            alt="profile"
                                            className='w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-border' /></button>
                                    </PopoverTrigger>
                                    <PopoverContent className="travel-surface border-border">
                                        <button className='text-foreground'
                                            onClick={() => {
                                                googleLogout();
                                                localStorage.removeItem('user');
                                                window.location.reload();
                                            }}>Sign out</button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ) : (
                            <>
                                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setOpenDialogue(true)}>
                                    Sign In
                                </Button>
                                <Button asChild size="sm" className="rounded-full"><Link to="/create-trip">Get started</Link></Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
                <DialogContent className="sm:max-w-md travel-surface border-border">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Sign In</DialogTitle>
                        <DialogDescription asChild><div className="space-y-6">
                            <div className="flex flex-col items-start pt-2">
                                <div className="flex items-center space-x-2">
                                    <Plane className="h-5 w-5 text-primary" />
                                    <span className="font-bold text-lg text-foreground">TripKitAI</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 text-left">
                                <div>
                                    <h2 className='font-semibold text-lg text-foreground mb-2'>Sign In With Google</h2>
                                    <p className='text-sm text-muted-foreground'>Sign in to save and manage your trips</p>
                                </div>
                                <Button
                                    onClick={login}
                                    className='w-full flex gap-3 items-center justify-start py-6'>
                                    <FcGoogle className='h-5 w-5' />
                                    <span>Sign In With Google</span>
                                </Button>
                            </div>
                        </div></DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </header>
    )
}

export default Header
