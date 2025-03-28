"use client";

import { AppLogo } from "@/components/App/AppLogo";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { useState } from "react";

const links = [
  {
    label: "主页",
    href: "#",
    icon: (
      <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "我的",
    href: "#",
    icon: (
      <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  },
  {
    label: "设置",
    href: "#",
    icon: (
      <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "h-[100vh] flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 ",
        "min-h-screen overflow-y-auto",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className=" flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <AppLogo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  isActive={idx === 0}
                  activeClassName="text-red-500 bg-red-500/10"
                />
              ))}
            </div>
          </div>
          <div className="flex-end">
            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                icon: (
                  <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="min-h-[100vh] w-full">{children}</main>
    </div>
  );
}
