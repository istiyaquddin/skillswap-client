import Banner from "@/components/mejor/Banner";
import HowItWorks from "@/components/mejor/HowItWorks";
import FeaturedTasks from "@/components/mejor/FeaturedTasks";
import TopFreelancers from "@/components/mejor/TopFreelancers";
import Footer from "@/components/mejor/Footer";
import Navbar from "@/components/mejor/Navbar";
import Statistic from "@/components/mejor/Statistic";
import Testimonials from "@/components/mejor/Testimonials";

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
      <Footer />
    </>
  );
}

