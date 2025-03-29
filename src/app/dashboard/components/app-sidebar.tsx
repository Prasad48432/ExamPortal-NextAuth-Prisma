"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bookmark,
  BookOpen,
  Bot,
  CalendarCheck,
  ChartBar,
  Coins,
  Command,
  CreditCard,
  FileQuestion,
  Frame,
  GalleryVerticalEnd,
  GitGraph,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { Header } from "./header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";



export function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname(); // Get current route

  const navMain = [
    {
      title: "Results",
      url: "/results",
      icon: ChartBar,
      isActive: pathname.startsWith("/dashboard/results"),
      items: [
        {
          title: "Results Section",
          url: "/dashboard/results",
        },
        {
          title: "Analysis",
          url: "/dashboard/results/analysis",
        },
      ],
    },
    {
      title: "Bookmarks",
      url: "/dashboard/questions",
      icon: Bookmark,
      isActive: pathname.startsWith("/dashboard/bookmarks"),
      items: [
        {
          title: "Saved Questions",
          url: "/dashboard/bookmarks/savedquestions",
        },
        {
          title: "Saved Exams",
          url: "/dashboard/bookmarks/savedexams",
        },
      ],
    },
    {
      title: "Knowledge Zone",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "E-Learnings",
          url: "#",
        },
        {
          title: "Video Center",
          url: "#",
        },
        {
          title: "Community",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile Settings",
          url: "#",
        },
        {
          title: "Manage Billing",
          url: "#",
        },
        {
          title: "Ad Preferences",
          url: "#",
        },
      ],
    },
  ];

  const projects =[
    {
      name: "Schedule exam",
      url: "#",
      renderSide: false,
      icon: CalendarCheck,
    },
    {
      name: "Access Points",
      url: "#",
      renderSide: true,
      icon: Coins,
    },
    {
      name: "Payments",
      url: "#",
      renderSide: false,
      icon: CreditCard,
    },
  ]
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
