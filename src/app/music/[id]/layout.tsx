import React from 'react'
import { Inter } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';
type Props = Readonly<{
    children: React.ReactNode;
}>
const inter = Inter({ subsets: ["latin"] });
const MusicLayout = ({ children }: Props) => {

    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}

export default MusicLayout