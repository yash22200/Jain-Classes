import { useAuth } from "@/context/MockAuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Eye,
  LogOut,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  joinDate: string;
  status: "active" | "inactive";
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "reviewed" | "responded";
}

interface Result {
  id: string;
  studentName: string;
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  date: string;
}

// Mock data
const MOCK_STUDENTS: Student[] = [
  {
    id: "st-001",
    name: "Raj Kumar",
    email: "raj@example.com",
    enrolledCourses: ["Mathematics", "English"],
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "st-002",
    name: "Priya Singh",
    email: "priya@example.com",
    enrolledCourses: ["Science", "Hindi"],
    joinDate: "2024-02-20",
    status: "active",
  },
  {
    id: "st-003",
    name: "Amit Patel",
    email: "amit@example.com",
    enrolledCourses: ["Mathematics", "Science"],
    joinDate: "2024-01-10",
    status: "active",
  },
];

const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-001",
    name: "Vikram Sharma",
    email: "vikram@example.com",
    phone: "+91-9876543210",
    message: "Interested in batch starting March 2024",
    date: "2024-02-28",
    status: "new",
  },
  {
    id: "enq-002",
    name: "Anjali Gupta",
    email: "anjali@example.com",
    phone: "+91-9123456789",
    message: "Need fee structure details",
    date: "2024-02-27",
    status: "reviewed",
  },
  {
    id: "enq-003",
    name: "Rohit Verma",
    email: "rohit@example.com",
    phone: "+91-8765432109",
    message: "Want information about online classes",
    date: "2024-02-26",
    status: "responded",
  },
];

