"use client"
import { useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const AuthValidator: React.FC<Props> = (props) => {

    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter()
    const pathname = usePathname()
    const authNotRequired = ['/sign-in', '/sign-up', '/music']

    if (!isLoaded) return <div>Loading...</div>

    if (!authNotRequired.some(ele => pathname.startsWith(ele)) && !isSignedIn) {
        router.push('/sign-in?redirect_url=' + encodeURIComponent(window.location.href));
        return null
    }

    return (
        <>{props.children}</>
    );
};

export default AuthValidator;