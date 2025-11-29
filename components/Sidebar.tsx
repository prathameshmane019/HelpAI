"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { decodeJwt } from "jose";
import { getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  LayoutDashboard,
  Ticket,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const payload = decodeJwt(token);
    setRole(payload.role as string);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const adminMenu: MenuItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "All Tickets", href: "/admin/tickets", icon: <Ticket size={18} /> },
    { name: "Agents", href: "/admin/agents", icon: <Users size={18} /> },
    { name: "Document Manager", href: "/admin/documents", icon: <FileText size={18} /> }, 
  ];

  const agentMenu: MenuItem[] = [
    { name: "My Dashboard", href: "/agent/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Assigned Tickets", href: "/agent/tickets", icon: <Ticket size={18} /> },
  ];

  const menu = role === "ADMIN" ? adminMenu : agentMenu;

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col p-5">
     <div 
                 className="flex items-center   cursor-pointer"
                 onClick={() => router.push("/")}
               >
                 <Image
                   src="/logo.png"
                   alt="HelpAI Logo"
                   width={100}
                   height={100}
                   className="object-contain"
                 />
               </div>
      <Separator className="mb-4" />

      <nav className="flex flex-col gap-1 flex-grow">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      <Button
        // variant="destructive"
        
        onClick={handleLogout}
        className="flex bg-secondary text-secondary-foreground hover:text-primary-foreground items-center gap-2 w-full"
      >
        <LogOut size={18} />
        Logout
      </Button>
    </aside>
  );
}
