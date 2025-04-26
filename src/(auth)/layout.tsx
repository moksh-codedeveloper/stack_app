"use client";

import { useAuthStore } from "@/store/Auth"
import { ReactNode } from "react"
import { useRouter } from "next/router";
import React from "react";
const Layout = ({children}: {children: ReactNode}) => {
    const {session} = useAuthStore();
    const router = useRouter();
    React.useEffect(()=>{
        if(session){
            router.push("/")
        }
    },[session, router])

    if(session) return null;

    return(
        <div className="">
            <div className="">{children}</div>
        </div>
    )
}

export default Layout