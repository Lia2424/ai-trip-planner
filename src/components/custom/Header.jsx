import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        // Check user authentication
    }, [])

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
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                        <Link to="/" className="flex items-center space-x-2">
                            <Plane className="h-8 w-8 text-primary" />
                            <span className="font-bold text-xl">TripKitAI</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1 justify-end mr-4">
                        <Link to="/faq" className="text-foreground/60 hover:text-foreground transition-colors">
                            FAQ
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-2 justify-end">
                        {user ? (
                            <div className='flex items-center gap-3'>
                                <Link to='/create-trip'>
                                    <Button size="sm" variant="ghost">
                                        Create Trip
                                    </Button>
                                </Link>
                                <Link to='/my-trips'>
                                    <Button size="sm" variant="ghost">
                                        My Trips
                                    </Button>
                                </Link>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <img src={user?.picture}
                                            alt="profile"
                                            className='w-8 h-8 rounded-full object-cover cursor-pointer' />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <h2 className='cursor-pointer'
                                            onClick={() => {
                                                googleLogout();
                                                localStorage.clear();
                                                window.location.reload();
                                            }}>Logout</h2>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ) : (
                            <>
                                <Button size="sm" variant="ghost" onClick={() => setOpenDialogue(true)}>
                                    Sign In
                                </Button>
                                <Link to="/create-trip">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Sign In</DialogTitle>
                        <DialogDescription className="space-y-6">
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
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </header>
    )
}

export default Header
