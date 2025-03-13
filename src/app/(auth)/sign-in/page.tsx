import { auth, signIn } from "@/lib/auth";

import { GoogleSignIn } from "@/components/GoogleSignIn";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { executeAction } from "@/lib/executeAction";
import { SubmitButton } from "@/components/SubmitButton";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className=" p-8 rounded-lg w-full max-w-md">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
          <GoogleSignIn />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>
          <form
            className="space-y-4"
            action={async (formData) => {
              "use server";
              await executeAction({
                actionFn: async () => {
                  await signIn("resend", formData);
                },
              });
            }}
          >
            <Input
              name="email"
              placeholder="Enter your email"
              type="email"
              required
            />
            <SubmitButton loadingText="Sending link..." className="w-full">Sign in with email</SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
