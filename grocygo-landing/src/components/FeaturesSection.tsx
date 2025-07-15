import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => (
  <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 gap-10">
        <FeatureCard image="woman-checklist.png" title="Smart Lists" desc="Auto-suggest shopping items & track your stock." />
        <FeatureCard image="grocery-bag.png" title="Organized Groceries" desc="Categorized and optimized buying experience." />
        <FeatureCard image="recipe-sheet.png" title="AI Recipes" desc="Suggest dishes based on what you have." />
      </div>
    </div>
  </section>
);
