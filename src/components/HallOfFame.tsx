import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { configAPI } from "@/lib/api";

interface SuccessStory {
  id: string;
  name: string;
  percentage: number;
  year: string;
  exam: string;
  imageUrl: string;
}

const HallOfFame = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await configAPI.getSuccessStories();
        setStories(data);
      } catch (err) {
        console.error("Error fetching success stories:", err);
        // Fallback data
        setStories([
          {
            id: "1",
            name: "Aryan Sharma",
            percentage: 99.2,
            year: "2024",
            exam: "10th Board",
            imageUrl: "/assets/student-1.jpg",
          },
          {
            id: "2",
            name: "Priya Gupta",
            percentage: 98.1,
            year: "2024",
            exam: "10th Board",
            imageUrl: "/assets/student-2.jpg",
          },
          {
            id: "3",
            name: "Rohan Deshmukh",
            percentage: 97.8,
            year: "2024",
            exam: "10th Board",
            imageUrl: "/assets/student-3.jpg",
          },
          {
            id: "4",
            name: "Sneha Reddy",
            percentage: 98.5,
            year: "2024",
            exam: "10th Board",
            imageUrl: "/assets/student-4.jpg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <section id="results" className="py-16 md:py-24 bg-[hsl(var(--hall-of-fame-bg))] text-[hsl(var(--hall-of-fame-foreground))]">
        <div className="container">
          <div className="flex items-center justify-center min-h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="results"
      className="py-16 md:py-24 bg-[hsl(var(--hall-of-fame-bg))] text-[hsl(var(--hall-of-fame-foreground))]"
    >
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold italic mb-3">Our Hall of Fame</h2>
          <p className="opacity-70 max-w-lg mx-auto">
            Witness the extraordinary success of students who reached their dreams with Jain Classes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stories.map((s) => (
            <div key={s.id} className="group relative overflow-hidden rounded-2xl">
              <img
                src={s.imageUrl}
                alt={s.name}
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback for missing images
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150'%3E%3Crect fill='%23ddd' width='100' height='150'/%3E%3Ctext x='50' y='75' text-anchor='middle' fill='%23999'%3EImage%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded mb-2">
                  {s.percentage}%
                </span>
                <h4 className="font-bold text-sm">{s.name}</h4>
                <p className="text-xs opacity-70">
                  {s.exam} {s.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfFame;
