import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type Filter = "All Batches" | "Offline" | "Online";

const batches = [
  {
    name: "8th Std – Science & Maths",
    timing: "04:00 PM - 06:00 PM",
    subjects: ["SCI", "MATH"],
    faculty: "Mr. Sameer Jain",
    status: "Open",
    mode: "Offline" as const,
  },
  {
    name: "9th Std – All Subjects",
    timing: "06:00 PM - 08:00 PM",
    subjects: ["SCI", "MATH", "ENG"],
    faculty: "Prof. Anjali Shah",
    status: "Filling Fast",
    mode: "Offline" as const,
  },
  {
    name: "10th Std – Board Prep",
    timing: "08:00 AM - 11:00 AM",
    subjects: ["SCI", "MATH", "SST"],
    faculty: "Dr. R.K. Mathis",
    status: "Open",
    mode: "Offline" as const,
  },
  {
    name: "10th Std – Evening Batch",
    timing: "05:00 PM - 07:30 PM",
    subjects: ["SCI", "MATH"],
    faculty: "Mrs. Kavita Jain",
    status: "Open",
    mode: "Online" as const,
  },
];

const BatchesSection = () => {
  const [filter, setFilter] = useState<Filter>("All Batches");
  const filters: Filter[] = ["All Batches", "Offline", "Online"];

  const filtered = filter === "All Batches" ? batches : batches.filter((b) => b.mode === filter);

  return (
    <section id="batches" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Batches</h2>
            <p className="text-muted-foreground text-sm">Find a slot that fits your schedule. Morning, evening, and weekend batches available.</p>
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-4 font-medium">COURSE NAME</th>
                  <th className="text-left p-4 font-medium">TIMING</th>
                  <th className="text-left p-4 font-medium">SUBJECTS</th>
                  <th className="text-left p-4 font-medium">FACULTY</th>
                  <th className="text-left p-4 font-medium">STATUS</th>
                  <th className="text-left p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.name} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-semibold">{b.name}</td>
                    <td className="p-4 text-muted-foreground">{b.timing}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {b.subjects.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{b.faculty}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold ${b.status === "Open" ? "text-success" : "text-warning"}`}>
                        ● {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <a href="#contact" className="text-primary font-semibold hover:underline">Apply</a>
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
