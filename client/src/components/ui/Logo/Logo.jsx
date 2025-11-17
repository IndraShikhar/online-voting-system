import { motion } from "framer-motion";
import { Vote } from "lucide-react";

function Logo() {
    return (
        <div className="flex items-center space-x-3">
            <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Animated background glow */}
                <motion.div
                    className="w-12 h-12 absolute text-center bg-linear-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur-sm opacity-75"
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
                    className="relative bg-linear-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Vote className="h-6 w-6 text-white" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col"
            >
                <motion.p
                    className="text-white font-bold text-xl leading-tight"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    Smart<motion.span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
                        animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        Vote
                    </motion.span>
                </motion.p>
                <motion.p
                    className="text-neutral-400 text-xs font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Secure Democracy
                </motion.p>
            </motion.div>
        </div>
    )
}

export default Logo
