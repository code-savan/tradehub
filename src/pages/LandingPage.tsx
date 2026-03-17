import Navigation from '../sections/Navigation';
import HeroSection from '../sections/HeroSection';
import DashboardPreview from '../sections/DashboardPreview';
import FeatureHighlight from '../sections/FeatureHighlight';
import PlatformCapabilities from '../sections/PlatformCapabilities';
import CTASection from '../sections/CTASection';

export default function LandingPage() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <DashboardPreview />
      <FeatureHighlight />
      <PlatformCapabilities />
      <CTASection />
    </main>
  );
}
