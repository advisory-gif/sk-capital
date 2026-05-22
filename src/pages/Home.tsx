import Hero from '@/sections/Hero';
import SplitSections from '@/sections/SplitSections';
import CityHero from '@/sections/CityHero';
import WhatFoundersFind from '@/sections/WhatFoundersFind';
import WhoThisIsFor from '@/sections/WhoThisIsFor';
import Services from '@/sections/Services';
import Process from '@/sections/Process';
import FounderSection from '@/sections/FounderSection';
import FinalCTA from '@/sections/FinalCTA';
import LeadMagnetBanner from '@/sections/LeadMagnetBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <SplitSections />
      <CityHero />
      <WhatFoundersFind />
      <WhoThisIsFor />
      <Services />
      <Process />
      <FounderSection />
      <FinalCTA />
      <LeadMagnetBanner />
    </>
  );
}
