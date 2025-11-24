import React from "react";
import { Link } from "react-router-dom";
import { Check, Flame, X } from "lucide-react";
import LightRays from "@/components/LightRays";

const pricingPlans = [
  {
    name: "Free",
    description:
      "Perfect for occasional users or exploring our service for the first time.",
    price: "$0",
    frequency: "Forever",
    buttonText: "Get Started",
    isPopular: false,
    features: [
      "1 GB Cloud Storage",
      "Up to 3 Projects",
      "Standard Email Support",
      "Basic Analytics",
      "Community Access",
      "Daily Data Backup",
    ],
    bgColor: "bg-gray-800 text-white",
    ringColor: "ring-gray-700",
    buttonClass: "text-blue-400 border-blue-400 hover:bg-gray-700",
  },
  {
    name: "Silver",
    description: "Ideal for teams needing more power and enhanced features.",
    price: "$99",
    frequency: "Per Month, Billed Annually",
    buttonText: "Buy Now",
    isPopular: true,
    features: [
      "50 GB Cloud Storage",
      "Unlimited Projects",
      "Priority Chat Support",
      "Advanced Analytics",
      "Custom Branding",
      "Hourly Data Backup",
    ],
    bgColor: "bg-blue-600 text-white",
    ringColor: "ring-blue-500",
    buttonClass:
      "text-white bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-500/50",
  },
  {
    name: "Gold",
    description:
      "Maximum features and top-level performance for demanding users.",
    price: "$199",
    frequency: "Per Month, Billed Annually",
    buttonText: "Upgrade",
    isPopular: false,
    features: [
      "Unlimited Cloud Storage",
      "Custom Domain Support",
      "24/7 Premium Support",
      "Enterprise Integrations",
      "Dedicated Account Manager",
      "Real-time Data Backup",
    ],
    bgColor: "bg-gray-800 text-white",
    ringColor: "ring-gray-700",
    buttonClass: "text-blue-400 border-blue-400 hover:bg-gray-700",
  },
];



const PricingCard = ({ plan }) => {
  const isSilver = plan.isPopular;

  return (
    <div
      className={`relative flex flex-col p-6 rounded-md shadow-xl transition-transform duration-300 hover:scale-[1.02] 
        ${isSilver ? "ring-4 ring-[#271e37]" : "ring-1 ring-gray-700"}
        ${isSilver ? "bg-[271e37]/10 text-white" : "bg-slate-400/10 text-white"}
        h-full
      `}
    >
      {isSilver && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-red-500 rounded-full text-xs font-semibold uppercase text-white shadow-md flex items-center space-x-1">
          <Flame size={14} />
          <span>Most Popular</span>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
      <p
        className={`text-sm mb-4 ${
          isSilver ? "text-blue-200" : "text-gray-400"
        }`}
      >
        {plan.description}
      </p>

      <div className="flex items-end mb-6">
        <span className="text-5xl font-extrabold">{plan.price}</span>
        <span
          className={`ml-2 text-xl ${
            isSilver ? "text-blue-200" : "text-gray-400"
          }`}
        >
          /
          {plan.frequency.split(",")[0].toLowerCase().includes("month")
            ? "mo"
            : plan.frequency.split(",")[0]}
        </span>
      </div>
      <p
        className={`text-sm mb-6 ${
          isSilver ? "text-blue-300" : "text-gray-400"
        } font-medium`}
      >
        {plan.frequency}
      </p>

      <button
        className={`w-full py-3 mt-auto mb-6 rounded-xl font-semibold transition-colors duration-200 border-2 
          ${
            isSilver
              ? "border-white bg-white text-[#271e37] hover:bg-gray-100"
              : "border-s-neutral-400 bg-slate-600/20 text-slate-300 hover:bg-gray-700"
          }
        `}
      >
        {plan.buttonText}
      </button>

      <ul className="space-y-4 pt-4 border-t border-dashed border-opacity-30 border-current">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check
              size={20}
              className={`mt-0.5 shrink-0 ${
                isSilver ? "text-white" : "text-blue-400"
              }`}
            />
            <span
              className={`ml-3 text-base ${
                isSilver ? "text-white" : "text-gray-300"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Pricing = () => {
  return (
    <>
      <div className="min-h-screen bg-[#060010] flex flex-col items-center p-4 sm:p-8 font-sans relative">
        {/* 1. Close Button ko yahan move kar diya gaya hai */}
        <Link to={"/"}>
          <button
            // Top-right position par set kiya gaya hai
            className="absolute right-4 top-4 z-20 flex items-center space-x-2 text-gray-500 hover:text-white transition-colors duration-200 p-2 rounded-lg cursor-pointer"
          >
            <X size={24} />
          </button>
        </Link>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#503e70"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>

        <div className="w-full max-w-6xl flex flex-col items-center relative z-10">
          <div className="relative text-center pt-8 pb-12 w-full">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Simple Pricing Plans
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose a plan that fits your needs. No hidden fees, just simple
              scalability.
            </p>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className="flex">
                  <PricingCard plan={plan} />
                </div>
              ))}
            </div>
          </div>

          <p className="mt-12 text-sm text-gray-500 text-center">
            *All plans are based on annual billing. Monthly option is also
            available.
          </p>
        </div>
      </div>
    </>
  );
};

export default Pricing;
