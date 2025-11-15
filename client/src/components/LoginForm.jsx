"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    IconBrandGoogle,
} from "@tabler/icons-react";
import LogoIcon from "./ui/Logo/LogoIcon";
import { Link } from "react-router-dom";

export default function LoginForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
    };
    return (
        <div
            className="shadow-input mx-auto w-full max-w-md rounded-none bg-neutral-900 p-4 md:rounded-2xl md:p-8 border border-neutral-800 text-white">
            <div className="flex w-full justify-center items-center gap-4">
                <LogoIcon className="h-18 w-18" />
                <div className="flex flex-col justify-center items-start gap-2">
                    <div className="text-white font-bold text-4xl whitespace-pre">
                        Smart
                        <span className="text-blue-600">
                            Vote
                        </span>
                    </div>
                    <span className="text-white text-xs whitespace-pre">
                        A secure online voting management system.</span>
                </div>
            </div>
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="projectmayhem" type="text" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-neutral-800 to-neutral-700 font-medium text-white shadow-[0px_1px_0px_0px_rgba(255,255,255,0.06)_inset]"
                    type="submit">
                    Login
                    <BottomGradient />
                </button>
                <div
                    className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-zinc-800 px-4 font-medium text-white"
                        type="submit">
                        <IconBrandGoogle className="h-4 w-4 text-neutral-200" />
                        <span className="text-sm text-neutral-200">
                            Google
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-2">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary cursor-pointer hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
