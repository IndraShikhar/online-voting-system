import { motion } from "framer-motion";

function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <img src="/src/assets/logo.svg" alt="Acet Labs Logo" className="h-8 w-8" />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className=" text-black dark:text-white font-bold  text-xl whitespace-pre">
                Smart<span className="text-blue-600">Vote</span>
            </motion.p>
        </div>
    )
}

export default Logo
