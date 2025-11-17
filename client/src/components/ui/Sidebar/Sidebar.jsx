import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}) => {
    const [openState, setOpenState] = useState(false);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...props} />
        </>
    );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <motion.div
            className={cn(
                "h-screen px-4 py-6 hidden md:flex md:flex-col bg-neutral-900 border-r border-neutral-700 shrink-0 shadow-xl relative",
                className
            )}
            animate={{
                width: animate ? (open ? "280px" : "80px") : "280px",
            }}
            transition={{
                duration: 0.3,
                ease: "easeInOut"
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            style={{
                overflow: "visible"
            }}
            {...props}
        >
            <div className="flex flex-col h-full overflow-visible">
                {children}
            </div>
        </motion.div>
    );
};

export const MobileSidebar = ({ className, children, ...props }) => {
    const { open, setOpen } = useSidebar();
    return (
        <>
            <div
                className={cn(
                    "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-900 border-b border-neutral-700 w-full"
                )}
                {...props}
            >
                <div className="flex justify-end z-20 w-full">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                    >
                        <Menu
                            className="text-neutral-200 cursor-pointer h-5 w-5"
                            onClick={() => setOpen(!open)}
                        />
                    </motion.div>
                </div>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={cn(
                                "fixed h-screen w-full inset-0 bg-neutral-900 p-6 z-50 flex flex-col justify-between border-r border-neutral-700",
                                className
                            )}
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute right-6 top-6 z-50 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
                                onClick={() => setOpen(!open)}
                            >
                                <X className="text-neutral-200 h-5 w-5" />
                            </motion.div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export const SidebarLink = ({ link, className, ...props }) => {
    const { open, animate } = useSidebar();
    return (
        <Link
            to={link.href}
            className={cn(
                "flex items-center justify-start gap-4 group/sidebar rounded-lg transition-all duration-200 hover:bg-neutral-800/50 relative",
                className
            )}
            {...props}
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 flex-shrink-0"
            >
                {link.icon}
            </motion.div>
            <motion.span
                animate={{
                    opacity: animate ? (open ? 1 : 0) : 1,
                    width: animate ? (open ? "auto" : "0px") : "auto",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-neutral-200 text-sm font-medium group-hover/sidebar:text-white transition-colors duration-200 whitespace-nowrap overflow-hidden relative z-10"
                style={{
                    display: animate ? (open ? "block" : "none") : "block"
                }}
            >
                {link.label}
            </motion.span>
            {/* Tooltip for collapsed state */}
            {animate && !open && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {link.label}
                </div>
            )}
        </Link>
    );
};

export default Sidebar;
