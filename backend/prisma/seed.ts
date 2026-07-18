import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // ==================== ROLES ====================
  const roles = await Promise.all([
    prisma.role.create({ data: { name: 'Admin' } }),
    prisma.role.create({ data: { name: 'Project Leader' } }),
    prisma.role.create({ data: { name: 'Member' } }),
  ]);
  console.log(`✅ Created ${roles.length} roles`);

  const [adminRole, leaderRole, memberRole] = roles;
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ==================== USERS (25) ====================
  const usersData = [
    { name: 'Super Admin', email: 'admin@taskflow.com', roleId: adminRole.id },
    { name: 'Admin Backup', email: 'admin2@taskflow.com', roleId: adminRole.id },
    { name: 'Andi Pratama', email: 'andi@taskflow.com', roleId: leaderRole.id },
    { name: 'Budi Santoso', email: 'budi@taskflow.com', roleId: leaderRole.id },
    { name: 'Citra Dewi', email: 'citra@taskflow.com', roleId: leaderRole.id },
    { name: 'Diana Putri', email: 'diana@taskflow.com', roleId: leaderRole.id },
    { name: 'Eko Wijaya', email: 'eko@taskflow.com', roleId: leaderRole.id },
    { name: 'Farhan Rizki', email: 'farhan@taskflow.com', roleId: memberRole.id },
    { name: 'Gita Nuraini', email: 'gita@taskflow.com', roleId: memberRole.id },
    { name: 'Hendra Susanto', email: 'hendra@taskflow.com', roleId: memberRole.id },
    { name: 'Indah Permata', email: 'indah@taskflow.com', roleId: memberRole.id },
    { name: 'Joko Widodo', email: 'joko@taskflow.com', roleId: memberRole.id },
    { name: 'Kartika Sari', email: 'kartika@taskflow.com', roleId: memberRole.id },
    { name: 'Lukman Hakim', email: 'lukman@taskflow.com', roleId: memberRole.id },
    { name: 'Maya Angelina', email: 'maya@taskflow.com', roleId: memberRole.id },
    { name: 'Naufal Aziz', email: 'naufal@taskflow.com', roleId: memberRole.id },
    { name: 'Olivia Ramadhani', email: 'olivia@taskflow.com', roleId: memberRole.id },
    { name: 'Putra Mahardika', email: 'putra@taskflow.com', roleId: memberRole.id },
    { name: 'Qori Aisyah', email: 'qori@taskflow.com', roleId: memberRole.id },
    { name: 'Rizky Firmansyah', email: 'rizky@taskflow.com', roleId: memberRole.id },
    { name: 'Sinta Maharani', email: 'sinta@taskflow.com', roleId: memberRole.id },
    { name: 'Taufik Hidayat', email: 'taufik@taskflow.com', roleId: memberRole.id },
    { name: 'Umar Faruq', email: 'umar@taskflow.com', roleId: memberRole.id },
    { name: 'Vina Panduwinata', email: 'vina@taskflow.com', roleId: memberRole.id },
    { name: 'Wahyu Kurniawan', email: 'wahyu@taskflow.com', roleId: memberRole.id },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        ...u,
        password: hashedPassword,
        isActive: true,
        profile: {
          create: {
            phoneNumber: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`.slice(0, 13),
            bio: `Hi, I'm ${u.name}. I love working on projects with TaskFlow!`,
          },
        },
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users with profiles`);

  // ==================== PROJECTS (22) ====================
  const projectsData = [
    { name: 'Website Redesign', description: 'Redesign company website with modern UI/UX', status: 'ONGOING' as const, leaderId: users[2].id, startDate: new Date('2025-01-15'), endDate: new Date('2025-06-30') },
    { name: 'Mobile App Development', description: 'Build cross-platform mobile application', status: 'ONGOING' as const, leaderId: users[3].id, startDate: new Date('2025-02-01'), endDate: new Date('2025-08-31') },
    { name: 'API Integration', description: 'Integrate third-party APIs for payment and shipping', status: 'PLANNING' as const, leaderId: users[4].id, startDate: new Date('2025-03-01'), endDate: new Date('2025-05-31') },
    { name: 'Database Migration', description: 'Migrate from MySQL to PostgreSQL', status: 'COMPLETED' as const, leaderId: users[5].id, startDate: new Date('2024-10-01'), endDate: new Date('2025-01-31') },
    { name: 'Cloud Infrastructure', description: 'Set up cloud infrastructure on AWS', status: 'ONGOING' as const, leaderId: users[6].id, startDate: new Date('2025-01-01'), endDate: new Date('2025-07-31') },
    { name: 'Marketing Campaign Q2', description: 'Plan and execute Q2 digital marketing', status: 'PLANNING' as const, leaderId: users[2].id, startDate: new Date('2025-04-01'), endDate: new Date('2025-06-30') },
    { name: 'User Research Phase 1', description: 'Conduct user interviews and surveys', status: 'COMPLETED' as const, leaderId: users[3].id, startDate: new Date('2024-11-01'), endDate: new Date('2025-02-28') },
    { name: 'Security Audit', description: 'Comprehensive security audit of all systems', status: 'ONGOING' as const, leaderId: users[4].id, startDate: new Date('2025-02-15'), endDate: new Date('2025-04-30') },
    { name: 'E-commerce Platform', description: 'Build full e-commerce solution', status: 'ONGOING' as const, leaderId: users[5].id, startDate: new Date('2025-01-10'), endDate: new Date('2025-09-30') },
    { name: 'Design System', description: 'Create reusable component library', status: 'PLANNING' as const, leaderId: users[6].id, startDate: new Date('2025-05-01'), endDate: new Date('2025-08-31') },
    { name: 'Data Analytics Dashboard', description: 'Build real-time analytics dashboard', status: 'ONGOING' as const, leaderId: users[2].id, startDate: new Date('2025-03-15'), endDate: new Date('2025-07-31') },
    { name: 'Customer Portal', description: 'Self-service customer portal', status: 'PLANNING' as const, leaderId: users[3].id, startDate: new Date('2025-06-01'), endDate: new Date('2025-11-30') },
    { name: 'Inventory Management', description: 'Automated inventory tracking system', status: 'ONGOING' as const, leaderId: users[4].id, startDate: new Date('2025-02-01'), endDate: new Date('2025-06-30') },
    { name: 'HR Portal', description: 'Employee self-service HR platform', status: 'COMPLETED' as const, leaderId: users[5].id, startDate: new Date('2024-08-01'), endDate: new Date('2025-01-15') },
    { name: 'Performance Optimization', description: 'Optimize app performance and loading times', status: 'ONGOING' as const, leaderId: users[6].id, startDate: new Date('2025-04-01'), endDate: new Date('2025-06-30') },
    { name: 'Chatbot Integration', description: 'Implement AI chatbot for customer support', status: 'PLANNING' as const, leaderId: users[2].id, startDate: new Date('2025-07-01'), endDate: new Date('2025-10-31') },
    { name: 'Payment Gateway', description: 'Multi-payment gateway integration', status: 'ONGOING' as const, leaderId: users[3].id, startDate: new Date('2025-03-01'), endDate: new Date('2025-06-30') },
    { name: 'Testing Automation', description: 'Set up automated testing pipeline', status: 'PLANNING' as const, leaderId: users[4].id, startDate: new Date('2025-05-15'), endDate: new Date('2025-08-31') },
    { name: 'Documentation Hub', description: 'Centralized documentation platform', status: 'COMPLETED' as const, leaderId: users[5].id, startDate: new Date('2024-09-01'), endDate: new Date('2024-12-31') },
    { name: 'Social Media Manager', description: 'Social media management tool', status: 'ONGOING' as const, leaderId: users[6].id, startDate: new Date('2025-02-15'), endDate: new Date('2025-07-31') },
    { name: 'CI/CD Pipeline', description: 'Continuous integration and deployment setup', status: 'ONGOING' as const, leaderId: users[2].id, startDate: new Date('2025-01-20'), endDate: new Date('2025-04-30') },
    { name: 'Email Marketing System', description: 'Automated email marketing platform', status: 'CANCELLED' as const, leaderId: users[3].id, startDate: new Date('2025-01-01'), endDate: new Date('2025-03-31') },
  ];

  const projects = [];
  for (const p of projectsData) {
    const project = await prisma.project.create({ data: p });
    projects.push(project);
  }
  console.log(`✅ Created ${projects.length} projects`);

  // ==================== PROJECT MEMBERS (35+) ====================
  const memberAssignments = [
    { projectId: projects[0].id, userIds: [users[7].id, users[8].id, users[9].id, users[10].id] },
    { projectId: projects[1].id, userIds: [users[11].id, users[12].id, users[13].id, users[14].id] },
    { projectId: projects[2].id, userIds: [users[15].id, users[16].id, users[7].id] },
    { projectId: projects[3].id, userIds: [users[17].id, users[18].id, users[8].id] },
    { projectId: projects[4].id, userIds: [users[19].id, users[20].id, users[9].id, users[10].id] },
    { projectId: projects[5].id, userIds: [users[21].id, users[22].id] },
    { projectId: projects[6].id, userIds: [users[23].id, users[24].id, users[11].id] },
    { projectId: projects[7].id, userIds: [users[12].id, users[13].id] },
    { projectId: projects[8].id, userIds: [users[14].id, users[15].id, users[16].id, users[7].id] },
    { projectId: projects[9].id, userIds: [users[17].id, users[18].id] },
    { projectId: projects[10].id, userIds: [users[19].id, users[20].id, users[21].id] },
  ];

  let memberCount = 0;
  for (const assignment of memberAssignments) {
    // Add leader as member first
    const project = projects.find(p => p.id === assignment.projectId);
    if (project) {
      try {
        await prisma.projectMember.create({
          data: { projectId: assignment.projectId, userId: project.leaderId },
        });
        memberCount++;
      } catch { /* already exists */ }
    }
    for (const userId of assignment.userIds) {
      try {
        await prisma.projectMember.create({
          data: { projectId: assignment.projectId, userId },
        });
        memberCount++;
      } catch { /* duplicate */ }
    }
  }
  console.log(`✅ Created ${memberCount} project members`);

  // ==================== TASKS (30) ====================
  const tasksData = [
    { projectId: projects[0].id, assigneeId: users[7].id, title: 'Design Homepage Mockup', description: 'Create wireframe and mockup for the new homepage', priority: 'HIGH' as const, status: 'DONE' as const, dueDate: new Date('2025-02-15') },
    { projectId: projects[0].id, assigneeId: users[8].id, title: 'Implement Header Component', description: 'Build responsive navigation header', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-03-01') },
    { projectId: projects[0].id, assigneeId: users[9].id, title: 'Footer Design', description: 'Design and implement footer section', priority: 'MEDIUM' as const, status: 'TODO' as const, dueDate: new Date('2025-03-15') },
    { projectId: projects[0].id, assigneeId: users[10].id, title: 'Contact Page', description: 'Build contact form with validation', priority: 'LOW' as const, status: 'TODO' as const, dueDate: new Date('2025-04-01') },
    { projectId: projects[1].id, assigneeId: users[11].id, title: 'Setup React Native Project', description: 'Initialize RN project with TypeScript', priority: 'URGENT' as const, status: 'DONE' as const, dueDate: new Date('2025-02-10') },
    { projectId: projects[1].id, assigneeId: users[12].id, title: 'User Authentication Screen', description: 'Build login and registration screens', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-03-15') },
    { projectId: projects[1].id, assigneeId: users[13].id, title: 'Dashboard Screen', description: 'Create main dashboard with charts', priority: 'HIGH' as const, status: 'REVIEW' as const, dueDate: new Date('2025-04-01') },
    { projectId: projects[1].id, assigneeId: users[14].id, title: 'Push Notifications', description: 'Implement push notification system', priority: 'MEDIUM' as const, status: 'TODO' as const, dueDate: new Date('2025-05-01') },
    { projectId: projects[2].id, assigneeId: users[15].id, title: 'Payment API Research', description: 'Research and compare payment gateway APIs', priority: 'HIGH' as const, status: 'DONE' as const, dueDate: new Date('2025-03-15') },
    { projectId: projects[2].id, assigneeId: users[16].id, title: 'Stripe Integration', description: 'Integrate Stripe payment processing', priority: 'URGENT' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-04-15') },
    { projectId: projects[4].id, assigneeId: users[19].id, title: 'AWS EC2 Setup', description: 'Configure EC2 instances for production', priority: 'URGENT' as const, status: 'DONE' as const, dueDate: new Date('2025-02-01') },
    { projectId: projects[4].id, assigneeId: users[20].id, title: 'S3 Bucket Configuration', description: 'Set up S3 buckets for file storage', priority: 'HIGH' as const, status: 'DONE' as const, dueDate: new Date('2025-02-15') },
    { projectId: projects[4].id, assigneeId: users[9].id, title: 'Load Balancer Setup', description: 'Configure ALB for traffic distribution', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-03-30') },
    { projectId: projects[4].id, assigneeId: users[10].id, title: 'CloudWatch Monitoring', description: 'Set up monitoring and alerting', priority: 'MEDIUM' as const, status: 'TODO' as const, dueDate: new Date('2025-04-30') },
    { projectId: projects[7].id, assigneeId: users[12].id, title: 'Vulnerability Scan', description: 'Run automated vulnerability scanning tools', priority: 'URGENT' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-03-01') },
    { projectId: projects[7].id, assigneeId: users[13].id, title: 'Penetration Testing', description: 'Conduct manual penetration testing', priority: 'HIGH' as const, status: 'TODO' as const, dueDate: new Date('2025-03-31') },
    { projectId: projects[8].id, assigneeId: users[14].id, title: 'Product Catalog', description: 'Build product listing and catalog pages', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-04-15') },
    { projectId: projects[8].id, assigneeId: users[15].id, title: 'Shopping Cart', description: 'Implement shopping cart functionality', priority: 'URGENT' as const, status: 'REVIEW' as const, dueDate: new Date('2025-05-01') },
    { projectId: projects[8].id, assigneeId: users[16].id, title: 'Order Management', description: 'Build order processing system', priority: 'HIGH' as const, status: 'TODO' as const, dueDate: new Date('2025-06-01') },
    { projectId: projects[8].id, assigneeId: users[7].id, title: 'Payment Processing', description: 'Integrate payment processing for checkout', priority: 'URGENT' as const, status: 'TODO' as const, dueDate: new Date('2025-06-15') },
    { projectId: projects[10].id, assigneeId: users[19].id, title: 'Data Pipeline Setup', description: 'Build ETL pipeline for analytics', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-04-30') },
    { projectId: projects[10].id, assigneeId: users[20].id, title: 'Chart Components', description: 'Build reusable chart components', priority: 'MEDIUM' as const, status: 'TODO' as const, dueDate: new Date('2025-05-15') },
    { projectId: projects[10].id, assigneeId: users[21].id, title: 'Real-time Data Feed', description: 'Implement WebSocket for real-time data', priority: 'HIGH' as const, status: 'TODO' as const, dueDate: new Date('2025-06-01') },
    { projectId: projects[12].id, assigneeId: users[15].id, title: 'Barcode Scanner Integration', description: 'Integrate barcode scanner for inventory', priority: 'HIGH' as const, status: 'REVIEW' as const, dueDate: new Date('2025-04-01') },
    { projectId: projects[12].id, assigneeId: users[16].id, title: 'Stock Alert System', description: 'Automated low stock alerts', priority: 'MEDIUM' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-04-30') },
    { projectId: projects[14].id, assigneeId: users[19].id, title: 'Lighthouse Audit', description: 'Run Lighthouse performance audit', priority: 'HIGH' as const, status: 'DONE' as const, dueDate: new Date('2025-04-15') },
    { projectId: projects[14].id, assigneeId: users[20].id, title: 'Image Optimization', description: 'Optimize images with WebP and lazy loading', priority: 'MEDIUM' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-05-01') },
    { projectId: projects[16].id, assigneeId: users[11].id, title: 'Midtrans Integration', description: 'Integrate Midtrans payment gateway', priority: 'URGENT' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-04-15') },
    { projectId: projects[16].id, assigneeId: users[12].id, title: 'Payment Webhook Handler', description: 'Handle payment notification callbacks', priority: 'HIGH' as const, status: 'TODO' as const, dueDate: new Date('2025-05-01') },
    { projectId: projects[19].id, assigneeId: users[17].id, title: 'Social Media API Integration', description: 'Connect to Twitter, Instagram, Facebook APIs', priority: 'HIGH' as const, status: 'IN_PROGRESS' as const, dueDate: new Date('2025-04-30') },
  ];

  const tasks = [];
  for (const t of tasksData) {
    const task = await prisma.task.create({ data: t });
    tasks.push(task);
  }
  console.log(`✅ Created ${tasks.length} tasks`);

  // ==================== COMMENTS (25) ====================
  const commentsData = [
    { taskId: tasks[0].id, userId: users[2].id, content: 'Great progress on the homepage design! Love the color scheme.' },
    { taskId: tasks[0].id, userId: users[7].id, content: 'Thanks! I used the brand guidelines for consistency.' },
    { taskId: tasks[1].id, userId: users[8].id, content: 'Working on the responsive breakpoints now. Should be done by EOD.' },
    { taskId: tasks[1].id, userId: users[2].id, content: 'Make sure to test on mobile Safari as well.' },
    { taskId: tasks[4].id, userId: users[3].id, content: 'Project initialized successfully with TypeScript template.' },
    { taskId: tasks[4].id, userId: users[11].id, content: 'Added ESLint and Prettier configs.' },
    { taskId: tasks[5].id, userId: users[12].id, content: 'Implementing biometric authentication support.' },
    { taskId: tasks[6].id, userId: users[3].id, content: 'The chart library needs to be replaced. Current one is too heavy.' },
    { taskId: tasks[6].id, userId: users[13].id, content: 'I suggest using Victory Native. Much lighter and supports animations.' },
    { taskId: tasks[8].id, userId: users[4].id, content: 'Stripe seems the best option for international payments.' },
    { taskId: tasks[9].id, userId: users[16].id, content: 'Testing webhook endpoints locally with ngrok.' },
    { taskId: tasks[10].id, userId: users[6].id, content: 'EC2 instances configured with auto-scaling.' },
    { taskId: tasks[11].id, userId: users[20].id, content: 'S3 lifecycle policies added for cost optimization.' },
    { taskId: tasks[14].id, userId: users[4].id, content: 'Critical vulnerabilities found in dependencies. Updating ASAP.' },
    { taskId: tasks[14].id, userId: users[12].id, content: 'Updated all packages. Running re-scan now.' },
    { taskId: tasks[16].id, userId: users[5].id, content: 'Product catalog should support filtering and search.' },
    { taskId: tasks[17].id, userId: users[15].id, content: 'Cart persists in localStorage. Should we use session storage instead?' },
    { taskId: tasks[17].id, userId: users[5].id, content: 'localStorage is fine. We want cart to persist between sessions.' },
    { taskId: tasks[20].id, userId: users[2].id, content: 'ETL pipeline running on schedule. Performance looks good.' },
    { taskId: tasks[23].id, userId: users[4].id, content: 'Barcode scanner works with USB and Bluetooth scanners.' },
    { taskId: tasks[25].id, userId: users[6].id, content: 'Lighthouse score improved from 45 to 92!' },
    { taskId: tasks[25].id, userId: users[19].id, content: 'Great improvement! What were the main optimizations?' },
    { taskId: tasks[26].id, userId: users[20].id, content: 'Using sharp for server-side image optimization.' },
    { taskId: tasks[27].id, userId: users[3].id, content: 'Midtrans sandbox testing is complete. Ready for production.' },
    { taskId: tasks[29].id, userId: users[6].id, content: 'Facebook API requires app review before production use.' },
  ];

  for (const c of commentsData) {
    await prisma.comment.create({ data: c });
  }
  console.log(`✅ Created ${commentsData.length} comments`);

  // ==================== ATTACHMENTS (22) ====================
  const attachmentsData = [
    { taskId: tasks[0].id, uploadedBy: users[7].id, fileName: 'homepage-mockup-v1.png', fileUrl: '/uploads/homepage-mockup-v1.png', fileType: 'image' },
    { taskId: tasks[0].id, uploadedBy: users[7].id, fileName: 'homepage-mockup-v2.png', fileUrl: '/uploads/homepage-mockup-v2.png', fileType: 'image' },
    { taskId: tasks[0].id, uploadedBy: users[2].id, fileName: 'brand-guidelines.pdf', fileUrl: '/uploads/brand-guidelines.pdf', fileType: 'pdf' },
    { taskId: tasks[1].id, uploadedBy: users[8].id, fileName: 'header-screenshot.png', fileUrl: '/uploads/header-screenshot.png', fileType: 'image' },
    { taskId: tasks[4].id, uploadedBy: users[11].id, fileName: 'project-structure.png', fileUrl: '/uploads/project-structure.png', fileType: 'image' },
    { taskId: tasks[5].id, uploadedBy: users[12].id, fileName: 'auth-flow-diagram.pdf', fileUrl: '/uploads/auth-flow-diagram.pdf', fileType: 'pdf' },
    { taskId: tasks[6].id, uploadedBy: users[13].id, fileName: 'dashboard-screenshot.png', fileUrl: '/uploads/dashboard-screenshot.png', fileType: 'image' },
    { taskId: tasks[8].id, uploadedBy: users[15].id, fileName: 'api-comparison.pdf', fileUrl: '/uploads/api-comparison.pdf', fileType: 'pdf' },
    { taskId: tasks[9].id, uploadedBy: users[16].id, fileName: 'stripe-test-results.png', fileUrl: '/uploads/stripe-test-results.png', fileType: 'image' },
    { taskId: tasks[10].id, uploadedBy: users[19].id, fileName: 'ec2-config.pdf', fileUrl: '/uploads/ec2-config.pdf', fileType: 'pdf' },
    { taskId: tasks[11].id, uploadedBy: users[20].id, fileName: 's3-architecture.png', fileUrl: '/uploads/s3-architecture.png', fileType: 'image' },
    { taskId: tasks[14].id, uploadedBy: users[12].id, fileName: 'vulnerability-report.pdf', fileUrl: '/uploads/vulnerability-report.pdf', fileType: 'pdf' },
    { taskId: tasks[16].id, uploadedBy: users[14].id, fileName: 'catalog-wireframe.png', fileUrl: '/uploads/catalog-wireframe.png', fileType: 'image' },
    { taskId: tasks[17].id, uploadedBy: users[15].id, fileName: 'cart-flow.png', fileUrl: '/uploads/cart-flow.png', fileType: 'image' },
    { taskId: tasks[20].id, uploadedBy: users[19].id, fileName: 'etl-pipeline-diagram.pdf', fileUrl: '/uploads/etl-pipeline-diagram.pdf', fileType: 'pdf' },
    { taskId: tasks[23].id, uploadedBy: users[15].id, fileName: 'barcode-test.png', fileUrl: '/uploads/barcode-test.png', fileType: 'image' },
    { taskId: tasks[25].id, uploadedBy: users[19].id, fileName: 'lighthouse-before.png', fileUrl: '/uploads/lighthouse-before.png', fileType: 'image' },
    { taskId: tasks[25].id, uploadedBy: users[19].id, fileName: 'lighthouse-after.png', fileUrl: '/uploads/lighthouse-after.png', fileType: 'image' },
    { taskId: tasks[26].id, uploadedBy: users[20].id, fileName: 'image-optimization-guide.pdf', fileUrl: '/uploads/image-optimization-guide.pdf', fileType: 'pdf' },
    { taskId: tasks[27].id, uploadedBy: users[11].id, fileName: 'midtrans-docs.pdf', fileUrl: '/uploads/midtrans-docs.pdf', fileType: 'pdf' },
    { taskId: tasks[29].id, uploadedBy: users[17].id, fileName: 'social-api-keys.pdf', fileUrl: '/uploads/social-api-keys.pdf', fileType: 'pdf' },
    { taskId: tasks[29].id, uploadedBy: users[6].id, fileName: 'fb-review-checklist.pdf', fileUrl: '/uploads/fb-review-checklist.pdf', fileType: 'pdf' },
  ];

  for (const a of attachmentsData) {
    await prisma.attachment.create({ data: a });
  }
  console.log(`✅ Created ${attachmentsData.length} attachments`);

  // ==================== NOTIFICATIONS (25) ====================
  const notificationsData = [
    { userId: users[7].id, title: 'Task Assigned', message: 'You have been assigned to "Design Homepage Mockup"', type: 'INFO' as const, isRead: true },
    { userId: users[8].id, title: 'Task Assigned', message: 'You have been assigned to "Implement Header Component"', type: 'INFO' as const, isRead: true },
    { userId: users[9].id, title: 'Task Assigned', message: 'You have been assigned to "Footer Design"', type: 'INFO' as const, isRead: false },
    { userId: users[10].id, title: 'Task Assigned', message: 'You have been assigned to "Contact Page"', type: 'INFO' as const, isRead: false },
    { userId: users[11].id, title: 'Task Assigned', message: 'You have been assigned to "Setup React Native Project"', type: 'INFO' as const, isRead: true },
    { userId: users[7].id, title: 'Comment on Task', message: 'Andi commented on "Design Homepage Mockup"', type: 'INFO' as const, isRead: true },
    { userId: users[12].id, title: 'New Comment', message: 'Budi left a comment on "User Authentication Screen"', type: 'INFO' as const, isRead: false },
    { userId: users[2].id, title: 'Task Completed', message: '"Design Homepage Mockup" has been marked as done', type: 'SUCCESS' as const, isRead: true },
    { userId: users[3].id, title: 'Task Completed', message: '"Setup React Native Project" has been completed', type: 'SUCCESS' as const, isRead: true },
    { userId: users[4].id, title: 'Warning', message: 'Critical vulnerabilities found in Security Audit project', type: 'WARNING' as const, isRead: false },
    { userId: users[15].id, title: 'Task Due Soon', message: '"Payment API Research" is due in 2 days', type: 'WARNING' as const, isRead: false },
    { userId: users[16].id, title: 'Task Due Soon', message: '"Stripe Integration" is due in 5 days', type: 'WARNING' as const, isRead: false },
    { userId: users[19].id, title: 'Added to Project', message: 'You have been added to "Cloud Infrastructure"', type: 'INFO' as const, isRead: true },
    { userId: users[20].id, title: 'Added to Project', message: 'You have been added to "Cloud Infrastructure"', type: 'INFO' as const, isRead: true },
    { userId: users[14].id, title: 'Task Assigned', message: 'You have been assigned to "Product Catalog"', type: 'INFO' as const, isRead: false },
    { userId: users[5].id, title: 'Project Completed', message: '"Database Migration" has been completed', type: 'SUCCESS' as const, isRead: true },
    { userId: users[6].id, title: 'Project Completed', message: '"Lighthouse Audit" improvements look great!', type: 'SUCCESS' as const, isRead: false },
    { userId: users[13].id, title: 'Review Requested', message: 'Please review "Dashboard Screen" task', type: 'INFO' as const, isRead: false },
    { userId: users[15].id, title: 'Review Requested', message: 'Please review "Shopping Cart" implementation', type: 'INFO' as const, isRead: false },
    { userId: users[2].id, title: 'New Member', message: 'Farhan joined "Website Redesign" project', type: 'INFO' as const, isRead: true },
    { userId: users[3].id, title: 'Error', message: 'Failed to deploy mobile app build #42', type: 'ERROR' as const, isRead: false },
    { userId: users[11].id, title: 'Task Updated', message: '"Midtrans Integration" priority changed to URGENT', type: 'WARNING' as const, isRead: false },
    { userId: users[17].id, title: 'Task Assigned', message: 'You have been assigned to "Social Media API Integration"', type: 'INFO' as const, isRead: false },
    { userId: users[0].id, title: 'System Alert', message: 'Database backup completed successfully', type: 'SUCCESS' as const, isRead: true },
    { userId: users[0].id, title: 'New Registration', message: 'New user "Wahyu Kurniawan" registered', type: 'INFO' as const, isRead: false },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({ data: n });
  }
  console.log(`✅ Created ${notificationsData.length} notifications`);

  // ==================== ACTIVITY LOGS (30) ====================
  const activityLogsData = [
    { userId: users[0].id, action: 'system_init', description: 'System initialized and configured' },
    { userId: users[2].id, projectId: projects[0].id, action: 'project_created', description: 'Created project "Website Redesign"' },
    { userId: users[3].id, projectId: projects[1].id, action: 'project_created', description: 'Created project "Mobile App Development"' },
    { userId: users[2].id, projectId: projects[0].id, action: 'member_added', description: 'Added Farhan to "Website Redesign"' },
    { userId: users[2].id, projectId: projects[0].id, action: 'task_created', description: 'Created task "Design Homepage Mockup"' },
    { userId: users[7].id, projectId: projects[0].id, action: 'task_status_changed', description: 'Changed "Design Homepage Mockup" from TODO to IN_PROGRESS' },
    { userId: users[7].id, projectId: projects[0].id, action: 'attachment_uploaded', description: 'Uploaded homepage-mockup-v1.png' },
    { userId: users[2].id, projectId: projects[0].id, action: 'comment_added', description: 'Commented on "Design Homepage Mockup"' },
    { userId: users[7].id, projectId: projects[0].id, action: 'task_status_changed', description: 'Changed "Design Homepage Mockup" from IN_PROGRESS to DONE' },
    { userId: users[3].id, projectId: projects[1].id, action: 'task_created', description: 'Created task "Setup React Native Project"' },
    { userId: users[11].id, projectId: projects[1].id, action: 'task_status_changed', description: 'Changed "Setup React Native" from TODO to DONE' },
    { userId: users[4].id, projectId: projects[2].id, action: 'project_created', description: 'Created project "API Integration"' },
    { userId: users[5].id, projectId: projects[3].id, action: 'project_updated', description: 'Changed "Database Migration" status to COMPLETED' },
    { userId: users[6].id, projectId: projects[4].id, action: 'project_created', description: 'Created project "Cloud Infrastructure"' },
    { userId: users[19].id, projectId: projects[4].id, action: 'task_status_changed', description: 'Changed "AWS EC2 Setup" to DONE' },
    { userId: users[20].id, projectId: projects[4].id, action: 'task_status_changed', description: 'Changed "S3 Bucket Config" to DONE' },
    { userId: users[4].id, projectId: projects[7].id, action: 'task_created', description: 'Created task "Vulnerability Scan"' },
    { userId: users[12].id, projectId: projects[7].id, action: 'task_status_changed', description: 'Started "Vulnerability Scan"' },
    { userId: users[5].id, projectId: projects[8].id, action: 'project_created', description: 'Created project "E-commerce Platform"' },
    { userId: users[14].id, projectId: projects[8].id, action: 'task_status_changed', description: 'Started "Product Catalog"' },
    { userId: users[2].id, projectId: projects[10].id, action: 'project_created', description: 'Created "Data Analytics Dashboard"' },
    { userId: users[19].id, projectId: projects[10].id, action: 'task_status_changed', description: 'Started "Data Pipeline Setup"' },
    { userId: users[6].id, projectId: projects[14].id, action: 'task_created', description: 'Created "Lighthouse Audit" task' },
    { userId: users[19].id, projectId: projects[14].id, action: 'task_status_changed', description: '"Lighthouse Audit" marked DONE' },
    { userId: users[3].id, projectId: projects[16].id, action: 'project_created', description: 'Created "Payment Gateway" project' },
    { userId: users[11].id, projectId: projects[16].id, action: 'task_status_changed', description: 'Started "Midtrans Integration"' },
    { userId: users[0].id, action: 'user_created', description: 'Admin created user "Wahyu Kurniawan"' },
    { userId: users[0].id, action: 'role_updated', description: 'Changed Eko role to Project Leader' },
    { userId: users[3].id, projectId: projects[21].id, action: 'project_updated', description: 'Cancelled "Email Marketing System"' },
    { userId: users[6].id, projectId: projects[19].id, action: 'project_created', description: 'Created "Social Media Manager"' },
  ];

  for (const log of activityLogsData) {
    await prisma.activityLog.create({ data: log });
  }
  console.log(`✅ Created ${activityLogsData.length} activity logs`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('📌 Default login credentials:');
  console.log('   Admin: admin@taskflow.com / password123');
  console.log('   Leader: andi@taskflow.com / password123');
  console.log('   Member: farhan@taskflow.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
