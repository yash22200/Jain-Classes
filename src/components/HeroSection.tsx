import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-classroom.jpg";

const HeroSection = () => (
  <section id="home" className="py-16 md:py-24">
    <div className="container grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-success" />
          Admissions Open for 8th, 9th & 10th Std — 2024-25
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Excel in{" "}
          <span className="italic text-primary">8th to 10th Standard</span>{" "}
          with Jain Classes.
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md">
          Specialized coaching for 8th, 9th & 10th standard students covering
          Science, Mathematics, Social Studies, and English. Build a strong
          foundation and score top marks in board exams.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/signup">
            <Button size="lg">Enroll Now</Button>
          </Link>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              <Play className="w-4 h-4 mr-2" /> Watch Demo
            </Button>
          </a>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
            ))}
          </div>
          <span>+2K</span>
          <span>Trusted by 2,000+ students nationwide</span>
        </div>
      </div>

      <div className="relative">
        <img
          src={heroImg}
          alt="Classroom"
          className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