const MOCK_RESULTS: Result[] = [
  {
    id: "res-001",
    studentName: "Raj Kumar",
    subject: "Mathematics",
    marks: 92,
    totalMarks: 100,
    percentage: 92,
    date: "2024-02-20",
  },
  {
    id: "res-002",
    studentName: "Priya Singh",
    subject: "Science",
    marks: 88,
    totalMarks: 100,
    percentage: 88,
    date: "2024-02-20",
  },
  {
    id: "res-003",
    studentName: "Amit Patel",
    subject: "Mathematics",
    marks: 85,
    totalMarks: 100,
    percentage: 85,
    date: "2024-02-20",
  },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(MOCK_ENQUIRIES);
  const [results, setResults] = useState<Result[]>(MOCK_RESULTS);
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "enquiries" | "results">("overview");
  const [newStudent, setNewStudent] = useState({ name: "", email: "", course: "" });
  const [newResult, setNewResult] = useState({ studentId: "", subject: "", marks: "", totalMarks: "100" });

  const addStudent = () => {
    if (newStudent.name && newStudent.email) {
      const student: Student = {
        id: `st-${Date.now()}`,
        name: newStudent.name,
        email: newStudent.email,
        enrolledCourses: [newStudent.course || "General"],
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
      };
      setStudents([...students, student]);
      setNewStudent({ name: "", email: "", course: "" });
    }
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const addResult = () => {
    if (newResult.studentId && newResult.subject && newResult.marks) {
      const result: Result = {
        id: `res-${Date.now()}`,
        studentName: students.find((s) => s.id === newResult.studentId)?.name || "",
        subject: newResult.subject,
        marks: parseInt(newResult.marks),
        totalMarks: parseInt(newResult.totalMarks),
        percentage: (parseInt(newResult.marks) / parseInt(newResult.totalMarks)) * 100,
        date: new Date().toISOString().split("T")[0],
      };
      setResults([...results, result]);
      setNewResult({ studentId: "", subject: "", marks: "", totalMarks: "100" });
    }
  };

  const markEnquiryAsReviewed = (id: string) => {
    setEnquiries(
      enquiries.map((e) =>
        e.id === id ? { ...e, status: e.status === "new" ? "reviewed" : "responded" } : e
      )
    );
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-card rounded-lg border p-6 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-primary-foreground/80">Manage your Jain Classes</p>
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
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "students" as const, label: "Students", icon: Users },
            { id: "enquiries" as const, label: "Enquiries", icon: MessageSquare },
            { id: "results" as const, label: "Results", icon: FileText },
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Students"
                value={students.length}
                color="text-blue-500"
              />
              <StatCard
                icon={MessageSquare}
                label="Total Enquiries"
                value={enquiries.length}
                color="text-orange-500"
              />
              <StatCard
                icon={FileText}
                label="Results Posted"
                value={results.length}
                color="text-green-500"
              />
              <StatCard
                icon={BookOpen}
                label="Active Courses"
                value="8"
                color="text-purple-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-24 flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span>Add Student</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="Student name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        placeholder="student@example.com"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Course</Label>
                      <Input
                        placeholder="Mathematics"
                        value={newStudent.course}
                        onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                      />
                    </div>
                    <Button onClick={addStudent} className="w-full">
                      Add Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-24 flex flex-col items-center justify-center gap-2" variant="secondary">
                    <Plus className="w-6 h-6" />
                    <span>Add Result</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Result</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Student</Label>
                      <select
                        value={newResult.studentId}
                        onChange={(e) => setNewResult({ ...newResult, studentId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select student</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        placeholder="Mathematics"
                        value={newResult.subject}
                        onChange={(e) => setNewResult({ ...newResult, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Marks Obtained</Label>
                      <Input
                        placeholder="85"
                        type="number"
                        value={newResult.marks}
                        onChange={(e) => setNewResult({ ...newResult, marks: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Total Marks</Label>
                      <Input
                        placeholder="100"
                        type="number"
                        value={newResult.totalMarks}
                        onChange={(e) => setNewResult({ ...newResult, totalMarks: e.target.value })}
                      />
                    </div>
                    <Button onClick={addResult} className="w-full">
                      Add Result
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Recent Enquiries</h3>
                <div className="space-y-3">
                  {enquiries.slice(0, 3).map((enq) => (
                    <div key={enq.id} className="p-3 bg-background rounded border">
                      <p className="font-medium text-sm">{enq.name}</p>
                      <p className="text-xs text-muted-foreground">{enq.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          enq.status === "new" ? "bg-yellow-100 text-yellow-800" : 
                          enq.status === "reviewed" ? "bg-blue-100 text-blue-800" : 
                          "bg-green-100 text-green-800"
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {results.slice(0, 3).map((res) => (
                    <div key={res.id} className="p-3 bg-background rounded border flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{res.studentName}</p>
                        <p className="text-xs text-muted-foreground">{res.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{res.marks}/{res.totalMarks}</p>
                        <p className="text-xs text-muted-foreground">{res.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Students</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="Student name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        placeholder="student@example.com"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Course</Label>
                      <Input
                        placeholder="Mathematics"
                        value={newStudent.course}
                        onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                      />
                    </div>
                    <Button onClick={addStudent} className="w-full">
                      Add Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Courses</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Join Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {student.enrolledCourses.map((course, i) => (
                            <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{student.joinDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">View All Enquiries</h2>
            <div className="grid gap-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="bg-card rounded-lg border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{enq.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{enq.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{enq.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{enq.date}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="font-semibold">{enq.message}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      enq.status === "new" ? "bg-yellow-100 text-yellow-800" : 
                      enq.status === "reviewed" ? "bg-blue-100 text-blue-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => markEnquiryAsReviewed(enq.id)}
                      disabled={enq.status === "responded"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {enq.status === "new" ? "Mark Reviewed" : "Mark Responded"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Results</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Result</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Student</Label>
                      <select
                        value={newResult.studentId}
                        onChange={(e) => setNewResult({ ...newResult, studentId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select student</option>
                        {students.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input
                        placeholder="Mathematics"
                        value={newResult.subject}
                        onChange={(e) => setNewResult({ ...newResult, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Marks Obtained</Label>
                      <Input
                        placeholder="85"
                        type="number"
                        value={newResult.marks}
                        onChange={(e) => setNewResult({ ...newResult, marks: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Total Marks</Label>
                      <Input
                        placeholder="100"
                        type="number"
                        value={newResult.totalMarks}
                        onChange={(e) => setNewResult({ ...newResult, totalMarks: e.target.value })}
                      />
                    </div>
                    <Button onClick={addResult} className="w-full">
                      Add Result
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Marks</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Percentage</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-medium">{result.studentName}</td>
                      <td className="px-6 py-4 text-sm">{result.subject}</td>
                      <td className="px-6 py-4 text-sm">
                        {result.marks}/{result.totalMarks}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{result.percentage.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{result.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
