import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { configAPI } from "@/lib/api";

interface MarketingStats {
  educators?: string;
  yearsOfExperience?: string;
  studentCount?: string;
  successRate?: string;
}

const features = [
  {
    title: "Personalized Learning Plans",
    desc: "Customized study plans based on individual student performance.",
  },
  {
    title: "State-of-the-Art Facilities",
    desc: "Modern classrooms equipped with digital learning tools.",
  },
  {
    title: "Regular Assessment",
    desc: "Weekly mock tests and detailed performance analytics.",
  },
];

const LegacySection = () => {
  const [stats, setStats] = useState<MarketingStats>({
    educators: "50+",
    yearsOfExperience: "15+",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await configAPI.getMarketingStats();
        setStats({
          educators: data.educators || "50+",
          yearsOfExperience: data.yearsOfExperience || "15+",
          studentCount: data.studentCount,
          successRate: data.successRate,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Use default values
        setStats({
          educators: "50+",
          yearsOfExperience: "15+",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-16 md:py-24 bg-secondary">
        <div className="container flex items-center justify-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-background rounded-2xl p-5 shadow-sm">
                <span className="text-3xl font-bold text-primary">{stats.educators}</span>
                <p className="text-sm text-muted-foreground mt-1">Expert Educators</p>
              </div>
              <img
                src="/public/img.jpeg"
                alt="Teaching"
                className="rounded-2xl shadow-sm w-full object-cover aspect-square"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-accent rounded-2xl p-4 flex items-center justify-center aspect-square">
                <span className="text-6xl">📚</span>
              </div>
              <div className="bg-background rounded-2xl p-5 shadow-sm">
                <span className="text-3xl font-bold text-primary">{stats.yearsOfExperience}</span>
                <p className="text-sm text-muted-foreground mt-1">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A Legacy of Excellence in Coaching</h2>
          <p className="text-muted-foreground mb-8">
            With a legacy spanning over {stats.yearsOfExperience}, Jain Classes provides specialized coaching
            for 8th to 10th standard students, helping them build strong fundamentals and score top marks in
            board exams through innovative teaching methods and dedicated mentorship.
          </p>

          <div className="space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">{f.title}</h4>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
