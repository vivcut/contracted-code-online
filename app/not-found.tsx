"use client";

import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='w-screen h-screen grid place-content-center'>
            <Navbar />
            <div className="flex flex-col justify-center space-y-8 items-center">
                <h1 className='text-6xl font-bold tracking-tighter'>404</h1>
                <p className='text-2xl text-muted-foreground font-[500] text-center'>We couldn't find the page you <br/> were looking for</p>
                <Button variant={"secondary"}>Take me home</Button>
            </div>
        </div>
    )
}