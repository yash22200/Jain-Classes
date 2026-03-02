import { Atom, BookOpen, Lightbulb } from "lucide-react";

const courses = [
  {
    icon: BookOpen,
    title: "8th Standard",
    desc: "Build a rock-solid foundation in Science, Maths, and English with concept-based learning and regular tests.",
    duration: "10 Months",
  },
  {
    icon: Atom,
    title: "9th Standard",
    desc: "Strengthen core subjects with deeper problem-solving, practicals, and board-pattern preparation.",
    duration: "10 Months",
  },
  {
    icon: Lightbulb,
    title: "10th Standard (Board Prep)",
    desc: "Intensive board exam coaching with mock tests, previous year papers, and guaranteed personal attention.",
    duration: "10 Months",
  },
];

const CoursesSection = () => (
  <section id="courses" className="py-16 md:py-24">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Courses for 8th to 10th Standard</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Focused programs for each standard, designed to help students master their subjects and ace board exams.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.title} className="bg-background border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
              <c.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{c.desc}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">DURATION: {c.duration}</span>
              <a href="#contact" className="text-primary font-semibold hover:underline">View Details →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CoursesSection;
