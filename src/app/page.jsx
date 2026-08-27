import Banner from "@/components/mejor/Banner";
import HowItWorks from "@/components/mejor/HowItWorks";
import FeaturedTasks from "@/components/mejor/FeaturedTasks";
import TopFreelancers from "@/components/mejor/TopFreelancers";
import Statistic from "@/components/mejor/Statistic";
import Testimonials from "@/components/mejor/Testimonials";
import Pricing from "@/components/mejor/Pricing";
import Footer from "@/components/mejor/Footer";
import Navbar from "@/components/mejor/Navbar";

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
      <Navbar />
      <Banner />
      <HowItWorks />
      <FeaturedTasks />
      <TopFreelancers />
      <Statistic />
      <Testimonials />
      <Pricing />
      <Footer />
    </>
  );
}
