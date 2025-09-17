"use client";

import { PropsWithChildren, useContext, useEffect } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";
import { signIn } from "next-auth/react";
import { UserContext } from "@/app/rootprovider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";

export default function LoginWrapper({
    children,
}: Readonly<{
    children: any;
}>) {
    const { user, setUser } = useContext<any>(UserContext);
    const router = useRouter();


    useEffect(() => {
        if(user) {
            router.prefetch("/dashboard")
        }
    }, [user])

    return (
        <>
            {user ? (<><Link href={"/dashboard"}>
                {children}</Link></>) : (<>
                    <Dialog>
                        <DialogTrigger asChild>
                            {children}
                        </DialogTrigger>
                        <DialogContent className="flex flex-row p-0 w-[400px] h-[80vh]">
                            <div className="flex-1 flex flex-col p-12 space-y-10 overflow-y-auto">
                                <CircleNotchIcon weight="fill" className="h-10 w-10 text-white" />
                                <h1 className="text-3xl tracking-tighter">Put a contract on your goals</h1>

                                <h1 className="text-xl">Log in to Continue</h1>

                                <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full flex items-center justify-center gap-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="0 0 256 256"><path d="M228,128a100,100,0,1,1-22.86-63.64,12,12,0,0,1-18.51,15.28A76,76,0,1,0,203.05,140H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128Z"></path></svg>
                                    Continue with Google
                                </Button>



                                <p className="text-muted-foreground text-xs mt-8 text-center">By using Contracted you agree to our <span className="text-white/80">Terms of Service</span> and <span className="text-white/80">Privacy Policy</span></p>
                            </div>

                        </DialogContent>
                    </Dialog>
                </>)
            }
        </>

    );
}