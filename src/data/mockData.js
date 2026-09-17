// ─── STUDENT ────────────────────────────────────────────────────────────────
export const STUDENT_PROFILE = {
  id: 'STU-2024-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@apex.edu',
  phone: '+91 98765 43210',
  branch: 'Computer Science & Engineering',
  semester: 8,
  rollNo: 'CSE2021001',
  company: 'Zoho Corp',
  academicYear: 'AY 2024-25',
  notificationCount: 3,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJWs50yqA9fmxoiAas_G2fPF2JRt1URCexrc0mSoHGv2NCN31e-e9NqjnoOn6JB_KFLPx37XWsCtlqVrpJYE5yAANX0Wfzntmjv9ZRO42TdxPK7J51d2SqL5jhY26xziaEhZXGVL7oSQteLYo9h_hebARO305fImAobdStsyJ6WvQ0dXutU52qR2Thp2v5Xh1MRbNhDYkVlQs4vOskHAg7PwcVBlnv3NI5UYXr-ikjQYelxxdktDTl',
  skills: ['Go', 'Redis', 'Kubernetes', 'Prometheus', 'gRPC', 'PostgreSQL', 'React', 'Docker'],
  interests: ['Distributed Systems', 'Cloud Infrastructure', 'Open Source'],
  cgpa: 8.9,
  resumeUrl: null,
};

export const STUDENT_KPIS = [
  { id: 'applications', label: 'Active Applications', value: '5', icon: 'send', iconBg: 'bg-primary-fixed/60 text-primary', trend: '+2 this week', trendUp: true },
  { id: 'tasks', label: 'Upcoming Tasks', value: '3', icon: 'task_alt', iconBg: 'bg-secondary-fixed/50 text-secondary', trend: 'Due this week', trendUp: false },
  { id: 'attendance', label: 'Attendance', value: '92%', icon: 'event_available', iconBg: 'bg-tertiary-fixed/60 text-tertiary', trend: 'Above 75% threshold', trendUp: true },
  { id: 'reports', label: 'Pending Reports', value: '1', icon: 'description', iconBg: 'bg-error-container text-on-error-container', trend: 'Due Friday', trendUp: false },
];

