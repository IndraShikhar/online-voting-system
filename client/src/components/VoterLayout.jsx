import { Outlet } from "react-router-dom"
import { cn } from "../lib/utils"
import VoterSidebar from "./ui/Sidebar/VoterSidebar"

function VoterLayout() {
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <VoterSidebar />
            <div className="flex flex-1">
                <div className="rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default VoterLayout
