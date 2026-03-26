import Hero from "@/components/layout/Hero";
import Story from "@/components/layout/Story";
import Logistics from "@/components/layout/Logistics";
import RsvpSection from "@/components/rsvp/RsvpSection";
import GiftRegistry from "@/components/features/GiftRegistry";
import GallerySection from "@/components/gallery/GallerySection";
import WaveDivider from "@/components/ui/WaveDivider";
import EnvelopeIntro from "@/components/features/EnvelopeIntro/EnvelopeIntro";

const SectionIcon = ({ src }: { src: string }) => (
  <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 10, marginTop: "2rem", marginBottom: "-3rem" }}>
    <img src={src} alt="Decoración elegante" style={{ width: "90px", height: "auto", objectFit: "contain" }} />
  </div>
);

export default function Home() {
  return (
    <EnvelopeIntro>
      <main>
        <Hero />
        
        <WaveDivider />
        <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/locket-illustration-B7vFK6H-.png" />
        <Story />
        
        <WaveDivider flip />
        <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/cupid-illustration-BO3_EWaD.png" />
        <RsvpSection />
        
        <WaveDivider />
        <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/champagne-tower-Or6MBjHQ.png" />
        <Logistics />
        
        <WaveDivider flip />
        <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/floral-vase-6x28LN74.png" />
        <GiftRegistry />
        
        <WaveDivider />
        <SectionIcon src="https://premiumelegante.thedigitalyes.com/assets/swans-framed-ByH4RE7t.png" />
        <GallerySection />
      </main>
    </EnvelopeIntro>
  );
}
