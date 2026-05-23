// app/dashboard/student/page.tsx

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PageHeader } from "@/components/ui/page-header";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Get student
  const student = await prisma.student.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!student) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student not found</h1>
      </div>
    );
  }

  // Fetch dashboard data
  const [assignmentsCount, notesCount, quizzesCount, attendanceCount] =
    await Promise.all([
      prisma.assignment.count(),

      prisma.note.count({
        where: {
          isPublished: true,
        },
      }),

      prisma.quiz.count(),

      prisma.attendance.count({
        where: {
          studentId: student.id,
          status: "PRESENT",
        },
      }),
    ]);

  // Stats data
  const stats: {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    color: "blue" | "green" | "orange" | "purple" | "red";
  }[] = [
    {
      label: "Assignments",
      value: assignmentsCount.toString(),
      change: "+2 this week",
      trend: "up",
      color: "blue",
    },
    {
      label: "Notes",
      value: notesCount.toString(),
      change: "Updated",
      trend: "neutral",
      color: "green",
    },
    {
      label: "Quizzes",
      value: quizzesCount.toString(),
      change: "+1 today",
      trend: "up",
      color: "purple",
    },
    {
      label: "Attendance",
      value: attendanceCount.toString(),
      change: "Good",
      trend: "up",
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Welcome, ${session.user.name}`}
        subtitle="Student Dashboard"
      />

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/40">
              <p className="font-medium">New assignment uploaded</p>

              <p className="text-sm text-muted-foreground">
                Check your assignments section
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40">
              <p className="font-medium">Quiz scheduled</p>

              <p className="text-sm text-muted-foreground">
                Upcoming quiz this week
              </p>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>

              <span>{session.user.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>

              <span>{session.user.email}</span>
            </div>

            {/* FIXED: replaced department with branch */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Branch</span>

              <span>{student.branch}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Semester</span>

              <span>{student.semester}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Roll Number</span>

              <span>{student.rollNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">CGPA</span>

              <span>{student.cgpa}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
