import { useAuth } from "@/context/MockAuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  User,
  BookOpen,
  FileText,
  Upload,
  LogOut,
  Calendar,
  Mail,
  Phone,
  Award,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudentCourse {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  grade: string;
}

interface StudentResult {
  id: string;
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  date: string;
  grade: string;
}

interface Homework {
  id: string;
  subject: string;
  date: string;
  status: "pending" | "checked" | "graded";
  fileName?: string;
  marks?: number;
}

// Mock data
const MOCK_STUDENT = {
  id: "st-001",
  name: "Raj Kumar",
  email: "raj@example.com",
  phone: "+91-9876543210",
  joinDate: "2024-01-15",
  class: "10th Grade",
  rollNumber: "RJ-2024-001",
};

const MOCK_COURSES: StudentCourse[] = [
  { id: "c-001", name: "Mathematics", instructor: "Dr. Sharma", progress: 85, grade: "A" },
  { id: "c-002", name: "English", instructor: "Ms. Patel", progress: 78, grade: "B+" },
  { id: "c-003", name: "Science", instructor: "Dr. Verma", progress: 92, grade: "A+" },
];

const MOCK_RESULTS: StudentResult[] = [
  { id: "r-001", subject: "Mathematics", marks: 92, totalMarks: 100, percentage: 92, date: "2024-02-20", grade: "A+" },
  { id: "r-002", subject: "English", marks: 78, totalMarks: 100, percentage: 78, date: "2024-02-20", grade: "B+" },
  { id: "r-003", subject: "Science", marks: 88, totalMarks: 100, percentage: 88, date: "2024-02-20", grade: "A" },
];

const MOCK_HOMEWORKS: Homework[] = [
  { id: "hw-001", subject: "Mathematics", date: "2024-02-28", status: "pending", fileName: "math_assignment.pdf" },
  { id: "hw-002", subject: "English", date: "2024-02-25", status: "checked", fileName: "essay.docx", marks: 18 },
  { id: "hw-003", subject: "Science", date: "2024-02-22", status: "graded", fileName: "project.zip", marks: 45 },
];

const performanceData = [
  { subject: "Math", score: 92 },
  { subject: "English", score: 78 },
  { subject: "Science", score: 88 },
  { subject: "History", score: 85 },
  { subject: "Geography", score: 80 },
];

const progressData = [
  { month: "Jan", avg: 75 },
  { month: "Feb", avg: 82 },
  { month: "Mar", avg: 85 },
  { month: "Apr", avg: 88 },
  { month: "May", avg: 90 },
  { month: "Jun", avg: 92 },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "results" | "homework">("overview");
  const [homeworks, setHomeworks] = useState<Homework[]>(MOCK_HOMEWORKS);
  const [newHomework, setNewHomework] = useState({ subject: "", file: null as File | null });

  const uploadHomework = () => {
    if (newHomework.subject && newHomework.file) {
      const homework: Homework = {
        id: `hw-${Date.now()}`,
        subject: newHomework.subject,
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        fileName: newHomework.file.name,
      };
      setHomeworks([...homeworks, homework]);
      setNewHomework({ subject: "", file: null });
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-card rounded-lg border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Portal</h1>
            <p className="text-sm text-primary-foreground/80">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto flex gap-0 px-4">
          {[
            { id: "overview" as const, label: "Overview", icon: FileText },
            { id: "courses" as const, label: "Courses", icon: BookOpen },
            { id: "results" as const, label: "Results", icon: Award },
            { id: "homework" as const, label: "Homework", icon: Upload },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === id
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Personal Details Card */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{MOCK_STUDENT.name}</h2>
                  <p className="text-muted-foreground">{MOCK_STUDENT.class}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Roll Number</p>
                  <p className="font-semibold">{MOCK_STUDENT.rollNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm break-all">{MOCK_STUDENT.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-semibold">{MOCK_STUDENT.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Join Date</p>
                  <p className="font-semibold">{MOCK_STUDENT.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard icon={BookOpen} label="Enrolled Courses" value="3" color="text-blue-500" />
              <StatCard icon={Award} label="Current CGPA" value="8.8" color="text-green-500" />
              <StatCard icon={TrendingUp} label="Avg. Score" value="86%" color="text-purple-500" />
              <StatCard icon={Upload} label="Homeworks" value={homeworks.length} color="text-orange-500" />
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Performance by Subject</h3>
                <div className="space-y-4">
                  {performanceData.map((item) => (
                    <div key={item.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.subject}</span>
                        <span className="text-sm font-bold text-primary">{item.score}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Progress Over Time</h3>
                <div className="space-y-3">
                  {progressData.map((item) => (
                    <div key={item.month} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-12">{item.month}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 flex items-center px-2">
                        <div
                          className="bg-blue-500 h-4 rounded-full transition-all"
                          style={{ width: `${item.avg}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary w-8 text-right">{item.avg}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => setActiveTab("courses")}
              >
                <BookOpen className="w-6 h-6" />
                <span>View Courses</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
                onClick={() => setActiveTab("results")}
              >
                <Award className="w-6 h-6" />
                <span>View Results</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center gap-2">
                    <Upload className="w-6 h-6" />
                    <span>Upload Homework</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Homework</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Subject</Label>
                      <select
                        value={newHomework.subject}
                        onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select subject</option>
                        {MOCK_COURSES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Select File</Label>
                      <Input
                        type="file"
                        onChange={(e) => setNewHomework({ ...newHomework, file: e.target.files?.[0] || null })}
                      />
                    </div>
                    <Button onClick={uploadHomework} className="w-full">
                      <Upload className="w-4 h-4 mr-2" /> Upload
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_COURSES.map((course) => (
                <div key={course.id} className="bg-card rounded-lg border p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">Instructor: {course.instructor}</p>
                    </div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {course.grade}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-sm font-semibold">{course.progress}%</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Results</h2>
            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Marks</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Percentage</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Grade</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RESULTS.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-medium">{result.subject}</td>
                      <td className="px-6 py-4 text-sm">
                        {result.marks}/{result.totalMarks}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{result.percentage}%</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          result.grade === "A+" || result.grade === "A" ? "bg-green-100 text-green-800" :
                          result.grade === "B+" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{result.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === "homework" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Homeworks</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" /> Upload Homework
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Homework</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Subject</Label>
                      <select
                        value={newHomework.subject}
                        onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select subject</option>
                        {MOCK_COURSES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Select File</Label>
                      <Input
                        type="file"
                        onChange={(e) => setNewHomework({ ...newHomework, file: e.target.files?.[0] || null })}
                      />
                    </div>
                    <Button onClick={uploadHomework} className="w-full">
                      <Upload className="w-4 h-4 mr-2" /> Upload
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {homeworks.map((hw) => (
                <div key={hw.id} className="bg-card rounded-lg border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-semibold">{hw.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted Date</p>
                      <p className="font-semibold">{hw.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">File</p>
                      <p className="font-semibold text-sm">{hw.fileName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        hw.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        hw.status === "checked" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {hw.marks && (
                    <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/20">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="font-bold text-lg text-primary">{hw.marks} / 50</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