// ─── INTERNSHIPS ─────────────────────────────────────────────────────────────
export const INTERNSHIPS_LIST = [
  { id: 'INT-001', title: 'Backend Engineer Intern', company: 'Zoho Corp', logo: null, location: 'Chennai', remote: false, duration: '6 months', stipend: 25000, skills: ['Go', 'Redis', 'gRPC'], aiMatch: 94, status: 'active', posted: '2024-10-01', deadline: '2024-11-30', description: 'Work on distributed cache systems and telemetry pipelines for Zoho infrastructure.' },
  { id: 'INT-002', title: 'SDE Intern - Cloud Platform', company: 'TCS', logo: null, location: 'Bengaluru', remote: true, duration: '3 months', stipend: 20000, skills: ['Java', 'Spring Boot', 'AWS'], aiMatch: 78, status: 'active', posted: '2024-10-05', deadline: '2024-11-25', description: 'Build cloud-native microservices on TCS BaNCS platform.' },
  { id: 'INT-003', title: 'Full Stack Developer Intern', company: 'Infosys', logo: null, location: 'Pune', remote: false, duration: '6 months', stipend: 18000, skills: ['React', 'Node.js', 'MongoDB'], aiMatch: 85, status: 'active', posted: '2024-10-10', deadline: '2024-12-01', description: 'Develop internal tooling for Infosys InfyTQ platform.' },
  { id: 'INT-004', title: 'DevOps Intern', company: 'Wipro', logo: null, location: 'Hyderabad', remote: true, duration: '4 months', stipend: 15000, skills: ['Docker', 'Kubernetes', 'Jenkins'], aiMatch: 88, status: 'active', posted: '2024-10-12', deadline: '2024-11-28', description: 'Automate CI/CD pipelines and manage Kubernetes clusters.' },
  { id: 'INT-005', title: 'Data Engineering Intern', company: 'Freshworks', logo: null, location: 'Chennai', remote: false, duration: '6 months', stipend: 22000, skills: ['Python', 'Spark', 'Kafka'], aiMatch: 71, status: 'active', posted: '2024-10-15', deadline: '2024-12-05', description: 'Build real-time data pipelines for Freshdesk analytics.' },
  { id: 'INT-006', title: 'ML Engineer Intern', company: 'Razorpay', logo: null, location: 'Bengaluru', remote: true, duration: '3 months', stipend: 30000, skills: ['Python', 'TensorFlow', 'SQL'], aiMatch: 65, status: 'active', posted: '2024-10-18', deadline: '2024-11-20', description: 'Build fraud detection models for payment processing.' },
];

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
export const APPLICATIONS_LIST = [
  { id: 'APP-001', internshipId: 'INT-001', title: 'Backend Engineer Intern', company: 'Zoho Corp', appliedAt: '2024-10-15', status: 'approved', stage: 'Offer Extended', aiMatch: 94 },
  { id: 'APP-002', internshipId: 'INT-002', title: 'SDE Intern - Cloud Platform', company: 'TCS', appliedAt: '2024-10-18', status: 'pending', stage: 'Under Review', aiMatch: 78 },
  { id: 'APP-003', internshipId: 'INT-003', title: 'Full Stack Developer Intern', company: 'Infosys', appliedAt: '2024-10-20', status: 'shortlisted', stage: 'Faculty Approved', aiMatch: 85 },
  { id: 'APP-004', internshipId: 'INT-004', title: 'DevOps Intern', company: 'Wipro', appliedAt: '2024-10-22', status: 'rejected', stage: 'Rejected', aiMatch: 88 },
  { id: 'APP-005', internshipId: 'INT-005', title: 'Data Engineering Intern', company: 'Freshworks', appliedAt: '2024-10-25', status: 'pending', stage: 'Applied', aiMatch: 71 },
];

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const ATTENDANCE_DATA = {
  month: 'November 2024',
  present: 18,
  absent: 2,
  leave: 1,
  total: 21,
  percent: 92,
  days: [
    { date: '2024-11-01', status: 'present' }, { date: '2024-11-04', status: 'present' },
    { date: '2024-11-05', status: 'present' }, { date: '2024-11-06', status: 'absent' },
    { date: '2024-11-07', status: 'present' }, { date: '2024-11-08', status: 'present' },
    { date: '2024-11-11', status: 'present' }, { date: '2024-11-12', status: 'leave' },
    { date: '2024-11-13', status: 'present' }, { date: '2024-11-14', status: 'present' },
    { date: '2024-11-15', status: 'present' }, { date: '2024-11-18', status: 'present' },
    { date: '2024-11-19', status: 'present' }, { date: '2024-11-20', status: 'absent' },
    { date: '2024-11-21', status: 'present' }, { date: '2024-11-22', status: 'present' },
  ],
};

