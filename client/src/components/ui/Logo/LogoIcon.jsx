import { cn } from "@/lib/utils"

function LogoIcon({ className }) {
    return (
        <div className="flex items-center space-x-2">
            <img src="/src/assets/logo.svg" alt="Acet Labs Logo" className={cn("h-8 w-8", className)} />
        </div>
    )
}

export default LogoIcon
