import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";
import { LayoutDashboard, UserCog, LogOut, Vote, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../Logo/Logo";
import LogoIcon from "../Logo/LogoIcon";
import { useAuth } from "../../../auth/AuthContext";
import { cn } from "../../../lib/utils";

export function VoterSidebar() {
    const { user } = useAuth();
    const links = [
        {
            label: "Dashboard",
            href: "/voter/dashboard",
            icon: <LayoutDashboard className="text-neutral-300 hover:text-blue-400 h-6 w-6 shrink-0 transition-colors duration-200" />,
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            label: "Elections",
            href: "/voter/elections",
            icon: <Vote className="text-neutral-300 hover:text-emerald-400 h-6 w-6 shrink-0 transition-colors duration-200" />,
            gradient: "from-emerald-500 to-green-500"
        },
        {
            label: "Results",
            href: "/voter/results",
            icon: <BarChart3 className="text-neutral-300 hover:text-yellow-400 h-6 w-6 shrink-0 transition-colors duration-200" />,
            gradient: "from-yellow-500 to-orange-500"
        },
        {
            label: "Profile",
            href: "/voter/profile",
            icon: <UserCog className="text-neutral-300 hover:text-purple-400 h-6 w-6 shrink-0 transition-colors duration-200" />,
            gradient: "from-purple-500 to-pink-500"
        },
        {
            label: "Logout",
            href: "/logout",
            icon: <LogOut className="text-neutral-300 hover:text-red-400 h-6 w-6 shrink-0 transition-colors duration-200" />,
            gradient: "from-red-500 to-rose-500"
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-8">
                <div className="flex flex-col flex-1 min-h-0">
                    <div className="mb-8 shrink-0">
                        {open ? <Logo /> : <LogoIcon />}
                    </div>
                    <nav className="flex flex-col gap-3 flex-1 overflow-visible">
                        {links.map((link, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: open ? 6 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative"
                            >
                                <SidebarLink
                                    link={link}
                                    className="hover:bg-neutral-800 rounded-lg py-4 px-4 transition-all duration-200 group relative overflow-visible"
                                />
                            </motion.div>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-neutral-700 pt-6 shrink-0">
                    <motion.div
                        whileHover={{ scale: open ? 1.02 : 1.1 }}
                        className={cn(
                            "rounded-xl transition-all duration-200 shadow-lg",
                            open
                                ? "bg-gradil from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 border border-neutral-600 p-5"
                                : ""
                        )}
                    >
                        <SidebarLink
                            link={{
                                label: open ? (
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white">{user?.name || "Voter"}</span>
                                        <span className="text-xs text-neutral-300">{user?.email || "voter@example.com"}</span>
                                        <span className="text-xs text-blue-400 font-medium">View Profile</span>
                                    </div>
                                ) : "",
                                href: "/voter/profile",
                                icon: (
                                    <div className="relative">

                                        {user.avatar_url ?
                                            (<div>
                                                <img src={user.avatar_url} alt={user.name} className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0" />
                                            </div>)
                                            :
                                            (<div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-white" />
                                            </div>)
                                        }
                                        <div className={cn(
                                            "absolute bg-green-500 rounded-full border-2 border-neutral-800",
                                            open ? "-bottom-1 -right-1 w-3 h-3" : "-bottom-0.5 -right-0.5 w-2 h-2"
                                        )}></div>
                                    </div>
                                ),
                            }}
                            className="text-white hover:bg-neutral-600/20 rounded-lg transition-colors duration-200"
                        />
                    </motion.div>

                </div>
            </SidebarBody>
        </Sidebar>
    );
}

export default VoterSidebar;