// ─── TASKS ────────────────────────────────────────────────────────────────────
export const TASKS_LIST = [
  { id: 'TSK-001', title: 'Implement Redis connection pooling', description: 'Refactor the Redis client to use connection pooling for better performance.', priority: 'high', status: 'inprogress', dueDate: '2024-11-15', assignedBy: 'Rajesh Iyer', tags: ['Go', 'Redis'] },
  { id: 'TSK-002', title: 'Write unit tests for rate limiter', description: 'Achieve 90%+ test coverage for the token bucket rate limiter module.', priority: 'medium', status: 'todo', dueDate: '2024-11-18', assignedBy: 'Rajesh Iyer', tags: ['Go', 'Testing'] },
  { id: 'TSK-003', title: 'Document gRPC interceptor API', description: 'Write API documentation for the telemetry gRPC interceptors.', priority: 'low', status: 'todo', dueDate: '2024-11-20', assignedBy: 'Rajesh Iyer', tags: ['Documentation'] },
  { id: 'TSK-004', title: 'Set up Prometheus dashboards', description: 'Create Grafana dashboards for the new Prometheus exporters.', priority: 'high', status: 'completed', dueDate: '2024-11-08', assignedBy: 'Rajesh Iyer', tags: ['Prometheus', 'Grafana'] },
  { id: 'TSK-005', title: 'Code review for PR #41', description: 'Review and merge the distributed cache PR.', priority: 'medium', status: 'completed', dueDate: '2024-11-10', assignedBy: 'Rajesh Iyer', tags: ['Code Review'] },
];

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────
export const CERTIFICATE_DATA = {
  studentName: 'Aarav Sharma',
  company: 'Zoho Corporation',
  role: 'Backend Engineer Intern',
  duration: 'June 2024 – November 2024',
  grade: 'A+',
  credits: 14,
  cgpaEquivalent: 9.4,
  issueDate: '2024-11-30',
  certificateId: 'CERT-ZH-2024-001',
  verifyUrl: 'https://internsync.edu/verify/CERT-ZH-2024-001',
};

// ─── WEEKLY / FINAL REPORTS (re-export from constants for backward compat) ────
export { ACTIVE_DRAFT, EVALUATED_REPORTS, COMPETENCY_SKILLS, MENTORS_GOVERNANCE, KPI_METRICS as WEEKLY_KPI_METRICS } from '../constants/mockData.js';

// ─── FACULTY ──────────────────────────────────────────────────────────────────
export const FACULTY_KPIS = [
  { id: 'students', label: 'Total Students', value: '48', icon: 'groups', iconBg: 'bg-primary-fixed/60 text-primary', trend: '+4 this semester', trendUp: true },
  { id: 'active', label: 'Active Internships', value: '36', icon: 'work', iconBg: 'bg-tertiary-fixed/60 text-tertiary', trend: '75% placement rate', trendUp: true },
  { id: 'approvals', label: 'Pending Approvals', value: '7', icon: 'approval', iconBg: 'bg-secondary-fixed/50 text-secondary', trend: '3 urgent', trendUp: false },
  { id: 'risk', label: 'At-Risk Students', value: '3', icon: 'warning', iconBg: 'bg-error-container text-on-error-container', trend: 'Needs attention', trendUp: false },
];

export const STUDENTS_LIST = [
  { id: 'STU-001', name: 'Aarav Sharma', branch: 'CSE', semester: 8, company: 'Zoho Corp', role: 'Backend Intern', progress: 87, attendance: 92, risk: 'low', status: 'active', mentor: 'Rajesh Iyer', lastReport: '2024-11-08' },
  { id: 'STU-002', name: 'Priya Patel', branch: 'CSE', semester: 8, company: 'TCS', role: 'SDE Intern', progress: 72, attendance: 88, risk: 'low', status: 'active', mentor: 'Dr. Meenakshi Sundaram', lastReport: '2024-11-07' },
  { id: 'STU-003', name: 'Rohan Verma', branch: 'ECE', semester: 8, company: 'Infosys', role: 'Full Stack Intern', progress: 45, attendance: 65, risk: 'high', status: 'active', mentor: 'Dr. Meenakshi Sundaram', lastReport: '2024-10-25' },
  { id: 'STU-004', name: 'Sneha Reddy', branch: 'IT', semester: 8, company: 'Wipro', role: 'DevOps Intern', progress: 60, attendance: 78, risk: 'medium', status: 'active', mentor: 'Rajesh Iyer', lastReport: '2024-11-05' },
  { id: 'STU-005', name: 'Karan Mehta', branch: 'CSE', semester: 8, company: 'Freshworks', role: 'Data Intern', progress: 80, attendance: 95, risk: 'low', status: 'active', mentor: 'Dr. Meenakshi Sundaram', lastReport: '2024-11-08' },
  { id: 'STU-006', name: 'Ananya Singh', branch: 'Mech', semester: 8, company: null, role: null, progress: 0, attendance: 0, risk: 'high', status: 'pending', mentor: null, lastReport: null },
];

