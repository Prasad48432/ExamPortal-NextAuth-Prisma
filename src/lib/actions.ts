import { schema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/executeAction";
import { signIn } from "./auth";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const validatedData = schema.parse({ email });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
        },
      });
    },
    successMessage: "Email sent successfully",
  });
};

const googleSignup = async () => {
  await signIn("google");
};

const sendMagicLink = async (formData: any) => {
  await executeAction({
    actionFn: async () => {
      await signIn("resend", formData);
    },
  });
};


export { signUp, googleSignup, sendMagicLink };
