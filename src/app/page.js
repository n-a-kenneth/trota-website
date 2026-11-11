import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import About from "@/components/About";
import HowNav from "@/components/HowNav";
import Import from "@/components/Import";
import Security from "@/components/Security";
import Sources from "@/components/Sources";
import Split from "@/components/Split";
import Tracker from "@/components/Tracker";
import Impact from "@/components/Impact";
import Values from "@/components/Values";
import Team from "@/components/Team";
import Journey from "@/components/Journey";
import Footer from "@/components/Footer";
import Flowers from "@/components/Flowers";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative isolate overflow-x-clip">
        <Flowers />
        <Hero />
        <Statement />
        <About />
        <div>
          <HowNav />
          <Import />
          <Security />
          <Sources />
          <Split />
          <Tracker />
        </div>
        <Impact />
        <Values />
        <Team />
        <Journey />
      </main>
      <Footer />
    </>
  );
}