export const APPROVALS_LIST = [
  { id: 'APR-001', studentName: 'Priya Patel', studentId: 'STU-002', company: 'TCS', role: 'SDE Intern', type: 'Application Approval', submittedAt: '2024-11-10', status: 'pending', documents: ['Offer Letter', 'Company Profile'], urgency: 'high' },
  { id: 'APR-002', studentName: 'Rohan Verma', studentId: 'STU-003', company: 'Infosys', role: 'Full Stack Intern', type: 'Document Verification', submittedAt: '2024-11-09', status: 'pending', documents: ['NOC', 'Insurance'], urgency: 'medium' },
  { id: 'APR-003', studentName: 'Sneha Reddy', studentId: 'STU-004', company: 'Wipro', role: 'DevOps Intern', type: 'Final Report Review', submittedAt: '2024-11-08', status: 'review', documents: ['Final Report PDF'], urgency: 'low' },
  { id: 'APR-004', studentName: 'Karan Mehta', studentId: 'STU-005', company: 'Freshworks', role: 'Data Intern', type: 'Application Approval', submittedAt: '2024-11-07', status: 'approved', documents: ['Offer Letter'], urgency: 'low' },
];

export const RISK_CASES = [
  { id: 'RSK-001', studentName: 'Rohan Verma', studentId: 'STU-003', branch: 'ECE', company: 'Infosys', risk: 'high', factors: ['Attendance below 70%', 'No report for 2 weeks', 'Mentor flagged'], daysInactive: 14, lastActivity: '2024-10-25' },
  { id: 'RSK-002', studentName: 'Sneha Reddy', studentId: 'STU-004', branch: 'IT', company: 'Wipro', risk: 'medium', factors: ['Attendance 78%', 'Late report submission'], daysInactive: 6, lastActivity: '2024-11-05' },
  { id: 'RSK-003', studentName: 'Ananya Singh', studentId: 'STU-006', branch: 'Mech', company: null, risk: 'high', factors: ['No internship placed', 'Profile incomplete'], daysInactive: 30, lastActivity: '2024-10-12' },
];

// ─── COMPANY ──────────────────────────────────────────────────────────────────
export const COMPANY_KPIS = [
  { id: 'internships', label: 'Active Internships', value: '4', icon: 'work', iconBg: 'bg-primary-fixed/60 text-primary', trend: '+1 this month', trendUp: true },
  { id: 'applications', label: 'Applications Received', value: '28', icon: 'inbox', iconBg: 'bg-secondary-fixed/50 text-secondary', trend: '+12 this week', trendUp: true },
  { id: 'interns', label: 'Active Interns', value: '6', icon: 'badge', iconBg: 'bg-tertiary-fixed/60 text-tertiary', trend: 'All on track', trendUp: true },
  { id: 'reviews', label: 'Pending Reviews', value: '3', icon: 'rate_review', iconBg: 'bg-error-container text-on-error-container', trend: 'Due this week', trendUp: false },
];

export const COMPANY_PROFILE = {
  id: 'CMP-001', name: 'Zoho Corporation', logo: null, industry: 'Software / SaaS',
  website: 'https://zoho.com', location: 'Chennai, Tamil Nadu', employees: '15,000+',
  description: 'Zoho Corporation is an Indian multinational technology company that makes web-based business tools.',
  verified: true, contactName: 'Rajesh Iyer', contactEmail: 'rajesh.iyer@zoho.com',
};

