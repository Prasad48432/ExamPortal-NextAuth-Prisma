import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, MoveUpRight } from "lucide-react";

export default function MagicLink() {
  return (
    <div className="grid min-h-screen bg-base-300">
      <section className="flex w-full justify-center px-8 py-16 md:mb-16 md:items-center">
        <div className="space-y-6">
          <div className="custom-card max-w-lg rounded-3xl bg-base-100">
            <div className="flex items-center justify-center gap-2 border-b border-muted px-16 py-6">
              <a className="group flex items-center gap-2" href="/">
                <span className="text-xl font-bold text-base-content duration-150 group-hover:underline">
                  Exam Portal
                </span>
              </a>
            </div>
            <div className="space-y-6 p-6 text-center md:p-12">
              <h1 className="text-2xl font-bold lg:text-3xl lg:tracking-tight">
                Magic Link Sent ✨
              </h1>
              <p className="text-muted-foreground leading-relaxed lg:text-lg">
                Check your inbox for{" "}
                <span className="font-medium text-foreground">
                  random@gmail.com
                </span>{" "}
                and click the link to sign in!
              </p>
              <Button className="w-full" asChild>
                <a target="_blank" href="https://mail.google.com/mail/u/0/#search/from%3Aonboarding%20%3Conboarding%40linkfolio.space%3E">
                  Open Email Inbox <MoveUpRight />
                </a>
              </Button>
            </div>
          </div>
          <div className="text-muted-foreground text-center text-sm">
            <p>
              Check spam, just in case. If you need help,{" "}
              <a
                href="mailto:queries@linkfolio.space?subject=ExamPortal%20Sign-In%20Help"
                className="underline"
                target="_blank"
              >
                email me
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
