import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { addDays, subDays, format } from 'date-fns';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper to generate a random date within a range
function getRandomDate(start: Date, end: Date): Date {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
}

async function main() {
  console.log('Start seeding...');

  // 1. Clear existing data (optional, but good for fresh seeds)
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  console.log('Cleared existing data.');

  // 2. Create 10 Users
  const users = [];
  const salt = await bcrypt.genSalt(10);
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('password123', salt);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: getRandomDate(subDays(new Date(), 365), new Date()),
        password: hashedPassword, // For credentials provider
      },
    });
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }

  // Create an admin user
  const adminPassword = await bcrypt.hash('adminpassword', salt);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      emailVerified: new Date(),
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  users.push(adminUser);
  console.log(`Created admin user: ${adminUser.email}`);

  // 3. Create 50 Jobs
  const jobs = [];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
  for (let i = 0; i < 50; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const job = await prisma.job.create({
      data: {
        title: faker.person.jobTitle(),
        company: faker.company.name(),
        type: faker.helpers.arrayElement(jobTypes),
        description: faker.lorem.paragraphs(3),
        location: faker.location.city() + ', ' + faker.location.country(),
        salary: faker.number.int({ min: 50000, max: 150000 }),
        createdAt: getRandomDate(subDays(new Date(), 90), new Date()),
        postedById: randomUser.id,
      },
    });
    jobs.push(job);
    console.log(`Created job: ${job.title} by ${randomUser.name}`);
  }

  // 4. Create 50 Applications
  const applications = [];
  const appliedPairs = new Set<string>(); // To ensure unique user-job applications

  for (let i = 0; i < 50; i++) {
    let randomUser = faker.helpers.arrayElement(users);
    let randomJob = faker.helpers.arrayElement(jobs);
    let pairKey = `${randomUser.id}-${randomJob.id}`;

    // Ensure unique user-job application
    while (appliedPairs.has(pairKey)) {
      randomUser = faker.helpers.arrayElement(users);
      randomJob = faker.helpers.arrayElement(jobs);
      pairKey = `${randomUser.id}-${randomJob.id}`;
    }
    appliedPairs.add(pairKey);

    const application = await prisma.application.create({
      data: {
        jobId: randomJob.id,
        userId: randomUser.id,
        title: faker.helpers.arrayElement(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']),
        firstName: randomUser.name?.split(' ')[0] || faker.person.firstName(),
        lastName: randomUser.name?.split(' ')[1] || faker.person.lastName(),
        levelOfEducation: faker.helpers.arrayElement(['High School', 'Bachelors', 'Masters', 'PhD']),
        phoneNumber: faker.phone.number(),
        residenceAddress: faker.location.streetAddress(),
        coverLetter: faker.lorem.paragraphs(4),
        documents: [
          {
            name: faker.system.commonFileName('pdf'),
            url: faker.internet.url(),
          },
        ],
      },
    });
    applications.push(application);
    console.log(`Created application for job: ${randomJob.title} by user: ${randomUser.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });