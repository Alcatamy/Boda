import Hero from "@/components/layout/Hero";
import Story from "@/components/layout/Story";
import Logistics from "@/components/layout/Logistics";
import RsvpSection from "@/components/rsvp/RsvpSection";
import GiftRegistry from "@/components/features/GiftRegistry";
import GallerySection from "@/components/gallery/GallerySection";
import WaveDivider from "@/components/ui/WaveDivider";

export default function Home() {
  return (
    <main>
      <Hero />
      <WaveDivider />
      <Story />
      <WaveDivider flip />
      <Logistics />
      <WaveDivider />
      <RsvpSection />
      <WaveDivider flip />
      <GiftRegistry />
      <WaveDivider />
      <GallerySection />
    </main>
  );
}