export const COMPANY_INTERNSHIPS = [
  { id: 'INT-001', title: 'Backend Engineer Intern', applications: 12, active: 2, status: 'active', posted: '2024-10-01', deadline: '2024-11-30' },
  { id: 'INT-007', title: 'Frontend Engineer Intern', applications: 8, active: 1, status: 'active', posted: '2024-10-10', deadline: '2024-12-01' },
  { id: 'INT-008', title: 'QA Automation Intern', applications: 5, active: 1, status: 'active', posted: '2024-10-15', deadline: '2024-11-25' },
  { id: 'INT-009', title: 'Product Management Intern', applications: 3, active: 0, status: 'draft', posted: '2024-10-20', deadline: '2024-12-10' },
];

export const APPLICANTS_LIST = [
  { id: 'APP-101', name: 'Aarav Sharma', college: 'Apex University', branch: 'CSE', cgpa: 8.9, aiMatch: 94, status: 'approved', appliedFor: 'Backend Engineer Intern', appliedAt: '2024-10-15' },
  { id: 'APP-102', name: 'Priya Patel', college: 'NIT Trichy', branch: 'CSE', cgpa: 8.5, aiMatch: 82, status: 'shortlisted', appliedFor: 'Backend Engineer Intern', appliedAt: '2024-10-16' },
  { id: 'APP-103', name: 'Karan Mehta', college: 'BITS Pilani', branch: 'CS', cgpa: 9.1, aiMatch: 88, status: 'pending', appliedFor: 'Frontend Engineer Intern', appliedAt: '2024-10-17' },
  { id: 'APP-104', name: 'Sneha Reddy', college: 'VIT Vellore', branch: 'IT', cgpa: 7.8, aiMatch: 71, status: 'rejected', appliedFor: 'Backend Engineer Intern', appliedAt: '2024-10-18' },
];

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const ADMIN_KPIS = [
  { id: 'users', label: 'Total Users', value: '1,248', icon: 'people', iconBg: 'bg-primary-fixed/60 text-primary', trend: '+24 this month', trendUp: true },
  { id: 'internships', label: 'Active Internships', value: '186', icon: 'work', iconBg: 'bg-tertiary-fixed/60 text-tertiary', trend: '78% placement rate', trendUp: true },
  { id: 'companies', label: 'Verified Companies', value: '42', icon: 'verified_user', iconBg: 'bg-secondary-fixed/50 text-secondary', trend: '4 pending', trendUp: false },
  { id: 'health', label: 'System Health', value: '99.8%', icon: 'monitor_heart', iconBg: 'bg-tertiary-fixed/60 text-tertiary', trend: 'All services up', trendUp: true },
];

export const USERS_LIST = [
  { id: 'USR-001', name: 'Aarav Sharma', email: 'aarav@apex.edu', role: 'student', status: 'active', joined: '2024-08-01' },
  { id: 'USR-002', name: 'Dr. Meenakshi Sundaram', email: 'meenakshi@apex.edu', role: 'faculty', status: 'active', joined: '2023-06-01' },
  { id: 'USR-003', name: 'Rajesh Iyer', email: 'rajesh@zoho.com', role: 'company', status: 'active', joined: '2024-07-15' },
  { id: 'USR-004', name: 'Priya Patel', email: 'priya@apex.edu', role: 'student', status: 'active', joined: '2024-08-01' },
  { id: 'USR-005', name: 'Rohan Verma', email: 'rohan@apex.edu', role: 'student', status: 'active', joined: '2024-08-01' },
  { id: 'USR-006', name: 'Suresh Kumar', email: 'suresh@apex.edu', role: 'admin', status: 'active', joined: '2022-01-01' },
];

