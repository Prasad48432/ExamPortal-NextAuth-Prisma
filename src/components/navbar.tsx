"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Bell,
  Coins,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ session }: { session: any }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const pathname = usePathname();

  const hideNavbarRoutes = ["/sign-in", "/linksent"];
  const shouldShowNavbar =
    !hideNavbarRoutes.includes(pathname) &&
    !pathname.startsWith("/exams/") &&
    !pathname.startsWith("/dashboard");


  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <div id="topdiv" className="sticky top-0 transform z-40">
      <div className="absolute inset-0 h-full w-full bg-lightprimary-bg/70 dark:bg-primary-bg/90 !opacity-100 transition-opacity"></div>
      <nav className="relative z-40 border-b border-brdr backdrop-blur-sm transition-opacity bg-lightprimary-bg dark:bg-primary-bg  border-lightsecondary-border dark:border-secondary-border dark:shadow-lg dark:shadow-primary-bg/80">
        <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
          <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
            <div id="bottomdiv" className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                <a
                  className="flex gap-1 items-center justify-center w-auto focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-foreground-lighter focus-visible:ring-offset-4 focus-visible:ring-offset-background-alternative focus-visible:rounded-sm"
                  type="button"
                  id="radix-:Rlcna6:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                  href="/"
                >
                  <p className="text-lg font-bold text-primary">Exam Portal</p>
                </a>
              </div>
              <nav
                aria-label="Main"
                data-orientation="horizontal"
                dir="ltr"
                className="relative z-10 flex-1 items-center justify-center hidden pl-8 sm:space-x-4 lg:flex h-16"
              >
                <div style={{ position: "relative" }}>
                  <ul
                    data-orientation="horizontal"
                    className="group flex flex-1 list-none items-center justify-center space-x-1"
                    dir="ltr"
                  >
                    <li className="text-sm font-medium">
                      <a
                        className="group/menu-item flex items-center text-sm hover:text-lightaccent-selection dark:hover:text-accent-text  select-none gap-3 rounded-md p-2 leading-none no-underline outline-none focus-visible:ring-2 focus-visible:ring-accent-text-lighter group-hover:bg-transparent text-accent-text focus-visible:text-accent-text"
                        data-radix-collection-item=""
                        href="/exams"
                      >
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-1">
                            <p className="group/underline leading-snug text-lightprimary-text dark:text-primary-text group-hover/menu-item:text-lightaccent-selection dark:group-hover/menu-item:text-accent-text">
                              Exams
                              <span className="block max-w-0 group-hover/underline:max-w-full transition-all duration-300 h-0.5 bg-foreground"></span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="absolute left-0 top-full flex justify-center" />
              </nav>
            </div>
            <div className="flex items-center gap-2 select-none">
              {!session ? (
                <>
                  <Button
                    variant={"secondary"}
                    className="relative justify-center cursor-pointer items-center space-x-2 text-center ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-xs px-2.5 py-1 h-[26px] hidden lg:block"
                  >
                    <a href="/sign-in" className="truncate">
                      Login
                    </a>
                  </Button>
                  <Button
                    variant={"secondary"}
                    className="relative justify-center cursor-pointer items-center space-x-2 text-center ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-xs px-2.5 py-1 h-[26px] hidden lg:block"
                  >
                    <a href="/sign-in" className="truncate">
                      Get started
                    </a>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant={"secondary"}
                    className="relative justify-center cursor-pointer items-center space-x-2 text-center ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-lightprimary-text dark:text-primary-text bg-lightaccent-bg dark:bg-accent-bg hover:bg-lightaccent-selection dark:hover:bg-accent-selection border-lightaccent-border dark:border-accent-border hover:border-lightaccent-strongerborder dark:hover:hover:border-accent-strongerborder focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-xs px-2.5 py-1 h-[26px] hidden lg:block"
                  >
                    <a href="/dashboard" className="truncate">
                      Dashboard
                    </a>
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={handleSignOut}
                    className="relative justify-center cursor-pointer items-center space-x-2 text-center ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 text-xs px-2.5 py-1 h-[26px] hidden lg:block"
                  >
                    <span className="truncate">Logout</span>
                  </Button>
                </div>
              )}
              <ThemeToggle />
              {session && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={session.user?.image || ""}
                        alt={session.user?.id}
                      />
                      <AvatarFallback className="rounded-lg">EX</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={"bottom"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            referrerPolicy="no-referrer"
                            src={session.user?.image || ""}
                            alt={session.user?.id}
                          />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {session.user?.name}
                          </span>
                          <span className="truncate text-xs">
                            {session.user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Coins />
                        Access Points <span className="font-semibold">45</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard />
                        Payments
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-chart-fail"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <motion.div
                className="block lg:hidden cursor-pointer text-lightprimary-text dark:text-primary-text"
                onClick={() => {
                  setIsNavbarOpen(!isNavbarOpen);
                }}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: isNavbarOpen ? 0.7 : 1 }}
                transition={{ duration: 1 }}
              >
                {isNavbarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
