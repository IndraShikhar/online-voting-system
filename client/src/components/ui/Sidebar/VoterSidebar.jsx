import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut, Vote, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../Logo/Logo";
import LogoIcon from "../Logo/LogoIcon";

export function VoterSidebar() {
    const links = [
        {
            label: "Dashboard",
            href: "/voter/dashboard",
            icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Elections",
            href: "/voter/elections",
            icon: <Vote className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Results",
            href: "/voter/results",
            icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Profile",
            href: "/voter/profile",
            icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Settings",
            href: "/voter/settings",
            icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Logout",
            href: "/logout",
            icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {open ? <Logo /> : <LogoIcon />}
                    <div className="mt-8 flex flex-col gap-2">
                        {links.map((link, idx) => (
                            <SidebarLink key={idx} link={link} />
                        ))}
                    </div>
                </div>
                <div>
                    <SidebarLink
                        link={{
                            label: "Manu Arora",
                            href: "/profile",
                            icon: (
                                <img
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop"
                                    className="h-7 w-7 shrink-0 rounded-full"
                                    width={50}
                                    height={50}
                                    alt="Avatar"
                                />
                            ),
                        }}
                    />
                </div>
            </SidebarBody>
        </Sidebar>
    );
}

export default VoterSidebar;
