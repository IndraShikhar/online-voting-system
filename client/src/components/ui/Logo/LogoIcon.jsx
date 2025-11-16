import { motion } from "framer-motion";
import { Vote } from "lucide-react";
import { cn } from "../../../lib/utils";

function LogoIcon({ className }) {
    return (
        <motion.div
            className="flex items-center justify-center relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Animated background glow */}
            <motion.div
                className="w-12 h-12 absolute text-center bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur-sm opacity-75"
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
            />

            {/* Main icon */}
            <motion.div
                className={cn(
                    "relative bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg",
                    className
                )}
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Vote className="h-6 w-6 text-white" />
            </motion.div>
        </motion.div>
    )
}

export default LogoIcon
