// lib/validations.ts
// Zod schemas for form validation

import { z } from "zod";

// ─── Auth ──────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "ADMIN"]).default("STUDENT"),
    rollNumber: z.string().optional(),
    branch: z.string().optional(),
    semester: z.coerce.number().min(1).max(8).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Notes ──────────────────────────────────────────────────────────────────

export const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().max(500).optional(),
  subject: z.string().min(1, "Subject is required"),
  semester: z.coerce.number().min(1).max(8),
  tags: z.string().optional(), // comma-separated
  fileUrl: z.string().url("Please provide a valid file URL"),
});

// ─── Assignment ──────────────────────────────────────────────────────────────

export const assignmentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  subject: z.string().min(1, "Subject is required"),
  semester: z.coerce.number().min(1).max(8),
  dueDate: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  totalMarks: z.coerce.number().min(1).max(1000),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const submissionSchema = z.object({
  assignmentId: z.string().min(1),
  fileUrl: z.string().url("Please upload your submission file"),
  remarks: z.string().max(500).optional(),
});

// ─── Quiz ──────────────────────────────────────────────────────────────────

export const questionSchema = z.object({
  questionText: z.string().min(5, "Question too short"),
  options: z.array(z.string().min(1)).length(4, "Exactly 4 options required"),
  correctAnswer: z.number().min(0).max(3),
  marks: z.coerce.number().min(1).default(1),
  explanation: z.string().optional(),
  order: z.number().default(0),
});

export const quizSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  subject: z.string().min(1),
  semester: z.coerce.number().min(1).max(8),
  duration: z.coerce.number().min(5, "Minimum 5 minutes").max(180),
  totalMarks: z.coerce.number().min(1),
  passingMarks: z.coerce.number().min(1),
  questions: z.array(questionSchema).min(1, "At least one question required"),
});

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number").optional().or(z.literal("")),
  address: z.string().max(200).optional(),
  branch: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Attendance ──────────────────────────────────────────────────────────────

export const attendanceSchema = z.object({
  studentId: z.string().min(1),
  subject: z.string().min(1),
  date: z.string(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  remarks: z.string().optional(),
});

// ─── Announcement ──────────────────────────────────────────────────────────

export const announcementSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  targetRole: z.enum(["STUDENT", "ADMIN"]).optional(),
  expiresAt: z.string().optional(),
});

// ─── Types ──────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type QuizInput = z.infer<typeof quizSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
