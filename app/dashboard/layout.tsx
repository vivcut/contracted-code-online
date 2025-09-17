"use client";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/spinner";
import { signIn, signOut, useSession } from "next-auth/react";
import { cloneElement, createContext, useContext, useEffect, useState } from "react";
import { PurchaseContext, UserContext } from "../rootprovider";
import { Article, ArticleIcon, BellSimpleIcon, CardholderIcon, ChatsTeardropIcon, Coin, CurrencyEthIcon, Gear, Heart, OpenAiLogoIcon, Person, PersonArmsSpreadIcon, PersonIcon, QuestionMarkIcon, Scan, ScissorsIcon, SidebarSimpleIcon, SignOut, Smiley, SmileyStickerIcon, SmileyWinkIcon, Tag, List, House, Flag, FlagBannerFoldIcon, FlagIcon, HouseIcon, ArrowClockwiseIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FlagOff, MenuIcon, Rainbow } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Document, LetterOpened, Moon, Sun, NotificationUnread, SidebarMinimalistic, HomeSmileAngle, Book, PeopleNearby, QuestionSquare, Target, Settings, User, UserPlus, AddSquare, Fire, FireMinimalistic, BoltCircle, Bell, InfoSquare, Flag2, HomeAngle, ArrowLeft, ArrowRight, Home } from '@solar-icons/react';
import { cn, font } from "@/lib/utils";
import { PT_Serif } from "next/font/google";
import FadeIn from "react-fade-in";
import { Bolt } from "@solar-icons/react/ssr";
import { createClientCall } from "@/supabase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";



const supabase = createClientCall();

export default function Layout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const [showPurchase, setShowPurchase] = useState<any>(false);
    const { user, setUser } = useContext<any>(UserContext);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { setTheme } = useTheme()
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const loading = status === "loading" || status === "authenticated" && !user;

    useEffect(() => {
        if (status == "unauthenticated") {
            window.location.href = "/";
        }
    }, [status]);

    useEffect(() => {
        if (isMobile) {
            setSidebarCollapsed(false); // Start expanded on mobile when menu is opened
        }
    }, [isMobile]);
    // The Flag icon may not show because its color is set to "text-white" but your sidebar background is also white.
    // Try removing "text-white" or set it to a contrasting color like "text-primary" or "text-black".
    const navLinks = [
        { href: "/dashboard", icon: <Flag2 />, label: "Challeges" },

    ];

    return (
        <div className="w-screen h-screen flex sm:px-60" style={{ position: "relative" }}>
            {/* Background image with reduced opacity */}
            
            <div
                style={{
                    backgroundImage: 'url("/spec.jpg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "saturate(0.34) brightness(0.3)",
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            />

            <CircleNotchIcon weight="fill" className="size-8 absolute right-2 bottom-2"/>
            {/* Mobile Menu Button (only shows on mobile) */}
            {/* {isMobile && (
                <Button
                    onClick={() => {
                        setShowMobileMenu(!showMobileMenu);
                        setSidebarCollapsed(false); // Ensure expanded view when menu opens
                    }}
                    className="fixed rounded-lg top-2 right-2 z-50 h-10 w-10"
                >
                    <List weight="bold" className="size-5" />
                </Button>
            )} */}

            <div className={`w-full h-screen flex flex-col flex-grow-[1] overflow-y-hidden ${isMobile && showMobileMenu ? "ml-0" : ""} ${!isMobile && "p-1"}`} style={{ position: "relative", zIndex: 1 }}>
                <div className="flex w-full h-[44px] items-center justify-between p-2 space-x-2">
                    <div className="w-fit space-x-2 items-center">
                        <button
                            className="p-1.5 rounded-md bg-white/10"
                            onClick={() => window.location.href = "/dashboard"}
                            aria-label="Go to Dashboard"
                        >
                            <Home weight="Bold" className="size-4 text-white hover:text-primary transition-colors duration-200" />
                        </button>
                        <button
                            className="p-1.5 rounded-md bg-white/10"
                            onClick={() => window.location.reload()}
                            aria-label="Reload Page"
                        >
                            <ArrowClockwiseIcon weight="fill" className="size-4 text-white hover:text-primary transition-colors duration-200" />
                        </button>
                        <button
                            className="p-1.5 rounded-md bg-white/10"
                            onClick={() => window.history.back()}
                            aria-label="Go Back"
                        >
                            <ArrowLeft weight="Bold" className="size-4 text-white hover:text-primary transition-colors duration-200" />
                        </button>
                        <button
                            className="p-1.5 rounded-md bg-white/10"
                            onClick={() => window.history.forward()}
                            aria-label="Go Forward"
                        >
                            <ArrowRight weight="Bold" className="size-4 text-white hover:text-primary transition-colors duration-200" />
                        </button>
                    </div>

                    <Avatar>
                        <AvatarImage src={user?.image}></AvatarImage>
                        <AvatarFallback className="text-white rounded-md">
                            {user?.name?.charAt(0).toUpperCase() || "U"}   </AvatarFallback>

                    </Avatar>
                </div>
                <section className={`pb-0 w-full h-[calc(100vh-48px)] bg-card backdrop-blur-2xl ${!isMobile ? "rounded-2xl rounded-b-none p-10 pt-0" : "px-4 pt-5"}`}>
                    <div className={`w-full h-full transition-all duration-[1200ms] ease-in-out flex overflow-y-auto flex-col space-y-1.5 ${loading ? "opacity-0 select-none pointer-events-none" : "opacity-100"}`}>
                        <PurchaseContext.Provider value={{ showPurchase, setShowPurchase }}>
                            <div className="mb-10"></div>
                            {children}
                            <div className="mb-10"></div>
                        </PurchaseContext.Provider>
                    </div>
                </section>
            </div>
        </div>
    );
}