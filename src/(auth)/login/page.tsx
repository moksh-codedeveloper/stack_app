"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/Auth";
import { handleWebpackExternalForEdgeRuntime } from "next/dist/build/webpack/plugins/middleware-plugin";

export default function LoginPage() {
    const {login} = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //collecting the data 
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        
        // validation
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.toString())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.toString().length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        // call the store 
        setIsLoading(() => true) 
        setError(() => "")
        const loginResponse = await login(email.toString(), password.toString());
        if(loginResponse.error){
            setError(() => loginResponse.error!.message)
        }
        setIsLoading(() => false)

    }

    return (
        <div>

        </div>
    )
}