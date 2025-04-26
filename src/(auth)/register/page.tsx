"use client";
import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";

function RegisterPage(){
    const {createAccount, login} = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // collect data 
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
        // validate 
        if (!email || !password) {
            setError(() => "Please fill out all the fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.toString())) {
            setError(() => "Please enter a valid email address");
            return;
        }

        if (password.toString().length < 6) {
            setError(() => "Password must be at least 6 characters long");
            return;
        }
        // call the store
        setIsLoading(() => true);
        setError("")
        const res = await createAccount(email?.toString(), password?.toString());
        if(res.error) {
            setError(() => res.error!.message)
        } else {
            const loginResponse = await login(email?.toString(), password?.toString())
            if(loginResponse.error){
                setError(() => loginResponse.error!.message);
            }
        }

        setIsLoading(() => false)
    }
    return(
        <div>

        </div>
    )
}