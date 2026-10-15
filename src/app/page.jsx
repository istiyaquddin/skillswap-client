import Navbar from "@/components/mejor/Navbar";
import Banner from "@/components/mejor/Banner";
import TrustedByStats from "@/components/mejor/TrustedByStats";
import FeaturesServices from "@/components/mejor/FeaturesServices";
import WhyChooseUs from "@/components/mejor/WhyChooseUs";
import HowItWorks from "@/components/mejor/HowItWorks";
import FeaturedTasks from "@/components/mejor/FeaturedTasks";
import TopFreelancers from "@/components/mejor/TopFreelancers";
import Testimonials from "@/components/mejor/Testimonials";
import Pricing from "@/components/mejor/Pricing";
import FAQ from "@/components/mejor/FAQ";
import FinalCTA from "@/components/mejor/FinalCTA";
import Footer from "@/components/mejor/Footer";

export const metadata = {
  title: "SkillSwap — Campus Freelancing Platform | Trade Skills, Earn Together",
  description:
    "SkillSwap is the premier peer-to-peer campus freelancing platform. Post tasks, hire verified student freelancers, and pay securely with Stripe escrow protection.",
  keywords: "campus freelancing, student freelancer, escrow payments, hire developers, skill exchange",
  openGraph: {
    title: "SkillSwap — Campus Freelancing Platform",
    description:
      "Post tasks, hire verified student freelancers, and pay securely with Stripe escrow protection.",
    url: "https://skillswap-client-blush-two.vercel.app",
    siteName: "SkillSwap",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero */}
        <Banner />

        {/* 3. Trusted By / Stats (Dynamic live metrics & partners) */}
        <TrustedByStats />

        {/* 4. Features / Services (Dynamic category tabs & interactive previews) */}
        <FeaturesServices />

        {/* 5. About / Why Choose Us (Dynamic comparative analysis & pillar metrics) */}
        <WhyChooseUs />

        {/* 6. How It Works (Dynamic Client vs Freelancer interactive toggle) */}
        <HowItWorks />

        {/* 7. Featured Products / Projects (Dynamic API-fetched tasks with category filters) */}
        <FeaturedTasks />

        {/* 8. Extra Section Part A: Top Campus Talent / Team (Dynamic student mentors from DB) */}
        <TopFreelancers />

        {/* 9. Testimonials (Dynamic student review slider & helpful voting) */}
        <Testimonials />

        {/* 10. Extra Section Part B: Pricing / Packages (Dynamic Monthly vs Annual 20% discount calculator) */}
        <Pricing />

        {/* 11. FAQ (Dynamic live search & accordion categories) */}
        <FAQ />

        {/* 12. Final CTA (Dynamic authentication & user state awareness) */}
        <FinalCTA />
      </main>

      {/* 13. Footer (Dynamic newsletter feedback, live status, dynamic year) */}
      <Footer />
    </>
  );
}
