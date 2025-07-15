
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { MealsPreview } from './components/MealsPreview';
import { TipsFrame } from './components/TipsFrame';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Demo } from './components/Demo';
import { Testimonials } from './components/Testimonials';
import { AISection } from './components/AISection';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturesSection />
      <MealsPreview />
      <TipsFrame />
      <Problem />
      <Solution />
      <Demo />
      <Testimonials />
      <AISection />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;