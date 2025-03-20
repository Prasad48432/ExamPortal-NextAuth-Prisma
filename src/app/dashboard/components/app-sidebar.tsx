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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Results",
      url: "/results",
      icon: ChartBar,
      items: [
        {
          title: "Results",
          url: "/dashboard/results",
        },
        {
          title: "Analysis",
          url: "/dashboard/analysis",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
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
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
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
  ],
};

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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
