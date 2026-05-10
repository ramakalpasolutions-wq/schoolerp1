// prisma/seed.js
// ⚠️ CommonJS format - do NOT use import/export statements

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  log: ["error"],
  errorFormat: "pretty",
});

// ── Helpers ──────────────────────────────────────────────────────
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

function log(emoji, label, value) {
  console.log(`  ${emoji} ${label}: ${value}`);
}

// ════════════════════════════════════════════════════════════════
async function main() {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║       School ERP - Database Seeder           ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  const hashedPassword = await hashPassword("admin123");

  // ── STEP 1: Super Admin ──────────────────────────────────────
  console.log("📌 Step 1: Creating Super Admin...");
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@schoolerp.com" },
    update: { updatedAt: new Date() },
    create: {
      name: "Super Admin",
      email: "superadmin@schoolerp.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  log("✅", "Super Admin", superAdmin.email);

  // ── STEP 2: School ───────────────────────────────────────────
  console.log("\n📌 Step 2: Creating School...");
  let school = await prisma.school.findFirst({
    where: { email: "info@srividya.edu.in" },
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        name: "Sri Vidya High School",
        address: "Main Road, Rajyampet, Andhra Pradesh - 516115",
        phone: "9876543210",
        email: "info@srividya.edu.in",
        geoLatitude: 14.6929,
        geoLongitude: 79.1591,
        geoRadius: 200,
        isActive: true,
        subscription: {
          plan: "PREMIUM",
          expiry: new Date("2026-12-31"),
          isActive: true,
          maxStudents: 2000,
          features: [
            "attendance",
            "fees",
            "exams",
            "crm",
            "sms",
            "reports",
            "promotions",
            "geo_attendance",
          ],
        },
      },
    });
    log("✅", "School created", school.name);
  } else {
    log("⏭️ ", "School exists", school.name);
  }

  // ── STEP 3: School Users ─────────────────────────────────────
  console.log("\n📌 Step 3: Creating School Users...");

  const usersToCreate = [
    { name: "School Admin", email: "admin@srividya.edu.in", role: "SCHOOL_ADMIN" },
    { name: "Venkat Rao", email: "accountant@srividya.edu.in", role: "ACCOUNTANT" },
    { name: "Suresh Kumar", email: "teacher@srividya.edu.in", role: "TEACHER" },
    { name: "Aarav Sharma", email: "student@srividya.edu.in", role: "STUDENT" },
    { name: "Rajesh Sharma", email: "parent@srividya.edu.in", role: "PARENT" },
  ];

  const createdUsers = {};

  for (const userData of usersToCreate) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { updatedAt: new Date() },
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        schoolId: school.id,
        isActive: true,
      },
    });
    createdUsers[userData.role] = user;
    log("✅", userData.role, userData.email);
  }

  // ── STEP 4: Academic Year ────────────────────────────────────
  console.log("\n📌 Step 4: Creating Academic Year...");
  let academicYear = await prisma.academicYear.findFirst({
    where: { schoolId: school.id, name: "2024-2025" },
  });

  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
      data: {
        name: "2024-2025",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-04-30"),
        isActive: true,
        schoolId: school.id,
      },
    });
    log("✅", "Academic Year", academicYear.name);
  } else {
    log("⏭️ ", "Academic Year exists", academicYear.name);
  }

  // ── STEP 5: Teacher Record ───────────────────────────────────
  console.log("\n📌 Step 5: Creating Teacher Records...");
  let teacher = await prisma.teacher.findFirst({
    where: { employeeId: "EMP001", schoolId: school.id },
  });

  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: {
        employeeId: "EMP001",
        name: "Suresh Kumar",
        email: "teacher@srividya.edu.in",
        phone: "9876543215",
        qualification: "M.Sc Mathematics, B.Ed",
        joiningDate: new Date("2020-06-15"),
        salary: 35000,
        schoolId: school.id,
        subjectIds: [],
        isActive: true,
      },
    });
    log("✅", "Teacher", "Suresh Kumar (EMP001)");
  } else {
    log("⏭️ ", "Teacher exists", teacher.employeeId);
  }

  // Additional teachers
  const additionalTeachers = [
    { employeeId: "EMP002", name: "Radha Devi", qualification: "M.Sc Chemistry, B.Ed", salary: 28000, phone: "9876543216" },
    { employeeId: "EMP003", name: "Priya Sharma", qualification: "MA English, B.Ed", salary: 30000, phone: "9876543217" },
    { employeeId: "EMP004", name: "Ravi Nair", qualification: "MA History, B.Ed", salary: 26000, phone: "9876543218" },
    { employeeId: "EMP005", name: "Lakshmi Rao", qualification: "MA Telugu, B.Ed", salary: 38000, phone: "9876543219" },
  ];

  for (const t of additionalTeachers) {
    const exists = await prisma.teacher.findFirst({
      where: { employeeId: t.employeeId, schoolId: school.id },
    });
    if (!exists) {
      await prisma.teacher.create({
        data: {
          ...t,
          email: `${t.name.toLowerCase().replace(" ", ".")}@srividya.edu.in`,
          joiningDate: new Date("2021-06-01"),
          schoolId: school.id,
          subjectIds: [],
          isActive: true,
        },
      });
    }
  }
  log("✅", "Additional teachers", `${additionalTeachers.length} created`);

  // ── STEP 6: Classes ──────────────────────────────────────────
  console.log("\n📌 Step 6: Creating Classes...");

  const classConfigs = [
    { name: "6", section: "A" },
    { name: "6", section: "B" },
    { name: "7", section: "A" },
    { name: "7", section: "B" },
    { name: "8", section: "A" },
    { name: "8", section: "B" },
    { name: "9", section: "A" },
    { name: "9", section: "B" },
    { name: "10", section: "A" },
    { name: "10", section: "B" },
  ];

  const classMap = {};

  for (const cfg of classConfigs) {
    let cls = await prisma.class.findFirst({
      where: {
        name: cfg.name,
        section: cfg.section,
        schoolId: school.id,
        academicYearId: academicYear.id,
      },
    });

    if (!cls) {
      cls = await prisma.class.create({
        data: {
          name: cfg.name,
          section: cfg.section,
          schoolId: school.id,
          academicYearId: academicYear.id,
          classTeacherId:
            cfg.name === "10" && cfg.section === "A" ? teacher.id : null,
        },
      });
    }

    classMap[`${cfg.name}-${cfg.section}`] = cls;
  }
  log("✅", "Classes", `${classConfigs.length} classes ready`);

  const class10A = classMap["10-A"];
  const class10B = classMap["10-B"];
  const class9A = classMap["9-A"];

  // ── STEP 7: Subjects ─────────────────────────────────────────
  console.log("\n📌 Step 7: Creating Subjects...");

  const subjectConfigs = [
    { name: "Mathematics", code: "MATH10A", classKey: "10-A" },
    { name: "Science", code: "SCI10A", classKey: "10-A" },
    { name: "English", code: "ENG10A", classKey: "10-A" },
    { name: "Social Studies", code: "SOC10A", classKey: "10-A" },
    { name: "Telugu", code: "TEL10A", classKey: "10-A" },
    { name: "Mathematics", code: "MATH9A", classKey: "9-A" },
    { name: "Science", code: "SCI9A", classKey: "9-A" },
    { name: "English", code: "ENG9A", classKey: "9-A" },
  ];

  const subjectMap = {};

  for (const sub of subjectConfigs) {
    const cls = classMap[sub.classKey];
    if (!cls) continue;

    let subject = await prisma.subject.findFirst({
      where: { code: sub.code, schoolId: school.id },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: sub.name,
          code: sub.code,
          classId: cls.id,
          schoolId: school.id,
          teacherId:
            sub.name === "Mathematics" && sub.classKey === "10-A"
              ? teacher.id
              : null,
        },
      });
    }

    subjectMap[sub.code] = subject;
  }
  log("✅", "Subjects", `${subjectConfigs.length} subjects ready`);

  // ── STEP 8: Parent ───────────────────────────────────────────
  console.log("\n📌 Step 8: Creating Parent...");
  let parent = await prisma.parent.findFirst({
    where: { fatherPhone: "9876543212", schoolId: school.id },
  });

  if (!parent) {
    parent = await prisma.parent.create({
      data: {
        fatherName: "Rajesh Sharma",
        motherName: "Priya Sharma",
        fatherPhone: "9876543212",
        motherPhone: "9876543213",
        fatherEmail: "parent@srividya.edu.in",
        motherEmail: "priya.sharma@gmail.com",
        address: "H.No 14, Nehru Street, Rajyampet",
        city: "Rajyampet",
        state: "Andhra Pradesh",
        pincode: "516115",
        studentIds: [],
        schoolId: school.id,
      },
    });
    log("✅", "Parent", "Rajesh Sharma");
  } else {
    log("⏭️ ", "Parent exists", parent.fatherPhone);
  }

  // ── STEP 9: Students ─────────────────────────────────────────
  console.log("\n📌 Step 9: Creating Students...");

  const studentsData = [
    {
      admissionNo: "ADM/2024/0001",
      name: "Aarav Sharma",
      dob: new Date("2009-05-14"),
      gender: "Male",
      bloodGroup: "O+",
      classKey: "10-A",
      parentRef: parent,
    },
    {
      admissionNo: "ADM/2024/0002",
      name: "Priya Reddy",
      dob: new Date("2009-08-22"),
      gender: "Female",
      bloodGroup: "A+",
      classKey: "10-A",
      parentRef: null,
    },
    {
      admissionNo: "ADM/2024/0003",
      name: "Karthik Kumar",
      dob: new Date("2010-02-10"),
      gender: "Male",
      bloodGroup: "B+",
      classKey: "9-A",
      parentRef: null,
    },
    {
      admissionNo: "ADM/2024/0004",
      name: "Sneha Patel",
      dob: new Date("2010-11-30"),
      gender: "Female",
      bloodGroup: "AB+",
      classKey: "10-B",
      parentRef: null,
    },
    {
      admissionNo: "ADM/2024/0005",
      name: "Ravi Nair Jr",
      dob: new Date("2009-07-18"),
      gender: "Male",
      bloodGroup: "O-",
      classKey: "10-A",
      parentRef: null,
    },
  ];

  const createdStudents = {};

  for (const sd of studentsData) {
    const cls = classMap[sd.classKey];
    if (!cls) continue;

    let student = await prisma.student.findFirst({
      where: { admissionNo: sd.admissionNo },
    });

    if (!student) {
      student = await prisma.student.create({
        data: {
          admissionNo: sd.admissionNo,
          name: sd.name,
          dob: sd.dob,
          gender: sd.gender,
          bloodGroup: sd.bloodGroup,
          classId: cls.id,
          schoolId: school.id,
          academicYearId: academicYear.id,
          parentId: sd.parentRef ? sd.parentRef.id : null,
          status: "ACTIVE",
          isActive: true,
          address: "Rajyampet, Andhra Pradesh",
          city: "Rajyampet",
          state: "Andhra Pradesh",
          pincode: "516115",
          documents: [],
        },
      });

      // Update parent studentIds if parent exists
      if (sd.parentRef) {
        await prisma.parent.update({
          where: { id: sd.parentRef.id },
          data: { studentIds: { push: student.id } },
        });
      }
    }

    createdStudents[sd.admissionNo] = student;
  }
  log("✅", "Students", `${studentsData.length} students ready`);

  const mainStudent = createdStudents["ADM/2024/0001"];

  // ── STEP 10: Fee Records ─────────────────────────────────────
  console.log("\n📌 Step 10: Creating Fee Records...");

  const existingFee = await prisma.fee.findFirst({
    where: { studentId: mainStudent.id },
  });

  if (!existingFee) {
    const feeData = [
      // Paid fees
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "TUITION",
        amount: 12000,
        dueDate: new Date("2024-07-01"),
        paidDate: new Date("2024-06-28"),
        paidAmount: 12000,
        status: "PAID",
        receiptNo: "RCP/2024/0001",
        paymentMethod: "CASH",
        academicYearId: academicYear.id,
      },
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "TRANSPORT",
        amount: 2500,
        dueDate: new Date("2024-07-01"),
        paidDate: new Date("2024-06-28"),
        paidAmount: 2500,
        status: "PAID",
        receiptNo: "RCP/2024/0002",
        paymentMethod: "CASH",
        academicYearId: academicYear.id,
      },
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "TUITION",
        amount: 12000,
        dueDate: new Date("2024-10-01"),
        paidDate: new Date("2024-10-03"),
        paidAmount: 12000,
        status: "PAID",
        receiptNo: "RCP/2024/0003",
        paymentMethod: "UPI",
        academicYearId: academicYear.id,
      },
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "LAB",
        amount: 2500,
        dueDate: new Date("2024-10-01"),
        paidDate: new Date("2024-10-05"),
        paidAmount: 2500,
        status: "PAID",
        receiptNo: "RCP/2024/0004",
        paymentMethod: "CASH",
        academicYearId: academicYear.id,
      },
      // Pending fees
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "TUITION",
        amount: 12000,
        dueDate: new Date("2025-01-01"),
        paidAmount: 0,
        status: "OVERDUE",
        academicYearId: academicYear.id,
      },
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "TRANSPORT",
        amount: 2500,
        dueDate: new Date("2025-04-01"),
        paidAmount: 0,
        status: "PENDING",
        academicYearId: academicYear.id,
      },
      {
        studentId: mainStudent.id,
        schoolId: school.id,
        category: "LIBRARY",
        amount: 1000,
        dueDate: new Date("2025-04-01"),
        paidAmount: 0,
        status: "PENDING",
        academicYearId: academicYear.id,
      },
    ];

    await prisma.fee.createMany({ data: feeData });
    log("✅", "Fee records", `${feeData.length} records created`);
  } else {
    log("⏭️ ", "Fee records exist", "skipping");
  }

  // ── STEP 11: Attendance Records ──────────────────────────────
  console.log("\n📌 Step 11: Creating Attendance Records...");

  const existingAttendance = await prisma.attendance.findFirst({
    where: { studentId: mainStudent.id },
  });

  if (!existingAttendance) {
    const attendanceRecords = [];
    const startDate = new Date("2025-03-01");
    const markerUserId = createdUsers["TEACHER"].id;

    for (let i = 0; i < 18; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const isAbsent = i === 2 || i === 9 || i === 14;
      const isLate = i === 4;

      attendanceRecords.push({
        studentId: mainStudent.id,
        classId: class10A.id,
        date: new Date(d.setHours(0, 0, 0, 0)),
        status: isAbsent ? "ABSENT" : isLate ? "LATE" : "PRESENT",
        markedBy: markerUserId,
        markedAt: new Date(d.setHours(9, 5, 0, 0)),
        smsSent: isAbsent,
        schoolId: school.id,
        academicYearId: academicYear.id,
      });
    }

    if (attendanceRecords.length > 0) {
      await prisma.attendance.createMany({ data: attendanceRecords });
    }
    log("✅", "Attendance", `${attendanceRecords.length} days seeded`);
  } else {
    log("⏭️ ", "Attendance exists", "skipping");
  }

  // ── STEP 12: Exam ────────────────────────────────────────────
  console.log("\n📌 Step 12: Creating Exams...");

  const examsData = [
    {
      name: "Unit Test 1",
      type: "UNIT_TEST",
      startDate: new Date("2025-03-25"),
      endDate: new Date("2025-03-27"),
      status: "UPCOMING",
      description: "First unit test for Term 2",
    },
    {
      name: "Mid-Term Examination",
      type: "MID_TERM",
      startDate: new Date("2025-02-10"),
      endDate: new Date("2025-02-20"),
      status: "COMPLETED",
      description: "Mid-term examination for all classes",
    },
    {
      name: "Annual Examination",
      type: "ANNUAL",
      startDate: new Date("2025-04-25"),
      endDate: new Date("2025-05-10"),
      status: "UPCOMING",
      description: "Final annual examination",
    },
  ];

  const createdExams = {};

  for (const examData of examsData) {
    let exam = await prisma.exam.findFirst({
      where: { name: examData.name, schoolId: school.id },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          ...examData,
          classIds: [class10A.id, class10B.id, class9A.id],
          schoolId: school.id,
          academicYearId: academicYear.id,
        },
      });
    }

    createdExams[examData.name] = exam;
  }
  log("✅", "Exams", `${examsData.length} exams ready`);

  // ── STEP 13: Exam Results ────────────────────────────────────
  console.log("\n📌 Step 13: Creating Exam Results...");

  const completedExam = createdExams["Mid-Term Examination"];
  const mathSubject = subjectMap["MATH10A"];

  if (completedExam && mathSubject) {
    const existingResult = await prisma.examResult.findFirst({
      where: {
        examId: completedExam.id,
        studentId: mainStudent.id,
      },
    });

    if (!existingResult) {
      const resultSubjects = [
        { code: "MATH10A", marks: 78, maxMarks: 100 },
        { code: "SCI10A", marks: 82, maxMarks: 100 },
        { code: "ENG10A", marks: 85, maxMarks: 100 },
        { code: "SOC10A", marks: 70, maxMarks: 100 },
        { code: "TEL10A", marks: 75, maxMarks: 100 },
      ];

      for (const rs of resultSubjects) {
        const subject = subjectMap[rs.code];
        if (!subject) continue;

        const pct = (rs.marks / rs.maxMarks) * 100;
        const grade =
          pct >= 90 ? "A+" :
          pct >= 80 ? "A" :
          pct >= 70 ? "B+" :
          pct >= 60 ? "B" :
          pct >= 50 ? "C" :
          pct >= 35 ? "D" : "F";

        await prisma.examResult.create({
          data: {
            examId: completedExam.id,
            studentId: mainStudent.id,
            subjectId: subject.id,
            marks: rs.marks,
            maxMarks: rs.maxMarks,
            grade,
            percentage: parseFloat(pct.toFixed(2)),
            isPassed: pct >= 35,
            schoolId: school.id,
            academicYearId: academicYear.id,
          },
        });
      }
      log("✅", "Exam Results", `${resultSubjects.length} subject results`);
    } else {
      log("⏭️ ", "Exam Results exist", "skipping");
    }
  }

  // ── STEP 14: Homework ────────────────────────────────────────
  console.log("\n📌 Step 14: Creating Homework...");

  const existingHW = await prisma.homework.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingHW && mathSubject) {
    const hwList = [
      {
        title: "Quadratic Equations Exercise 4.3",
        description: "Complete exercises 1 to 15 from Chapter 4",
        subjectId: mathSubject.id,
        classId: class10A.id,
        teacherId: teacher.id,
        dueDate: new Date("2025-03-25"),
        files: [],
        schoolId: school.id,
      },
    ];

    for (const hw of hwList) {
      const created = await prisma.homework.create({ data: hw });

      // Add submission for main student
      await prisma.homeworkSubmission.create({
        data: {
          homeworkId: created.id,
          studentId: mainStudent.id,
          submittedAt: new Date("2025-03-24"),
          files: [],
          status: "SUBMITTED",
          schoolId: school.id,
        },
      });
    }
    log("✅", "Homework", `${hwList.length} assignments with submissions`);
  } else {
    log("⏭️ ", "Homework exists", "skipping");
  }

  // ── STEP 15: CRM Leads ───────────────────────────────────────
  console.log("\n📌 Step 15: Creating CRM Leads...");

  const existingLead = await prisma.admissionInquiry.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingLead) {
    const leads = [
      {
        parentName: "Ramesh Reddy",
        parentPhone: "9800000001",
        parentEmail: "ramesh.reddy@gmail.com",
        childName: "Arjun Reddy",
        childAge: 8,
        classInterested: "3",
        source: "GOOGLE",
        stage: "INTERESTED",
        assignedTo: createdUsers["SCHOOL_ADMIN"].id,
        followUpDate: new Date("2025-03-25"),
        notes: "Very interested, asked about science lab facilities.",
        priority: "HIGH",
        schoolId: school.id,
      },
      {
        parentName: "Suma Nair",
        parentPhone: "9800000002",
        childName: "Kavya Nair",
        childAge: 12,
        classInterested: "7",
        source: "WALKIN",
        stage: "NEW_LEAD",
        assignedTo: createdUsers["SCHOOL_ADMIN"].id,
        followUpDate: new Date("2025-03-26"),
        notes: "Walk-in inquiry. Interested in transport facility.",
        priority: "MEDIUM",
        schoolId: school.id,
      },
      {
        parentName: "Vikram Singh",
        parentPhone: "9800000003",
        childName: "Ananya Singh",
        childAge: 10,
        classInterested: "5",
        source: "FACEBOOK",
        stage: "COUNSELING",
        assignedTo: createdUsers["SCHOOL_ADMIN"].id,
        followUpDate: new Date("2025-03-22"),
        notes: "Counseling done. Documents pending.",
        priority: "HIGH",
        visitDate: new Date("2025-03-20"),
        schoolId: school.id,
      },
      {
        parentName: "Lakshmi Devi",
        parentPhone: "9800000004",
        childName: "Karthik L",
        childAge: 14,
        classInterested: "9",
        source: "REFERENCE",
        stage: "CONFIRMED",
        assignedTo: createdUsers["SCHOOL_ADMIN"].id,
        notes: "Admitted. Fee paid.",
        priority: "HIGH",
        convertedAt: new Date("2025-03-15"),
        schoolId: school.id,
      },
      {
        parentName: "Gopal Rao",
        parentPhone: "9800000005",
        childName: "Priya Rao",
        childAge: 6,
        classInterested: "1",
        source: "GOOGLE",
        stage: "NEW_LEAD",
        followUpDate: new Date("2025-03-28"),
        notes: "Inquired online. Called back pending.",
        priority: "LOW",
        schoolId: school.id,
      },
    ];

    await prisma.admissionInquiry.createMany({ data: leads });
    log("✅", "CRM Leads", `${leads.length} leads created`);
  } else {
    log("⏭️ ", "CRM Leads exist", "skipping");
  }

  // ── STEP 16: Timetable ───────────────────────────────────────
  console.log("\n📌 Step 16: Creating Timetable...");

  const existingTimetable = await prisma.timetable.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingTimetable && mathSubject) {
    const timetableEntries = [
      { day: "MON", startTime: "09:00", endTime: "09:45", subjectId: mathSubject.id },
      { day: "TUE", startTime: "10:45", endTime: "11:30", subjectId: mathSubject.id },
      { day: "WED", startTime: "09:45", endTime: "10:30", subjectId: mathSubject.id },
      { day: "THU", startTime: "11:30", endTime: "12:15", subjectId: mathSubject.id },
      { day: "FRI", startTime: "09:00", endTime: "09:45", subjectId: mathSubject.id },
    ];

    for (const entry of timetableEntries) {
      await prisma.timetable.create({
        data: {
          classId: class10A.id,
          subjectId: entry.subjectId,
          teacherId: teacher.id,
          day: entry.day,
          startTime: entry.startTime,
          endTime: entry.endTime,
          schoolId: school.id,
          academicYearId: academicYear.id,
        },
      });
    }
    log("✅", "Timetable", `${timetableEntries.length} periods for Class 10-A`);
  } else {
    log("⏭️ ", "Timetable exists", "skipping");
  }

  // ── STEP 17: Notification sample ────────────────────────────
  console.log("\n📌 Step 17: Creating Sample Notification...");

  const existingNotif = await prisma.notification.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingNotif) {
    await prisma.notification.create({
      data: {
        title: "Welcome to School ERP Portal",
        message:
          "Dear Parents and Students, welcome to Sri Vidya High School's digital management platform. You can track attendance, fees, results and more!",
        type: "GENERAL",
        recipientType: "ALL",
        recipientIds: [],
        channels: ["SMS", "EMAIL"],
        sentBy: createdUsers["SCHOOL_ADMIN"].id,
        schoolId: school.id,
        totalSent: 1248,
        totalFailed: 2,
      },
    });
    log("✅", "Notification", "Sample notification created");
  } else {
    log("⏭️ ", "Notification exists", "skipping");
  }

  // ── STEP 18: Salary Records ──────────────────────────────────
  console.log("\n📌 Step 18: Creating Salary Records...");

  const existingSalary = await prisma.salary.findFirst({
    where: { teacherId: teacher.id },
  });

  if (!existingSalary) {
    const salaryMonths = [
      { month: 1, year: 2025, status: "PAID", paidDate: new Date("2025-01-31") },
      { month: 2, year: 2025, status: "PAID", paidDate: new Date("2025-02-28") },
      { month: 3, year: 2025, status: "PENDING", paidDate: null },
    ];

    for (const sm of salaryMonths) {
      await prisma.salary.create({
        data: {
          teacherId: teacher.id,
          month: sm.month,
          year: sm.year,
          basicSalary: 30000,
          allowances: 5000,
          deductions: 0,
          netSalary: 35000,
          paidDate: sm.paidDate,
          status: sm.status,
          schoolId: school.id,
        },
      });
    }
    log("✅", "Salary", `${salaryMonths.length} months created`);
  } else {
    log("⏭️ ", "Salary exists", "skipping");
  }

  // ── STEP 19: Expense Records ─────────────────────────────────
  console.log("\n📌 Step 19: Creating Expense Records...");

  const existingExpense = await prisma.expense.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingExpense) {
    const expenses = [
      { title: "Electricity Bill - March", category: "UTILITIES", amount: 8500, date: new Date("2025-03-15") },
      { title: "Office Stationery", category: "SUPPLIES", amount: 2300, date: new Date("2025-03-14") },
      { title: "Plumbing Maintenance", category: "MAINTENANCE", amount: 5600, date: new Date("2025-03-12") },
      { title: "Water Bill", category: "UTILITIES", amount: 1800, date: new Date("2025-03-10") },
      { title: "Lab Chemicals", category: "SUPPLIES", amount: 12000, date: new Date("2025-03-08") },
      { title: "Classroom Furniture", category: "INFRASTRUCTURE", amount: 35000, date: new Date("2025-03-05") },
    ];

    for (const exp of expenses) {
      await prisma.expense.create({
        data: {
          ...exp,
          description: `${exp.title} for school campus`,
          schoolId: school.id,
          createdBy: createdUsers["SCHOOL_ADMIN"].id,
        },
      });
    }
    log("✅", "Expenses", `${expenses.length} records created`);
  } else {
    log("⏭️ ", "Expenses exist", "skipping");
  }

  // ── STEP 20: Teacher Attendance ──────────────────────────────
  console.log("\n📌 Step 20: Creating Teacher Attendance...");

  const existingTeacherAtt = await prisma.teacherAttendance.findFirst({
    where: { teacherId: teacher.id },
  });

  if (!existingTeacherAtt) {
    const taRecords = [];
    const taStart = new Date("2025-03-01");

    for (let i = 0; i < 15; i++) {
      const d = new Date(taStart);
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue;

      const checkIn = new Date(d);
      checkIn.setHours(9, i === 5 ? 25 : 5, 0, 0);
      const checkOut = new Date(d);
      checkOut.setHours(17, 0, 0, 0);

      taRecords.push({
        teacherId: teacher.id,
        date: new Date(d.setHours(0, 0, 0, 0)),
        checkIn,
        checkOut,
        checkInLat: 14.6929 + Math.random() * 0.001,
        checkInLong: 79.1591 + Math.random() * 0.001,
        status: i === 5 ? "LATE" : "PRESENT",
        workingHours: 7.92,
        isFakeGps: false,
        schoolId: school.id,
      });
    }

    if (taRecords.length > 0) {
      await prisma.teacherAttendance.createMany({ data: taRecords });
    }
    log("✅", "Teacher Attendance", `${taRecords.length} days seeded`);
  } else {
    log("⏭️ ", "Teacher Attendance exists", "skipping");
  }

  // ── STEP 21: Promotion Record ────────────────────────────────
  console.log("\n📌 Step 21: Creating Promotion Sample...");

  const existingPromotion = await prisma.promotion.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingPromotion) {
    // Create previous academic year first
    let prevYear = await prisma.academicYear.findFirst({
      where: { schoolId: school.id, name: "2023-2024" },
    });

    if (!prevYear) {
      prevYear = await prisma.academicYear.create({
        data: {
          name: "2023-2024",
          startDate: new Date("2023-06-01"),
          endDate: new Date("2024-04-30"),
          isActive: false,
          schoolId: school.id,
        },
      });
    }

    await prisma.promotion.create({
      data: {
        studentId: mainStudent.id,
        fromClass: "9",
        fromSection: "A",
        toClass: "10",
        toSection: "A",
        fromAcademicYear: prevYear.id,
        toAcademicYear: academicYear.id,
        status: "PROMOTED",
        reason: "Passed 9th grade with distinction",
        promotedBy: createdUsers["SCHOOL_ADMIN"].id,
        schoolId: school.id,
      },
    });
    log("✅", "Promotion", "Sample promotion record created");
  } else {
    log("⏭️ ", "Promotion exists", "skipping");
  }

  // ── FINAL SUMMARY ────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║                 🎉 SEED COMPLETE!                   ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  console.log("📧 LOGIN CREDENTIALS (password: admin123)\n");
  console.log("┌──────────────────┬─────────────────────────────────┐");
  console.log("│ Role             │ Email                           │");
  console.log("├──────────────────┼─────────────────────────────────┤");
  console.log("│ Super Admin      │ superadmin@schoolerp.com        │");
  console.log("│ School Admin     │ admin@srividya.edu.in           │");
  console.log("│ Teacher          │ teacher@srividya.edu.in         │");
  console.log("│ Student          │ student@srividya.edu.in         │");
  console.log("│ Parent           │ parent@srividya.edu.in          │");
  console.log("│ Accountant       │ accountant@srividya.edu.in      │");
  console.log("└──────────────────┴─────────────────────────────────┘\n");

  console.log("🚀 Run the app:   npm run dev");
  console.log("🔍 View data:     npx prisma studio\n");
}

// ── Run ──────────────────────────────────────────────────────────
main()
  .catch((e) => {
    console.error("\n❌ SEED FAILED!\n");
    console.error("Error:", e.message);
    console.error("\nFull error:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });