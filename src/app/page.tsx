import HeroPage from "@/components/hero";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <HeroPage />
    </>
  );
};

export default Page;
