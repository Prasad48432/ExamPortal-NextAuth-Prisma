import React from "react";
import { FlipWords } from "./flipwords";
import { MoveRight } from "lucide-react";
import { Button } from "./ui/button";
import Marquee from "react-fast-marquee";
import {
  SiAwsamplify,
  SiBehance,
  SiDocker,
  SiKubernetes,
  SiPrisma,
  SiSupabase,
} from "react-icons/si";

const HeroPage = () => {
  return (
    <main className="relative overflow-auto">
      <div className="relative -mt-[65px] bg-lightprimary-bg dark:bg-primary-bg">
        <div className="sm:py-18 h-screen container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-20 xl:px-20 pt-8 pb-10 md:pt-16 overflow-hidden">
          <div className="relative">
            <div className="mx-auto">
              <div className="mx-auto max-w-2xl lg:col-span-6 lg:flex lg:items-center justify-center text-center">
                <div className="relative z-10 lg:h-auto pt-[90px] lg:pt-[90px] lg:min-h-[300px] flex flex-col items-center justify-center sm:mx-auto md:w-3/4 lg:mx-0 lg:w-full gap-4 lg:gap-8">
                  <div className="flex flex-col items-center">
                    <div className="z-40 w-full flex justify-center -mt-4 lg:-mt-12 mb-8">
                      <div className="relative w-fit max-w-xl flex justify-center">
                        <a
                          target="_self"
                          className="announcement-link group/announcement relative flex flex-row items-center p-1 pr-3 text-sm w-auto gap-2 text-left rounded-full bg-opacity-20 border border-secondary-border hover:border-secondary-strongerborder shadow-md overflow-hidden focus-visible:outline-none focus-visible:ring-brand-600 focus-visible:ring-2 focus-visible:rounded-full"
                          href="/upgrade"
                        >
                          <div className="inline-flex items-center bg-opacity-10 bg-accent-bg text-accent-text border border-secondary-strongerborder group-hover/announcement:border-secondary-border px-3 rounded-full text-sm py-1 announcement-badge">
                            50% off ends soon!
                          </div>
                          <span className="text-lightprimary-text dark:text-primary-text announcement-text">
                            Avail now
                          </span>
                          <MoveRight
                            strokeWidth={1}
                            className="text-lightprimary-text dark:text-primary-text ml-2 -translate-x-1 transition-transform group-hover/announcement:translate-x-0"
                          />
                          <div className="absolute inset-0 -z-10 bg-gradient-to-br opacity-70 group-hover/announcement:opacity-100 transition-opacity overflow-hidden rounded-full from-background-surface-100 to-background-surface-300 backdrop-blur-md " />
                        </a>
                      </div>
                    </div>
                    <h1
                      className={`bricolage text-foreground font-extrabold text-herosize lg:text-7xl tracking-tight select-none`}
                    >
                      <span className="block cursor-pointer text-lightprimary-text dark:text-primary-text lg:mb-2">
                        The only portal for
                      </span>
                      <span className="text-lightaccent-text dark:text-accent-text block md:ml-0">
                        <FlipWords duration={3000} className="text-primary" />{" "}
                        exams
                      </span>
                    </h1>
                    <p className="pt-2 text-lightprimary-text dark:text-primary-text/80 my-3 text-sx sm:mt-5 lg:mb-0 sm:text-base lg:text-lg">
                      Boost your web presence with Linkfolio. Share your
                      startups, showcase projects, organize links, expand your
                      network, get noticed by recruiters, and discover new
                      opportunities{" "}
                      <b className="text-lightprimary-text dark:text-primary-text">
                        all in one sleek portfolio.
                      </b>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={"outline"}
                      className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border  text-xs md:text-sm px-4 md:px-5 py-1.5"
                    >
                      <a href="/dashboard" className="truncate">
                        Dashboard
                      </a>
                    </Button>
                    <Button
                      variant={"outline"}
                      className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border  text-xs md:text-sm px-4 md:px-5 py-1.5"
                    >
                      <a href="/analytics" className="truncate">
                        Analytics
                      </a>
                    </Button>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-2 w-full lg:w-3/4 mt-3 lg:mt-0 relative">
                    <div className="absolute h-full w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none left-0 top-0"></div>
                    <div className="absolute h-full w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none right-0 top-0"></div>
                    <Marquee
                      autoFill
                      speed={20}
                      pauseOnClick
                      pauseOnHover
                      className="gap-4"
                    >
                      <SiPrisma
                        size={60}
                        opacity={0.5}
                        className="mr-4 lg:mr-6"
                      />
                      <SiKubernetes
                        size={60}
                        opacity={0.5}
                        className="mr-4 lg:mr-6"
                      />
                      <SiDocker
                        size={60}
                        opacity={0.5}
                        className="mr-4 lg:mr-6"
                      />
                      <SiBehance
                        size={60}
                        opacity={0.5}
                        className="mr-4 lg:mr-6"
                      />
                      <SiSupabase
                        size={60}
                        opacity={0.5}
                        className="mr-4 lg:mr-6"
                      />
                      <SiAwsamplify
                        size={60}
                        opacity={0.5}
                        className="mr-4 lg:mr-6"
                      />
                    </Marquee>
                  </div>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroPage;
