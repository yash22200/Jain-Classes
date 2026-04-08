import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { configAPI } from "@/lib/api";

type Filter = "All Batches" | "Offline" | "Online";

interface Batch {
  id: string;
  grade: string;
  description: string;
  time: string;
  mode: "Offline" | "Online";
  instructor: string;
  capacity: number;
  enrolled?: number;
  status: "Open" | "Filling Fast" | "Closed";
}

const BatchesSection = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filter, setFilter] = useState<Filter>("All Batches");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filters: Filter[] = ["All Batches", "Offline", "Online"];

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await configAPI.getBatches();
        setBatches(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setError("Failed to load batches. Using cached data.");
        // Fallback data
        setBatches([
          {
            id: "batch-1",
            grade: "8th",
            description: "Science & Maths",
            time: "04:00 - 06:00 PM",
            mode: "Offline",
            instructor: "Mr. Sameer Jain",
            capacity: 30,
            enrolled: 25,
            status: "Open",
          },
          {
            id: "batch-2",
            grade: "9th",
            description: "All Subjects",
            time: "06:00 - 08:00 PM",
            mode: "Offline",
            instructor: "Prof. Anjali Shah",
            capacity: 28,
            enrolled: 24,
            status: "Filling Fast",
          },
          {
            id: "batch-3",
            grade: "10th",
            description: "Board Prep",
            time: "08:00 - 11:00 AM",
            mode: "Offline",
            instructor: "Dr. R.K. Mathis",
            capacity: 25,
            enrolled: 20,
            status: "Open",
          },
          {
            id: "batch-4",
            grade: "10th",
            description: "Evening Batch",
            time: "05:00 - 07:30 PM",
            mode: "Online",
            instructor: "Mrs. Kavita Jain",
            capacity: 35,
            enrolled: 28,
            status: "Open",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const filtered = filter === "All Batches" ? batches : batches.filter((b) => b.mode === filter);

  if (loading) {
    return (
      <section id="batches" className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="flex items-center justify-center min-h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="batches" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Batches</h2>
            <p className="text-muted-foreground text-sm">
              Find a slot that fits your schedule. Morning, evening, and weekend batches available.
            </p>
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="bg-background rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-4 font-medium">COURSE NAME</th>
                  <th className="text-left p-4 font-medium">TIMING</th>
                  <th className="text-left p-4 font-medium">MODE</th>
                  <th className="text-left p-4 font-medium">FACULTY</th>
                  <th className="text-left p-4 font-medium">STATUS</th>
                  <th className="text-left p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-semibold">{b.grade} Std – {b.description}</td>
                    <td className="p-4 text-muted-foreground">{b.time}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {b.mode}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{b.instructor}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-semibold ${
                          b.status === "Open"
                            ? "text-green-600"
                            : b.status === "Filling Fast"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        ● {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <a href="#contact" className="text-primary font-semibold hover:underline">
                        Apply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BatchesSection;
