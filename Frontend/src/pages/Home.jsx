import React from "react";
import DotGrid from "@/components/ui/DotGrid";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";

function Home() {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-[#060010]">
        <div className="absolute inset-0 w-full h-full z-0">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#271e37"
            activeColor="#5227ff"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        <div className="relative z-20 mt-5">
            <Header />
        </div>
        
        <HeroSection/>
      </div>
    </>
  );
}

export default Home;
