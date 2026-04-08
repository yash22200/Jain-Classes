import { useState, useEffect } from "react";
import { BookOpen, Lightbulb, Loader2 } from "lucide-react";
import { configAPI } from "@/lib/api";

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon?: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpen: <BookOpen className="w-6 h-6 text-accent-foreground" />,
  Lightbulb: <Lightbulb className="w-6 h-6 text-accent-foreground" />,
  Target: <div className="w-6 h-6 text-accent-foreground">🎯</div>,
};

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await configAPI.getCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        // Use fallback data if API fails
        setCourses([
          {
            id: "course-1",
            name: "8th Standard",
            description: "Build a rock-solid foundation in core subjects for 8th standard students",
            duration: "10 Months",
          },
          {
            id: "course-2",
            name: "9th Standard",
            description: "Strengthen core subjects and prepare for competitive exams",
            duration: "10 Months",
          },
          {
            id: "course-3",
            name: "10th Standard (Board Prep)",
            description: "Intensive board exam coaching with mock tests and personalized guidance",
            duration: "10 Months",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section id="courses" className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-center min-h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Courses for 8th to 10th Standard</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Focused programs for each standard, designed to help students master their subjects and ace board exams.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-background border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                {iconMap[c.icon || "BookOpen"] || <BookOpen className="w-6 h-6 text-accent-foreground" />}
              </div>
              <h3 className="text-xl font-bold font-display mb-2">{c.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{c.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">DURATION: {c.duration}</span>
                <a href="#contact" className="text-primary font-semibold hover:underline">
                  View Details →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
