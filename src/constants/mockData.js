export const STUDENT_PROFILE = {
  id: 'STU-2024-001',
  name: 'Aarav Sharma',
  company: 'Zoho Corp',
  academicYear: 'AY 2024-25',
  notificationCount: 3,
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJWs50yqA9fmxoiAas_G2fPF2JRt1URCexrc0mSoHGv2NCN31e-e9NqjnoOn6JB_KFLPx37XWsCtlqVrpJYE5yAANX0Wfzntmjv9ZRO42TdxPK7J51d2SqL5jhY26xziaEhZXGVL7oSQteLYo9h_hebARO305fImAobdStsyJ6WvQ0dXutU52qR2Thp2v5Xh1MRbNhDYkVlQs4vOskHAg7PwcVBlnv3NI5UYXr-ikjQYelxxdktDTl',
};

export const NAV_ITEMS = [
  { path: 'overview-dashboard', icon: 'dashboard', label: 'Overview' },
  { path: 'profile-skills-ocr', icon: 'badge', label: 'Profile & Skills', badge: { text: 'OCR', cls: 'bg-secondary-fixed text-on-secondary-fixed' } },
  { path: 'discover-internships', icon: 'auto_awesome', label: 'Discover Roles', badge: { text: 'AI Match', cls: 'bg-primary-fixed text-on-primary-fixed' } },
  { path: 'applications-tracking', icon: 'send', label: 'Applications', count: '5' },
  { path: 'my-internship', icon: 'event_available', label: 'My Internship', dot: true },
  { path: 'weekly-final-reports', icon: 'description', label: 'Work Reports' },
  { path: 'certificate-academic-credits', icon: 'verified', label: 'Credits & Certificate' },
];

