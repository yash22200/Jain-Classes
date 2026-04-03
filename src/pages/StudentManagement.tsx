import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGrades, Grade } from "@/context/GradeContext";
import { Textarea } from "@/components/ui/textarea";

const StudentManagement = () => {
  const {
    getStudentsByGrade,
    getHomeworkByGrade,
    getResourcesByGrade,
    uploadResource,
    updateHomeworkStatus,
  } = useGrades();

  const [activeGrade, setActiveGrade] = useState<Grade>("8th");
  const [activeTab, setActiveTab] = useState<"students" | "homework" | "resources">("students");
  const [newResource, setNewResource] = useState({ title: "", type: "video" as "video" | "notes", content: "" });

  const students = getStudentsByGrade(activeGrade);
  const homeworkList = getHomeworkByGrade(activeGrade);
  const resources = getResourcesByGrade(activeGrade);

  const handleUploadResource = () => {
    if (newResource.title && newResource.content) {
      uploadResource({
        title: newResource.title,
        type: newResource.type,
        content: newResource.content,
        date: new Date().toISOString().split("T")[0],
        grade: activeGrade,
      });
      setNewResource({ title: "", type: "video", content: "" });
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Student Management</h1>
          </div>
        </div>
      </nav>

      {/* Grade Tabs */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto flex gap-0 px-4">
          {(["8th", "9th", "10th"] as Grade[]).map((grade) => (
            <button
              key={grade}
              onClick={() => {
                setActiveGrade(grade);
                setActiveTab("students");
              }}
              className={`flex items-center px-6 py-3 border-b-2 transition-all font-medium ${
                activeGrade === grade
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {grade} Grade
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-b flex gap-4">
        {["students", "homework", "resources"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "students" | "homework" | "resources")}
            className={`px-4 py-2 rounded font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {tab === "students" && "Students"}
            {tab === "homework" && "Homework"}
            {tab === "resources" && "Resources"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Students ({students.length})</h2>
            </div>

            <div className="grid gap-4">
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No students in this grade</div>
              ) : (
                students.map((student) => (
                  <div key={student.studentId} className="bg-card rounded-lg border p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{student.studentName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{student.overallScore}%</p>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === "homework" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Homework ({homeworkList.length})</h2>

            <div className="grid gap-4">
              {homeworkList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No homework in this grade</div>
              ) : (
                homeworkList.map((hw) => (
                  <div key={hw.id} className="bg-card rounded-lg border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{hw.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{hw.subject} - {hw.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          hw.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : hw.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {hw.status}
                      </span>
                    </div>
                    {hw.fileName && <p className="text-sm mb-2">📄 {hw.fileName}</p>}
                    {hw.marks && <p className="text-sm font-semibold text-primary mb-2">Marks: {hw.marks}</p>}
                    {hw.status !== "graded" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Grade
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Grade Homework</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Marks</Label>
                              <Input
                                type="number"
                                id={`marks-${hw.id}`}
                                placeholder="Enter marks"
                                defaultValue={hw.marks || ""}
                              />
                            </div>
                            <Button
                              onClick={() => {
                                const marks = parseInt((document.getElementById(`marks-${hw.id}`) as HTMLInputElement)?.value || "0");
                                updateHomeworkStatus(hw.id, "graded", marks);
                              }}
                            >
                              Submit Grade
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resources ({resources.length})</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Insert Content
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Resource for {activeGrade} Grade</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        placeholder="e.g., Introduction to Algebra"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select
                        value={newResource.type}
                        onChange={(e) => setNewResource({ ...newResource, type: e.target.value as "video" | "notes" })}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="video">Video</option>
                        <option value="notes">Notes</option>
                      </select>
                    </div>
                    <div>
                      <Label>{newResource.type === "video" ? "YouTube URL" : "Notes Content"}</Label>
                      {newResource.type === "video" ? (
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          value={newResource.content}
                          onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                        />
                      ) : (
                        <Textarea
                          placeholder="Enter notes..."
                          rows={4}
                          value={newResource.content}
                          onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                        />
                      )}
                    </div>
                    <Button onClick={handleUploadResource} className="w-full">
                      <Upload className="w-4 h-4 mr-2" /> Upload
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {resources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No resources uploaded for this grade yet</div>
              ) : (
                resources.map((res) => (
                  <div key={res.id} className="bg-card rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {res.type === "video" ? (
                            <span className="text-xl">🎥</span>
                          ) : (
                            <span className="text-xl">📝</span>
                          )}
                          <h3 className="font-semibold">{res.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{res.date}</p>
                        {res.type === "video" ? (
                          <div>
                            {isYoutubeUrl(res.content) ? (
                              <iframe
                                width="300"
                                height="150"
                                src={convertToEmbedUrl(res.content)}
                                title={res.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded"
                              ></iframe>
                            ) : (
                              <a href={res.content} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {res.content}
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="bg-muted rounded p-3 max-h-40 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{res.content}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
