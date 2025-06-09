import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import messages from "@/messages.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Page() {
  return (
    <>
      <BackgroundBeamsWithCollision className="bg-black min-h-fit">
        <div className="px-4 py-8 max-w-2xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-center text-white dark:text-white font-sans tracking-tight mb-5">
            Truely
            <div className="relative mx-auto inline-block w-max ml-2 [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
              <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-2 sm:py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl">NGL</span>
              </div>
              <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-2 sm:py-4">
                <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl">NGL</span>
              </div>
            </div>
          </h2>
          <h3 className="text-lg sm:text-2xl text-white mt-2 text-center">
            send message annonymously to anyone
          </h3>
          <div className="flex justify-center mt-5">
            <Link href="/sign-up" passHref>
              <Button
                className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-2xl font-semibold text-white rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
      <div className="px-2 sm:px-4 py-8 max-w-7xl mx-auto w-full">
        <InfiniteMovingCards
          items={messages}
          direction="right"
          speed="slow"
        />
      </div>
    </>
  );
}

export default Page;