export const KPI_METRICS = [
  {
    id: 'score',
    label: 'Cumulative Weekly Score',
    icon: 'grade',
    iconBg: 'bg-primary-fixed/60 text-primary',
    value: '9.4',
    unit: '/ 10',
    badge: { text: 'Top 5% Cohort', cls: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    footer: { left: 'Evaluated Submissions', right: '7 of 7 Scored' },
  },
  {
    id: 'cadence',
    label: 'Report Filing Cadence',
    icon: 'calendar_month',
    iconBg: 'bg-secondary-fixed/50 text-secondary',
    value: '7 Filed',
    unit: '/ 8 Total',
    dueBadge: 'Week 8 Due in 2 Days',
    dueTime: 'Fri 23:59 IST',
  },
  {
    id: 'ai',
    label: 'AI Code & Report Synthesis',
    icon: 'auto_awesome',
    iconBg: 'bg-primary-fixed/40 text-primary',
    value: '98.2%',
    unit: 'Authenticity',
    footerLeft: 'Verified GPG Signatures',
    footerRight: '0% Hallucination',
  },
  {
    id: 'credits',
    label: 'AICTE Credit Accrual',
    icon: 'school',
    iconBg: 'bg-tertiary-fixed/60 text-tertiary',
    earned: 14,
    total: 16,
    percent: 87.5,
    mapped: 'CS801 Semester 8 Capstone',
  },
];

export const ACTIVE_DRAFT = {
  weekNumber: 8,
  title: 'Distributed Cache & Telemetry Integration',
  lastSaved: '12 mins ago',
  deadline: 'Friday, Nov 15 at 18:00 IST',
  estimatedReview: '48h',
  wordCount: 248,
  content: 'Refactored Redis cluster client connection pooling in Go, integrated Prometheus exporters with custom latency histograms, and drafted gRPC interceptor benchmarks for zoho-infra telemetry pipeline. Overcame memory contention on concurrent ring buffers by introducing atomic primitives and sync.Pool.',
  git: {
    repo: 'zoho-infra/distributed-cache',
    commits: 14,
    prs: 'PR #41 & #44',
    prDetail: '1 Merged • 1 In Review',
    additions: 840,
    deletions: 112,
    benchmarks: '3 Benchmarks Written',
  },
  aiAudit: {
    status: 'Pre-Submission Passed',
    authenticity: { score: '99%', detail: 'Zero code duplication against GitHub & Zoho internal codebases.' },
    depth: { grade: 'A+', detail: 'High semantic alignment with Zoho Cloud Engineering criteria.' },
    recommendation: "Consider attaching the Prometheus latency histograms for PR #44 to accelerate Rajesh Iyer's sign-off before Friday evening.",
  },
};

export const EVALUATED_REPORTS = [
  {
    id: 'WK7-ZH-2024',
    weekNumber: 7,
    title: 'API Rate Limiter v2 Token Bucket & Memory Profiling',
    submittedAt: 'Nov 08, 2024',
    endorsedIn: '18 hours',
    aicteLog: 'WK7-ZH-2024',
    grade: 9.6,
    abstract: 'Engineered a high-throughput distributed token bucket rate limiter module utilizing Go channels and atomic CAS primitives. Profiled memory consumption using go tool pprof, resolving GC pauses caused by transient slice allocations under simulated 50k RPS load.',
    synthesis: { commits: 12, testCoverage: 94.2, sha: 'a9f4c3...81e' },
    mentors: [
      { type: 'industry', initials: 'RI', name: 'Rajesh Iyer', role: 'Lead Architect, Zoho Corp', score: 4.9, feedback: "Outstanding engineering velocity. Aarav's implementation of the lock-free ring buffer reduced allocation overhead by 40%. Ready for staging cluster testing.", signedAt: 'Nov 09, 2024 at 10:14 IST', avatarCls: 'bg-secondary-fixed text-on-secondary-fixed' },
      { type: 'academic', initials: 'MS', name: 'Dr. Meenakshi Sundaram', role: 'HoD, Computer Science (Apex Univ)', score: 4.8, feedback: 'Curricular requirements for distributed algorithms fulfilled. Rigorous technical documentation adhering to AICTE guidelines.', signedAt: 'Nov 09, 2024 at 16:30 IST', avatarCls: 'bg-primary-fixed text-on-primary-fixed' },
    ],
    badges: ['Go Concurrency (+15%)', 'Memory Profiling (+10%)', 'Redis Architecture (+12%)'],
    expanded: true,
  },
  {
    id: 'WK6-ZH-2024',
    weekNumber: 6,
    title: 'Docker Swarm vs K8s Pod Spin-up Benchmarks',
    submittedAt: 'Nov 01',
    commits: 10,
    grade: 9.3,
    detail: 'Endorsed by Both Mentors',
  },
  {
    id: 'WK5-ZH-2024',
    weekNumber: 5,
    title: 'Jaeger Distributed Tracing Middleware Integration',
    submittedAt: 'Oct 25',
    commits: 8,
    grade: 9.5,
    detail: 'OpenTelemetry Span Propagation',
  },
];

export const COMPETENCY_SKILLS = [
  { label: 'Go / Microservices Architecture', percent: 92, barCls: 'bg-primary', note: 'Advanced • +12% from Week 1', noteCls: 'text-tertiary' },
  { label: 'Distributed Systems & Caching', percent: 90, barCls: 'bg-primary', note: 'Advanced • Cluster consensus verified', noteCls: 'text-tertiary' },
  { label: 'Cloud Observability & Telemetry', percent: 78, barCls: 'bg-secondary', note: '+18% this month (Accelerating)', noteCls: 'text-secondary font-semibold' },
  { label: 'Linux Kernel & Network Sockets', percent: 84, barCls: 'bg-primary', note: 'Proficient • Epoll & socket tuning', noteCls: 'text-on-surface-variant' },
];

export const MENTORS_GOVERNANCE = [
  { initials: 'RI', name: 'Rajesh Iyer', org: 'Zoho Corporation (Lead Mentor)', badge: 'Avg Resp: 4h', badgeCls: 'bg-tertiary-fixed text-on-tertiary-fixed', avatarCls: 'bg-secondary text-on-secondary' },
  { initials: 'MS', name: 'Dr. M. Sundaram', org: 'Apex Institute (Faculty Liaison)', badge: 'Next: Nov 18', badgeCls: 'bg-surface-container text-on-surface', avatarCls: 'bg-primary text-on-primary' },
];
