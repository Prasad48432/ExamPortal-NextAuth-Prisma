import { auth } from "@/lib/auth";

import { signIn } from "@/lib/auth";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { executeAction } from "@/lib/executeAction";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className=" p-8 rounded-lg w-full max-w-md">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <GoogleSignIn />
        </div>
      </div>
    </div>
  );
};

export default Page;
