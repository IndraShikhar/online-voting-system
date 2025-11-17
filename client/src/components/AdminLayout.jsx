
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  PlusCircle,
  List,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";
import AdminSidebar from "./ui/Sidebar/AdminSidebar";

export default function AdminLayout() {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-neutral-900 w-full min-h-screen max-h-screen",
        "overflow-hidden"
      )}
    >
      <AdminSidebar />
      <div className="flex flex-1 min-w-0">
        <div className="bg-neutral-900 flex flex-col flex-1 w-full min-h-screen overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