export const AUDIT_LOGS = [
  { id: 'LOG-001', timestamp: '2024-11-10 14:32:11', actor: 'Dr. Meenakshi Sundaram', action: 'APPROVED', entity: 'Application APP-004', ip: '192.168.1.10' },
  { id: 'LOG-002', timestamp: '2024-11-10 13:15:44', actor: 'Aarav Sharma', action: 'SUBMITTED', entity: 'Weekly Report WK7', ip: '10.0.0.45' },
  { id: 'LOG-003', timestamp: '2024-11-10 11:02:30', actor: 'Rajesh Iyer', action: 'EVALUATED', entity: 'Weekly Report WK7', ip: '203.0.113.5' },
  { id: 'LOG-004', timestamp: '2024-11-09 16:45:00', actor: 'Suresh Kumar', action: 'ROLE_CHANGED', entity: 'User USR-003 → company', ip: '192.168.1.1' },
  { id: 'LOG-005', timestamp: '2024-11-09 10:20:15', actor: 'Priya Patel', action: 'APPLIED', entity: 'Internship INT-002', ip: '10.0.0.52' },
];

export const DEPARTMENTS = [
  { id: 'DEP-001', name: 'Computer Science & Engineering', code: 'CSE', students: 180, faculty: 12 },
  { id: 'DEP-002', name: 'Electronics & Communication', code: 'ECE', students: 120, faculty: 10 },
  { id: 'DEP-003', name: 'Information Technology', code: 'IT', students: 90, faculty: 8 },
  { id: 'DEP-004', name: 'Mechanical Engineering', code: 'Mech', students: 100, faculty: 9 },
];

export const POLICIES = {
  minAttendance: 75,
  maxLateReports: 2,
  riskThresholdAttendance: 70,
  riskThresholdInactive: 7,
  aiAutomationLevel: 80,
  autoApproveThreshold: 90,
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS_LIST = [
  { id: 'NTF-001', type: 'approval', title: 'Application Approved', message: 'Your application to Zoho Corp has been approved by Dr. Meenakshi Sundaram.', time: '2024-11-10 10:00', read: false },
  { id: 'NTF-002', type: 'report', title: 'Weekly Report Due', message: 'Week 8 report is due by Friday 23:59 IST.', time: '2024-11-09 09:00', read: false },
  { id: 'NTF-003', type: 'task', title: 'New Task Assigned', message: 'Rajesh Iyer assigned you: Implement Redis connection pooling.', time: '2024-11-08 14:30', read: false },
  { id: 'NTF-004', type: 'evaluation', title: 'Report Evaluated', message: 'Week 7 report scored 9.6/10 by both mentors.', time: '2024-11-07 16:00', read: true },
  { id: 'NTF-005', type: 'system', title: 'Profile Incomplete', message: 'Upload your resume to improve AI match accuracy.', time: '2024-11-06 08:00', read: true },
];

export const MENTORS_LIST = [
  { id: 'MNT-001', name: 'Rajesh Iyer', org: 'Zoho Corporation', type: 'industry', initials: 'RI', avatarCls: 'bg-secondary text-on-secondary' },
  { id: 'MNT-002', name: 'Dr. Meenakshi Sundaram', org: 'Apex University', type: 'academic', initials: 'MS', avatarCls: 'bg-primary text-on-primary' },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const PLACEMENT_TREND = [
  { month: 'Jun', placements: 12 }, { month: 'Jul', placements: 18 },
  { month: 'Aug', placements: 24 }, { month: 'Sep', placements: 30 },
  { month: 'Oct', placements: 36 }, { month: 'Nov', placements: 42 },
];

export const ROLE_DISTRIBUTION = [
  { name: 'Students', value: 1100 }, { name: 'Faculty', value: 80 },
  { name: 'Companies', value: 42 }, { name: 'Admins', value: 8 },
];

export const ATTENDANCE_TREND = [
  { week: 'W1', percent: 88 }, { week: 'W2', percent: 90 },
  { week: 'W3', percent: 85 }, { week: 'W4', percent: 92 },
  { week: 'W5', percent: 94 }, { week: 'W6', percent: 91 },
  { week: 'W7', percent: 92 },
];
