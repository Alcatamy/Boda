import Hero from "@/components/layout/Hero";
import Story from "@/components/layout/Story";
import Logistics from "@/components/layout/Logistics";
import RsvpSection from "@/components/rsvp/RsvpSection";
import GiftRegistry from "@/components/features/GiftRegistry";
import GallerySection from "@/components/gallery/GallerySection";
import WaveDivider from "@/components/ui/WaveDivider";
import SectionIcon from "@/components/ui/SectionIcon";

export default function Home() {
  return (
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
        
        <footer style={{
          padding: "4rem 1rem",
          textAlign: "center",
          backgroundColor: "var(--background)",
          color: "var(--color-accent)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: 0.8
        }}>
          <p>Diseñada y desarrollada con mucho amor por<br/><span style={{fontFamily: "var(--font-script)", fontSize: "1.5rem", textTransform: "none", display: "inline-block", marginTop: "0.5rem"}}>Adrián y Nadia</span></p>
        </footer>
      </main>
  );
}
