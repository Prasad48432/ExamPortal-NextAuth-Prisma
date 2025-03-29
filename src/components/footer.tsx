"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // List of routes where you don't want the navbar
  const hideNavbarRoutes = ["/sign-in", "/linksent"];
  const shouldShowNavbar =
    !hideNavbarRoutes.includes(pathname) &&
    !pathname.startsWith("/exams/") &&
    !pathname.startsWith("/dashboard");

  if (!shouldShowNavbar) {
    return null;
  }
  return (
    <footer className=" rounded-lg  m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <p className="text-lg font-bold text-primary">Exam Portal</p>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6  sm:mx-auto  lg:my-8" />
        <span className="block text-sm  sm:text-center ">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            EXAM PORTAL™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
