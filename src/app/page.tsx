import Hero from "@/components/layout/Hero";
import Story from "@/components/layout/Story";
import Logistics from "@/components/layout/Logistics";
import RsvpSection from "@/components/rsvp/RsvpSection";
import GiftRegistry from "@/components/features/GiftRegistry";
import GallerySection from "@/components/gallery/GallerySection";
import AnimatedSeparator from "@/components/ui/AnimatedSeparator";

export default function Home() {
  return (
    <main>
      <Hero />
      <AnimatedSeparator />
      <Story />
      <AnimatedSeparator inverted />
      <Logistics />
      <AnimatedSeparator />
      <RsvpSection />
      <AnimatedSeparator inverted />
      <GiftRegistry />
      <AnimatedSeparator />
      <GallerySection />
    </main>
  );
}
