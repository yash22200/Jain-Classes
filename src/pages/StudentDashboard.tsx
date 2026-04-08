import { useAuth } from "@/context/AuthContext";
import { API_URL, configAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  FileText,
  Upload,
  LogOut,
  Award,
  TrendingUp,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { useGrades } from "@/context/GradeContext";
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

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  rollNumber: string;
  enrolledCourses: string[];
  joinDate: string;
  status: string;
}

interface StudentResult {
  _id: string;
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  createdAt: string;
  grade: string;
}

interface Homework {
  _id: string;
  subject: string;
  createdAt: string;
  status: "pending" | "checked" | "graded";
  fileName?: string;
  marks?: number;
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
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  questions: Question[];
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
}

const StudentDashboard = () => {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "results" | "resources" | "homework" | "quizzes">("overview");

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [newHomework, setNewHomework] = useState({ subject: "", file: null as File | null });
  const [isUploading, setIsUploading] = useState(false);
  
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<{ score: number, total: number } | null>(null);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchAvailableCourses();
    }
  }, [token]);

  const fetchAvailableCourses = async () => {
    try {
      const courses = await configAPI.getCourses();
      setAvailableCourses(courses);
    } catch (error) {
      console.error("Error fetching available courses:", error);
      // Use fallback courses
      setAvailableCourses([
        { id: "1", name: "8th Standard", description: "8th standard curriculum", duration: "10 Months" },
        { id: "2", name: "9th Standard", description: "9th standard curriculum", duration: "10 Months" },
        { id: "3", name: "10th Standard (Board Prep)", description: "Board preparation", duration: "10 Months" },
      ]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resProfile, resResults, resHomework, resResource, resQuiz] = await Promise.all([
        fetch(`${API_URL}/api/student/profile`, { headers }).then((res) => res.json()),
        fetch(`${API_URL}/api/student/results`, { headers }).then((res) => res.json()),
        fetch(`${API_URL}/api/student/homework`, { headers }).then((res) => res.json()),
        fetch(`${API_URL}/api/student/resources`, { headers }).then((res) => res.json()),
        fetch(`${API_URL}/api/student/quizzes`, { headers }).then((res) => res.json()),
      ]);

      if (resProfile.success) setProfile(resProfile.data);
      if (resResults.success) setResults(resResults.data);
      if (resHomework.success) setHomeworks(resHomework.data);
      if (resResource && resResource.success) setResources(resResource.data);
      if (resQuiz && resQuiz.success) setQuizzes(resQuiz.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
    }
  };

  const uploadHomework = async () => {
    if (!newHomework.subject || !newHomework.file) {
      toast({ title: "Error", description: "Please select a subject and a file", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("subject", newHomework.subject);
      formData.append("file", newHomework.file);

      const res = await fetch(`${API_URL}/api/student/homework`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Homework uploaded successfully" });
        setNewHomework({ subject: "", file: null });
        fetchDashboardData();
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const isYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const convertToEmbedUrl = (url: string) => {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    } else if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
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

  const enrollCourse = async (courseName: string) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
      const res = await fetch(`${API_URL}/api/student/courses/enroll`, {
        method: "POST",
        headers,
        body: JSON.stringify({ courseName })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Successfully enrolled in course!" });
        if (profile) {
          setProfile({ ...profile, enrolledCourses: data.data });
        }
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to enroll in course", variant: "destructive" });
    }
  };

  const submitQuiz = async (quizId: string) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
      const res = await fetch(`${API_URL}/api/student/quizzes/${quizId}/attempt`, {
        method: "POST",
        headers,
        body: JSON.stringify({ answers: quizAnswers })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Quiz Submitted", description: `You scored ${data.data.score}/${data.data.totalQuestions}!` });
        setQuizScore({ score: data.data.score, total: data.data.totalQuestions });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to submit quiz", variant: "destructive" });
    }
  };

  const filteredResources = resources.filter(r => !r.grade || r.grade === profile?.class);
  const avgScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Portal</h1>
            <p className="text-sm text-primary-foreground/80">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
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
            { id: "overview" as const, label: "Overview", icon: FileText },
            { id: "courses" as const, label: "Courses", icon: BookOpen },
            { id: "results" as const, label: "Results", icon: Award },
            { id: "resources" as const, label: "Resources", icon: BookOpen },
            { id: "homework" as const, label: "Homework", icon: Upload },
            { id: "quizzes" as const, label: "Quizzes", icon: FileText },
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
            {profile && (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.class}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Roll Number</p>
                    <p className="font-semibold">{profile.rollNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm break-all">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold">{profile.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Join Date</p>
                    <p className="font-semibold">{new Date(profile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard icon={BookOpen} label="Enrolled Courses" value={profile?.enrolledCourses?.length || 0} color="text-blue-500" />
              <StatCard icon={Award} label="Total Tests" value={results.length} color="text-green-500" />
              <StatCard icon={TrendingUp} label="Avg. Score" value={`${avgScore}%`} color="text-purple-500" />
              <StatCard icon={Upload} label="Homeworks" value={homeworks.length} color="text-orange-500" />
            </div>

            {/* Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Recent Results</h3>
                <div className="space-y-4">
                  {results.slice(0, 5).map((item) => (
                    <div key={item._id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.subject}</span>
                        <span className="text-sm font-bold text-primary">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {results.length === 0 && <p className="text-sm text-muted-foreground">No recent results</p>}
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
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
                    <Button className="h-20 flex flex-col items-center justify-center gap-2 md:col-span-2 text-primary bg-primary/10 hover:bg-primary/20 border-primary/20">
                      <Upload className="w-6 h-6" />
                      <span>Upload New Homework</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Homework</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Subject</Label>
                        <Input
                          placeholder="Mathematics"
                          value={newHomework.subject}
                          onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Select File</Label>
                        <Input
                          type="file"
                          onChange={(e) => setNewHomework({ ...newHomework, file: e.target.files?.[0] || null })}
                        />
                      </div>
                      <Button onClick={uploadHomework} className="w-full" disabled={isUploading}>
                        <Upload className="w-4 h-4 mr-2" /> {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.enrolledCourses?.map((course, idx) => (
                  <div key={idx} className="bg-card rounded-lg border p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{course}</h3>
                        <p className="text-sm text-muted-foreground">Class: {profile.class || "General"}</p>
                      </div>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        Enrolled
                      </span>
                    </div>
                  </div>
                ))}
                {(!profile?.enrolledCourses || profile.enrolledCourses.length === 0) && (
                  <div className="col-span-full py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                    <p>No courses enrolled yet. Browse available courses below to enroll.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.filter(c => !profile?.enrolledCourses?.includes(c.name)).map((course) => (
                  <div key={course.id} className="bg-card rounded-lg border p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.description}
                      </p>
                    </div>
                    <Button className="w-full mt-4" onClick={() => enrollCourse(course.name)}>
                      Enroll Now
                    </Button>
                  </div>
                ))}
                {availableCourses.filter(c => !profile?.enrolledCourses?.includes(c.name)).length === 0 && (
                  <div className="col-span-full py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                    <p>You have enrolled in all available courses!</p>
                  </div>
                )}
              </div>
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
                  {results.map((result) => (
                    <tr key={result._id} className="border-b hover:bg-muted/50 transition">
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
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(result.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {results.length === 0 && (
                     <tr>
                       <td colSpan={5} className="text-center py-4 text-muted-foreground">No results available</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            {filteredResources.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No resources available at this time</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">Learning Resources</h2>
                <div className="grid gap-4">
                  {filteredResources.map((res) => (
                    <div key={res._id} className="bg-card rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500 text-xl">▶</span>
                        <h3 className="font-semibold">{res.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Added: {new Date(res.createdAt).toLocaleDateString()}</p>
                      <div>
                        {isYoutubeUrl(res.url) ? (
                          <iframe
                            width="100%"
                            height="200"
                            src={convertToEmbedUrl(res.url)}
                            title={res.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                          ></iframe>
                        ) : (
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {res.url}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === "homework" && (
          <div className="space-y-6">
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
                      <Input
                        placeholder="Mathematics"
                        value={newHomework.subject}
                        onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Select File</Label>
                      <Input
                        type="file"
                        onChange={(e) => setNewHomework({ ...newHomework, file: e.target.files?.[0] || null })}
                      />
                    </div>
                    <Button onClick={uploadHomework} className="w-full" disabled={isUploading}>
                      <Upload className="w-4 h-4 mr-2" /> {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {homeworks.map((hw) => (
              <div key={hw._id} className="bg-card rounded-lg border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-semibold">{hw.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted Date</p>
                      <p className="font-semibold">{new Date(hw.createdAt).toLocaleDateString()}</p>
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
                  {hw.marks !== null && hw.marks !== undefined && (
                    <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/20">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="font-bold text-lg text-primary">{hw.marks} / 50</p>
                    </div>
                  )}
                </div>
              ))}
              {homeworks.length === 0 && <p className="text-muted-foreground">No homework submitted yet.</p>}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Quizzes</h2>
            {!activeQuiz ? (
              <div className="grid gap-4">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-card rounded-lg border p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> {quiz.title}
                      </h3>
                      <p className="text-sm mt-1">{quiz.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Questions: {quiz.questions?.length}
                      </p>
                    </div>
                    <Button onClick={() => {
                      setActiveQuiz(quiz);
                      setQuizAnswers({});
                      setQuizScore(null);
                    }}>
                      Attempt Quiz
                    </Button>
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <p className="text-muted-foreground">No quizzes available at the moment.</p>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold">{activeQuiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{activeQuiz.description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveQuiz(null)}>Back to Quizzes</Button>
                </div>

                {quizScore ? (
                  <div className="text-center py-10 space-y-4">
                    <Award className="w-16 h-16 mx-auto text-primary" />
                    <h2 className="text-2xl font-bold">Quiz Completed!</h2>
                    <p className="text-lg">Your score: <span className="font-bold text-primary">{quizScore.score}</span> / {quizScore.total}</p>
                    <div className="mt-6 flex justify-center">
                      <Button onClick={() => setActiveQuiz(null)}>Take Another Quiz</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {activeQuiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-4 p-4 border rounded bg-muted/20">
                        <Label className="text-lg font-semibold">{qIndex + 1}. {q.questionText}</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {q.options.map((opt, optIndex) => (
                            <label 
                              key={optIndex} 
                              className={`flex items-center p-3 border rounded cursor-pointer transition-all ${
                                quizAnswers[qIndex] === optIndex 
                                  ? "bg-primary/10 border-primary" 
                                  : "bg-background hover:bg-muted"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${qIndex}`}
                                value={optIndex}
                                checked={quizAnswers[qIndex] === optIndex}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }))}
                                className="mr-3 w-4 h-4 text-primary"
                              />
                              <span className="text-sm font-medium">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        size="lg" 
                        onClick={() => submitQuiz(activeQuiz._id)}
                        disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                      >
                        Submit Quiz
                      </Button>
                    </div>
                    {Object.keys(quizAnswers).length < activeQuiz.questions.length && (
                      <p className="text-xs text-right text-muted-foreground mt-2">
                        Please answer all questions before submitting.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
