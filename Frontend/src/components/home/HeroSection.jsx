import React from "react";
import { Link } from "react-router-dom";
import GradientText from "../GradientText";
import TextType from "../TextType";

function HeroSection() {
  return (
    <>
      <section className="relative w-full pt-16 md:pt-24 pb-10 px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6 mx-auto">
          <div className="flex items-center justify-center space-x-2 p-2 rounded-lg text-xs sm:text-sm">
            <span className="bg-blue-500 text-white font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
              New
            </span>
            <p className="text-xs sm:text-sm text-white text-center">
              Tell Us Your Budget, We Design It.{" "}
              <a
                href="#"
                className="text-blue-400 hover:underline whitespace-nowrap"
              >
                See what's new
              </a>
            </p>
          </div>

          <div className="space-y-3 sm:space-y-6 mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold gradient-title text-center text-white/90 leading-tight">
              <span className="inline-block">
                <TextType
                  text={["Travel", "Hotel", "Flight"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </span>{" "}
              Suggestions
              <br />
              Powered by Smart AI.
            </h1>

            <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg lg:text-lg text-center text-white">
              AI suggests the best flights, hotels, and destinations according
              to your dreams. Plan successfully. Tell us your interests, budget,
              and destination; our AI will design a perfect, memorable trip for
              you.
            </p>
          </div>

          <div className="flex justify-center space-x-3 sm:space-x-4 flex-wrap gap-y-4">
            <Link to={"/itinerarie"}>
              <button className="px-6 py-2 sm:px-8 bg-white text-black font-semibold rounded-full shadow-xl hover:bg-gray-200 text-sm sm:text-base transition-colors cursor-pointer">
                Get Started
              </button>
            </Link>
            <Link to={"/"}>
              <button className="px-6 py-2 sm:px-8 bg-white/5 text-white/80 font-semibold rounded-full border border-white/10 shadow-xl hover:bg-white/10 text-sm sm:text-base transition-colors cursor-pointer">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
