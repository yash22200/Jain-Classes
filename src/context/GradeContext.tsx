import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

export type Grade = "8th" | "9th" | "10th";

export interface StudentScore {
  studentId: string;
  studentName: string;
  overallScore: number;
}

export interface GradeResource {
  id: string;
  title: string;
  type: "video" | "notes";
  content: string; // YouTube URL or notes text
  date: string;
  grade: Grade;
}

export interface StudentHomework {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  status: "pending" | "submitted" | "graded";
  fileName?: string;
  marks?: number;
  grade: Grade;
}

interface GradeContextType {
  students: StudentScore[];
  homework: StudentHomework[];
  resources: GradeResource[];
  addStudent: (name: string, grade: Grade) => void;
  updateStudentScore: (studentId: string, score: number) => void;
  addHomework: (homework: Omit<StudentHomework, "id">) => void;
  updateHomeworkStatus: (homeworkId: string, status: "pending" | "submitted" | "graded", marks?: number) => void;
  uploadResource: (resource: Omit<GradeResource, "id">) => void;
  getStudentsByGrade: (grade: Grade) => StudentScore[];
  getHomeworkByGrade: (grade: Grade) => StudentHomework[];
  getResourcesByGrade: (grade: Grade) => GradeResource[];
  getStudentResources: (studentId: string) => GradeResource[];
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

const STORAGE_KEY_STUDENTS = "grade_students";
const STORAGE_KEY_HOMEWORK = "grade_homework";
const STORAGE_KEY_RESOURCES = "grade_resources";

const MOCK_STUDENTS: StudentScore[] = [
  { studentId: "s8-001", studentName: "Aarav Kumar", overallScore: 85 },
  { studentId: "s8-002", studentName: "Diya Sharma", overallScore: 92 },
  { studentId: "s8-003", studentName: "Vikram Singh", overallScore: 78 },
  { studentId: "s9-001", studentName: "Neha Patel", overallScore: 88 },
  { studentId: "s9-002", studentName: "Arjun Reddy", overallScore: 95 },
  { studentId: "s9-003", studentName: "Priya Gupta", overallScore: 82 },
  { studentId: "s10-001", studentName: "Rohan Verma", overallScore: 90 },
  { studentId: "s10-002", studentName: "Kavya Nair", overallScore: 87 },
  { studentId: "s10-003", studentName: "Sameer Khan", overallScore: 91 },
];

const MOCK_HOMEWORK: StudentHomework[] = [
  {
    id: "hw8-001",
    studentId: "s8-001",
    studentName: "Aarav Kumar",
    subject: "Mathematics",
    date: "2024-02-28",
    status: "submitted",
    fileName: "math_hw.pdf",
    grade: "8th",
  },
  {
    id: "hw8-002",
    studentId: "s8-002",
    studentName: "Diya Sharma",
    subject: "English",
    date: "2024-02-27",
    status: "graded",
    fileName: "essay.docx",
    marks: 18,
    grade: "8th",
  },
  {
    id: "hw9-001",
    studentId: "s9-001",
    studentName: "Neha Patel",
    subject: "Science",
    date: "2024-02-28",
    status: "pending",
    grade: "9th",
  },
  {
    id: "hw10-001",
    studentId: "s10-001",
    studentName: "Rohan Verma",
    subject: "History",
    date: "2024-02-26",
    status: "graded",
    fileName: "project.zip",
    marks: 45,
    grade: "10th",
  },
];

const MOCK_RESOURCES: GradeResource[] = [
  {
    id: "res8-001",
    title: "Algebra Basics",
    type: "video",
    content: "https://www.youtube.com/embed/placeholder1",
    date: "2024-02-20",
    grade: "8th",
  },
  {
    id: "res8-002",
    title: "Chapter 5 Notes",
    type: "notes",
    content: "Introduction to Algebra. Key concepts: variables, equations, solving for x...",
    date: "2024-02-19",
    grade: "8th",
  },
  {
    id: "res9-001",
    title: "Quadratic Equations",
    type: "video",
    content: "https://www.youtube.com/embed/placeholder2",
    date: "2024-02-21",
    grade: "9th",
  },
  {
    id: "res10-001",
    title: "Calculus Introduction",
    type: "video",
    content: "https://www.youtube.com/embed/placeholder3",
    date: "2024-02-22",
    grade: "10th",
  },
];

export const GradeProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<StudentScore[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return stored ? JSON.parse(stored) : MOCK_STUDENTS;
  });

  const [homework, setHomework] = useState<StudentHomework[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_HOMEWORK);
    return stored ? JSON.parse(stored) : MOCK_HOMEWORK;
  });

  const [resources, setResources] = useState<GradeResource[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RESOURCES);
    return stored ? JSON.parse(stored) : MOCK_RESOURCES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HOMEWORK, JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
  }, [resources]);

  const addStudent = (name: string, grade: Grade) => {
    const newStudent: StudentScore = {
      studentId: `s${grade === "8th" ? "8" : grade === "9th" ? "9" : "10"}-${Date.now()}`,
      studentName: name,
      overallScore: 0,
    };
    setStudents([...students, newStudent]);
  };

  const updateStudentScore = (studentId: string, score: number) => {
    setStudents(
      students.map((s) => (s.studentId === studentId ? { ...s, overallScore: score } : s))
    );
  };

  const addHomework = (hw: Omit<StudentHomework, "id">) => {
    const newHw: StudentHomework = {
      ...hw,
      id: `hw-${Date.now()}`,
    };
    setHomework([...homework, newHw]);
  };

  const updateHomeworkStatus = (
    homeworkId: string,
    status: "pending" | "submitted" | "graded",
    marks?: number
  ) => {
    setHomework(
      homework.map((h) =>
        h.id === homeworkId ? { ...h, status, marks } : h
      )
    );
  };

  const uploadResource = (res: Omit<GradeResource, "id">) => {
    const newRes: GradeResource = {
      ...res,
      id: `res-${Date.now()}`,
    };
    setResources([...resources, newRes]);
  };

  const getStudentsByGrade = (grade: Grade) => {
    // Mock: filter based on student ID prefix
    return students.filter((s) => s.studentId.startsWith(`s${grade === "8th" ? "8" : grade === "9th" ? "9" : "10"}`));
  };

  const getHomeworkByGrade = (grade: Grade) => {
    return homework.filter((h) => h.grade === grade);
  };

  const getResourcesByGrade = (grade: Grade) => {
    return resources.filter((r) => r.grade === grade);
  };

  const getStudentResources = (studentId: string) => {
    // Get all resources for the student's grade
    const student = students.find((s) => s.studentId === studentId);
    if (!student) return [];
    
    // Infer grade from student ID
    const prefix = studentId.slice(1, 2); // "8", "9", or "10"
    const gradeMap: { [key: string]: Grade } = { "8": "8th", "9": "9th", "10": "10th" };
    const grade = gradeMap[prefix];
    
    return resources.filter((r) => r.grade === grade);
  };

  return (
    <GradeContext.Provider
      value={{
        students,
        homework,
        resources,
        addStudent,
        updateStudentScore,
        addHomework,
        updateHomeworkStatus,
        uploadResource,
        getStudentsByGrade,
        getHomeworkByGrade,
        getResourcesByGrade,
        getStudentResources,
      }}
    >
      {children}
    </GradeContext.Provider>
  );
};

export const useGrades = (): GradeContextType => {
  const ctx = useContext(GradeContext);
  if (!ctx) {
    throw new Error("useGrades must be used within GradeProvider");
  }
  return ctx;
};
