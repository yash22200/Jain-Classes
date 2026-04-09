import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";
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
  Bell,
  Upload,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  course?: string;
  enrolledCourses: string[];
  joinDate: string;
  status: "active" | "inactive";
  class?: string;
}

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
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

interface AdminHomework {
  id: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  subject: string;
  fileName: string;
  filePath: string;
  status: string;
  date: string;
}

interface Resource {
  _id: string;
  title: string;
  url: string;
  description?: string;
  type: string;
  grade?: string;
  createdAt: string;
}

interface Question {
  questionText: string;
  options: string[];
  correctOption: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  questions: Question[];
  createdAt: string;
}

const AdminDashboard = () => {
  const { logout, token } = useAuth();
  const { toast } = useToast();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [homeworks, setHomeworks] = useState<AdminHomework[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "enquiries" | "results" | "homeworks" | "notifications" | "resources" | "quizzes">("overview");
  const [newNotification, setNewNotification] = useState("");
  const { sendNotification, notifications } = useNotifications();
  const [newStudent, setNewStudent] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phone: "",
    class: "10th", 
    enrolledCourses: "",
    status: "active" as "active" | "inactive"
  });
  const [newResult, setNewResult] = useState({ studentId: "", subject: "", marks: "", totalMarks: "100" });
  const [newResource, setNewResource] = useState({ title: "", url: "", description: "", type: "video", grade: "" });
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "", course: "", questions: [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }] });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resStud, resEnq, resRes, resHw, resResource, resQuiz] = await Promise.all([
        fetch(`${API_URL}/api/admin/students`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/api/admin/enquiries`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/api/admin/results`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/api/admin/homeworks`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/api/admin/resources`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/api/admin/quizzes`, { headers }).then(r => r.json())
      ]);

      if (resStud.success) setStudents(resStud.data);
      if (resEnq.success) setEnquiries(resEnq.data);
      if (resRes.success) setResults(resRes.data);
      if (resHw.success) setHomeworks(resHw.data);
      if (resResource && resResource.success) setResources(resResource.data);
      if (resQuiz && resQuiz.success) setQuizzes(resQuiz.data);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to fetch dashboard data.", variant: "destructive" });
    }
  };

  const addStudent = async () => {
    // Validation
    if (!newStudent.name || !newStudent.email || !newStudent.password || !newStudent.phone) {
      toast({ title: "Error", description: "Please fill all required fields (Name, Email, Password, Phone)", variant: "destructive" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    // Password validation
    if (newStudent.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    // Phone validation
    const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
    if (!phoneRegex.test(newStudent.phone)) {
      toast({ title: "Error", description: "Please enter a valid phone number", variant: "destructive" });
      return;
    }

    try {
      const coursesArray = newStudent.enrolledCourses
        ? newStudent.enrolledCourses.split(",").map(c => c.trim()).filter(c => c)
        : [];

      const res = await fetch(`${API_URL}/api/admin/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStudent.name.trim(),
          email: newStudent.email.trim(),
          password: newStudent.password,
          phone: newStudent.phone.trim(),
          class: newStudent.class,
          enrolledCourses: coursesArray.length > 0 ? coursesArray : ["General"],
          status: newStudent.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Student added successfully" });
        setNewStudent({ 
          name: "", 
          email: "", 
          password: "",
          phone: "",
          class: "10th", 
          enrolledCourses: "",
          status: "active"
        });
        fetchData(); 
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Student deleted" });
        fetchData(); 
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const addResult = async () => {
    if (newResult.studentId && newResult.subject && newResult.marks) {
      try {
        const res = await fetch(`${API_URL}/api/admin/results`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: newResult.studentId,
            subject: newResult.subject,
            marks: newResult.marks,
            totalMarks: newResult.totalMarks,
          }),
        });
        const data = await res.json();
        if (data.success) {
          toast({ title: "Success", description: "Result added correctly" });
          setNewResult({ studentId: "", subject: "", marks: "", totalMarks: "100" });
          fetchData();
        } else {
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "Please fill all result details", variant: "destructive" });
    }
  };

  const markEnquiryAsReviewed = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "new" ? "reviewed" : "responded";
      const res = await fetch(`${API_URL}/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Enquiry status updated" });
        fetchData();
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const addResource = async () => {
    if (newResource.title && newResource.url) {
      try {
        const res = await fetch(`${API_URL}/api/admin/resources`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newResource),
        });
        const data = await res.json();
        if (data.success) {
          toast({ title: "Success", description: "Resource added successfully" });
          setNewResource({ title: "", url: "", description: "", type: "video", grade: "" });
          fetchData(); 
        } else {
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "Please enter title and URL", variant: "destructive" });
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/resources/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Resource deleted" });
        fetchData(); 
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const addQuiz = async () => {
    if (newQuiz.title && newQuiz.questions.length > 0) {
      if (newQuiz.questions.some(q => !q.questionText || q.options.some(opt => !opt))) {
        return toast({ title: "Error", description: "Please fill all question texts and options", variant: "destructive" });
      }
      try {
        const res = await fetch(`${API_URL}/api/admin/quizzes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newQuiz),
        });
        const data = await res.json();
        if (data.success) {
          toast({ title: "Success", description: "Quiz created successfully" });
          setNewQuiz({ title: "", description: "", course: "", questions: [{ questionText: "", options: ["", "", "", ""], correctOption: 0 }] });
          fetchData(); 
        } else {
          toast({ title: "Error", description: data.message, variant: "destructive" });
        }
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Error", description: "Please enter title and at least one question", variant: "destructive" });
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/quizzes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Quiz deleted" });
        fetchData(); 
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto flex gap-0 px-4 overflow-x-auto">
          {[
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "students" as const, label: "Students", icon: Users },
            { id: "enquiries" as const, label: "Enquiries", icon: MessageSquare },
            { id: "results" as const, label: "Results", icon: FileText },
            { id: "homeworks" as const, label: "Homeworks", icon: Upload },
            { id: "resources" as const, label: "Resources", icon: BookOpen },
            { id: "quizzes" as const, label: "Quizzes", icon: FileText },
            { id: "notifications" as const, label: "Notifications", icon: Bell },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
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
                icon={Upload}
                label="Homeworks Submitted"
                value={homeworks.length}
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
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        placeholder="John Doe"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="student@example.com"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Password * (min 8 characters)</Label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        placeholder="+91 98164 43210"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <select
                        value={newStudent.class}
                        onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <option value="8th">8th</option>
                        <option value="9th">9th</option>
                        <option value="10th">10th</option>
                        <option value="11th">11th</option>
                        <option value="12th">12th</option>
                      </select>
                    </div>
                    <div>
                      <Label>Enrolled Courses (comma-separated)</Label>
                      <Input
                        placeholder="e.g., JEE, NEET, State Board"
                        value={newStudent.enrolledCourses}
                        onChange={(e) => setNewStudent({ ...newStudent, enrolledCourses: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select
                        value={newStudent.status}
                        onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value as "active" | "inactive" })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
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
                            {s.name} ({s.class || "Student"})
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
                    <div key={enq._id} className="p-3 bg-background rounded border">
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
                  {enquiries.length === 0 && <p className="text-sm text-muted-foreground">No recent enquiries</p>}
                </div>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Recent Homeworks</h3>
                <div className="space-y-3">
                  {homeworks.slice(0, 3).map((hw) => (
                    <div key={hw.id} className="p-3 bg-background rounded border flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{hw.studentName}</p>
                        <p className="text-xs text-muted-foreground">{hw.grade} - {hw.subject}</p>
                      </div>
                      <div className="text-right">
                        <a href={`${API_URL}/${hw.filePath.replace(/\\/g, "/")}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">View PDF</Button>
                        </a>
                      </div>
                    </div>
                  ))}
                  {homeworks.length === 0 && <p className="text-sm text-muted-foreground">No recent homeworks</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Send Notification</h2>
            <div className="flex flex-col max-w-md">
              <textarea
                className="border rounded p-2 mb-2 resize-none"
                rows={3}
                value={newNotification}
                onChange={(e) => setNewNotification(e.target.value)}
                placeholder="Type your message here..."
              />
              <Button
                onClick={() => {
                  if (newNotification.trim()) {
                    sendNotification(newNotification.trim());
                    setNewNotification("");
                    toast({ title: "Notification sent" });
                  }
                }}
              >
                Send
              </Button>
            </div>
            {notifications.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Recent notifications</h3>
                <ul className="list-disc list-inside space-y-1">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      {n.message} <span className="text-xs text-muted-foreground">({new Date(n.date).toLocaleString()})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        placeholder="John Doe"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="student@example.com"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Password * (min 8 characters)</Label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        placeholder="+91 98164 43210"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <select
                        value={newStudent.class}
                        onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <option value="8th">8th</option>
                        <option value="9th">9th</option>
                        <option value="10th">10th</option>
                        <option value="11th">11th</option>
                        <option value="12th">12th</option>
                      </select>
                    </div>
                    <div>
                      <Label>Enrolled Courses (comma-separated)</Label>
                      <Input
                        placeholder="e.g., JEE, NEET, State Board"
                        value={newStudent.enrolledCourses}
                        onChange={(e) => setNewStudent({ ...newStudent, enrolledCourses: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select
                        value={newStudent.status}
                        onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value as "active" | "inactive" })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <Button onClick={addStudent} className="w-full">
                      Add Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card rounded-lg border overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Class</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Enrolled Courses</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Join Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {(student as any).phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{student.class || "N/A"}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {student.enrolledCourses?.map((course, i) => (
                            <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs whitespace-nowrap">
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(student.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
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
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted-foreground">No students found</td>
                    </tr>
                  )}
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
                <div key={enq._id} className="bg-card rounded-lg border p-6">
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
                      <p className="font-semibold">{new Date(enq.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="font-semibold whitespace-pre-line">{enq.message}</p>
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
                      onClick={() => markEnquiryAsReviewed(enq._id, enq.status)}
                      disabled={enq.status === "responded"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {enq.status === "new" ? "Mark Reviewed" : "Mark Responded"}
                    </Button>
                  </div>
                </div>
              ))}
              {enquiries.length === 0 && <p className="text-muted-foreground">No enquiries found</p>}
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
                            {s.name} ({s.class || "Student"})
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
                      <td className="px-6 py-4 text-sm font-semibold">{result.percentage ? result.percentage.toFixed(1) : 0}%</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(result.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted-foreground">No results found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Homeworks Tab */}
        {activeTab === "homeworks" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Uploaded Homeworks</h2>
              <p className="text-muted-foreground text-sm">
                View homework submissions categorized by student grade and subject.
              </p>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Grade / Class</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Submitted Date</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {homeworks.map((hw) => (
                    <tr key={hw.id} className="border-b hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm font-medium">
                        {hw.studentName}
                        <div className="text-xs text-muted-foreground font-normal mt-1">{hw.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">{hw.grade}</td>
                      <td className="px-6 py-4 text-sm">{hw.subject}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(hw.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a href={`${API_URL}/${hw.filePath.replace(/\\/g, "/")}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="w-full max-w-xs">
                            <Eye className="w-4 h-4 mr-2" /> View PDF
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                  {homeworks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 opacity-20" />
                          <p>No student homeworks uploaded yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Resources</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New YouTube Resource</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        placeholder="Video Title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>YouTube URL</Label>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Grade/Class (Optional)</Label>
                      <Input
                        placeholder="10th, 9th, etc."
                        value={newResource.grade}
                        onChange={(e) => setNewResource({ ...newResource, grade: e.target.value })}
                      />
                    </div>
                    <Button onClick={addResource} className="w-full">
                      Add Resource
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {resources.map((res) => (
                <div key={res._id} className="bg-card rounded-lg border p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                       <span className="text-red-500">▶</span> {res.title}
                    </h3>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline mt-1 inline-block">{res.url}</a>
                    <p className="text-xs text-muted-foreground mt-2">Grade: <span className="font-medium text-foreground">{res.grade || "All"}</span> | Added: {new Date(res.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteResource(res._id)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {resources.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No resources added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Quizzes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Create Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Quiz Title</Label>
                      <Input
                        placeholder="e.g. Weekly Math Quiz"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        placeholder="Short description"
                        value={newQuiz.description}
                        onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Course/Grade</Label>
                      <Input
                        placeholder="e.g. 10th Standard or General"
                        value={newQuiz.course}
                        onChange={(e) => setNewQuiz({ ...newQuiz, course: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex justify-between items-center">
                        <Label className="text-lg">Questions</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setNewQuiz({
                            ...newQuiz, 
                            questions: [...newQuiz.questions, { questionText: "", options: ["", "", "", ""], correctOption: 0 }]
                          })}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add Question
                        </Button>
                      </div>
                      
                      {newQuiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 border rounded bg-muted/20 space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Question {qIndex + 1}</Label>
                            {newQuiz.questions.length > 1 && (
                              <Button 
                                variant="ghost" size="sm" className="text-red-500 h-6 px-2"
                                onClick={() => {
                                  const updated = newQuiz.questions.filter((_, i) => i !== qIndex);
                                  setNewQuiz({ ...newQuiz, questions: updated });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <Input
                            placeholder="Question text..."
                            value={q.questionText}
                            onChange={(e) => {
                              const updated = [...newQuiz.questions];
                              updated[qIndex].questionText = e.target.value;
                              setNewQuiz({ ...newQuiz, questions: updated });
                            }}
                          />
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={q.correctOption === optIndex}
                                  onChange={() => {
                                    const updated = [...newQuiz.questions];
                                    updated[qIndex].correctOption = optIndex;
                                    setNewQuiz({ ...newQuiz, questions: updated });
                                  }}
                                  className="w-4 h-4 text-primary"
                                />
                                <Input
                                  placeholder={`Option ${optIndex + 1}`}
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...newQuiz.questions];
                                    updated[qIndex].options[optIndex] = e.target.value;
                                    setNewQuiz({ ...newQuiz, questions: updated });
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={addQuiz} className="w-full mt-6">
                      Save Quiz
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-card rounded-lg border p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                       <FileText className="w-5 h-5 text-primary" /> {quiz.title}
                    </h3>
                    <p className="text-sm mt-1">{quiz.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Course: <span className="font-medium text-foreground">{quiz.course || "General"}</span> | 
                      Questions: <span className="font-medium text-foreground">{quiz.questions?.length}</span> | 
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteQuiz(quiz._id)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {quizzes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No quizzes created yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
