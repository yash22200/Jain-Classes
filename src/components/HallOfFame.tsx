import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";

const students = [
  { name: "Aryan Sharma", exam: "10th Board 2024", score: "99.2%", img: student1 },
  { name: "Priya Gupta", exam: "10th Board 2024", score: "98.1%", img: student2 },
  { name: "Rohan Deshmukh", exam: "10th Board 2024", score: "97.8%", img: student3 },
  { name: "Sneha Reddy", exam: "10th Board 2024", score: "98.5%", img: student4 },
];

const HallOfFame = () => (
  <section id="results" className="py-16 md:py-24 bg-[hsl(var(--hall-of-fame-bg))] text-[hsl(var(--hall-of-fame-foreground))]">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold italic mb-3">Our Hall of Fame</h2>
        <p className="opacity-70 max-w-lg mx-auto">
          Witness the extraordinary success of students who reached their dreams with Jain Classes.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {students.map((s) => (
          <div key={s.name} className="group relative overflow-hidden rounded-2xl">
            <img
              src={s.img}
              alt={s.name}
              className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded mb-2">
                {s.score}
              </span>
              <h4 className="font-bold text-sm">{s.name}</h4>
              <p className="text-xs opacity-70">{s.exam}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HallOfFame;
