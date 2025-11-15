import { BarChart3, LayoutDashboard, ListChecks, LogOut, Settings, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import Logo from "../Logo/Logo";
import LogoIcon from "../Logo/LogoIcon";
import { Sidebar, SidebarBody, SidebarLink } from "./Sidebar";

export function AdminSidebar() {
    const links = [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Elections",
            href: "/admin/elections",
            icon: <ListChecks className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Candidates",
            href: "/admin/candidates",
            icon: <UserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Voters",
            href: "/admin/voters",
            icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Results",
            href: "/admin/results",
            icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />,
        },
        {
            label: "Settings",
            href: "/admin/settings",
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
                            href: "/admin/profile",
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

export default AdminSidebar;
