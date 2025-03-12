import { SignOut } from "@/components/sign-out";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="rounded-lg p-4 text-center mb-6">
        <p className="text-foreground">Signed in as:</p>
        <p className="text-foreground">{session.user?.email}</p>
      </div>
      <ThemeToggle />
      <SignOut />
    </div>
  );
};

export default Page;
