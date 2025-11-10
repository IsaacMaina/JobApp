// prisma/seed.ts
import "dotenv/config"; // Load environment variables first
import { PrismaClient } from "../app/generated/prisma/client"; // Adjust path if needed
const prisma = new PrismaClient();
// Helper function to generate a random date within the last 3 years
function getRandomDate() {
    const now = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(now.getFullYear() - 3);
    const randomTimestamp = threeYearsAgo.getTime() +
        Math.random() * (now.getTime() - threeYearsAgo.getTime());
    return new Date(randomTimestamp);
}
async function main() {
    console.log("Seeding database with dummy data...");
    // --- Create Dummy Users ---
    const userEmails = [
        "user1@example.com",
        "user2@example.com",
        "user3@example.com",
        "user4@example.com",
        "user5@example.com",
    ];
    const users = [];
    for (const email of userEmails) {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: `User ${email.split("@")[0]}`,
            },
        });
        users.push(user);
        console.log(`Created dummy user: ${user.name} (${user.id})`);
    }
    // --- Generate Job Data ---
    const jobTitles = [
        "Frontend Developer",
        "Backend Engineer",
        "Fullstack Developer",
        "UI/UX Designer",
        "DevOps Engineer",
        "Data Scientist",
        "Mobile Developer",
        "QA Engineer",
        "Product Manager",
        "Project Manager",
        "Technical Writer",
        "Cloud Engineer",
        "Cybersecurity Analyst",
        "Network Engineer",
        "Database Administrator",
        "Machine Learning Engineer",
        "Embedded Systems Engineer",
        "Game Developer",
        "Blockchain Developer",
        "AI Engineer",
    ];
    const companies = [
        "Tech Solutions Inc.",
        "Data Innovations LLC",
        "Creative Agency",
        "Global Corp",
        "Future Systems",
        "Innovate Co.",
        "Digital Dreams",
        "Code Wizards",
        "Pixel Perfect",
        "Logic Labs",
        "Quantum Tech",
        "Synergy Group",
        "Apex Innovations",
        "Byte Builders",
        "Visionary Tech",
        "Dynamic Solutions",
        "Elite Software",
        "NextGen Labs",
        "Pioneer Tech",
        "Smart Systems",
    ];
    const locations = [
        "Remote",
        "New York, USA",
        "London, UK",
        "Berlin, Germany",
        "Paris, France",
        "Tokyo, Japan",
        "Sydney, Australia",
        "Toronto, Canada",
        "Nairobi, Kenya",
        "Cape Town, South Africa",
    ];
    const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
    const descriptions = [
        "Develop and maintain user-facing features using modern web technologies.",
        "Design and implement scalable backend services and APIs.",
        "Work across the full stack to deliver robust applications.",
        "Create intuitive and engaging user experiences.",
        "Manage and optimize cloud infrastructure and CI/CD pipelines.",
        "Analyze complex data sets and build predictive models.",
        "Develop native mobile applications for iOS and Android.",
        "Ensure software quality through automated testing and manual QA.",
        "Define product vision, strategy, and roadmap.",
        "Lead project planning, execution, and delivery.",
        "Create clear and concise technical documentation.",
        "Design and implement cloud-based solutions.",
        "Protect systems from cyber threats and vulnerabilities.",
        "Maintain and troubleshoot network infrastructure.",
        "Manage and optimize database systems.",
        "Develop and deploy machine learning models.",
        "Design and program software for embedded systems.",
        "Create immersive and interactive gaming experiences.",
        "Develop decentralized applications using blockchain technology.",
        "Research and implement cutting-edge artificial intelligence solutions.",
    ];
    const salaries = [
        "$60,000 - $80,000",
        "$80,000 - $100,000",
        "$100,000 - $120,000",
        "$120,000 - $150,000",
        "Competitive",
        "Negotiable",
    ];
    // --- Create 50 Dummy Jobs ---
    const createdJobs = [];
    for (let i = 0; i < 50; i++) {
        const randomUser = users[i % users.length];
        const job = await prisma.job.create({
            data: {
                title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
                company: companies[Math.floor(Math.random() * companies.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                salary: salaries[Math.floor(Math.random() * salaries.length)],
                postedById: randomUser.id,
                postedAt: getRandomDate(),
            },
        });
        createdJobs.push(job);
        console.log(`Created job ${i + 1}: ${job.title} by ${randomUser.name}`);
    }
    // --- Create 50 Dummy Applications ---
    for (let i = 0; i < 50; i++) {
        const randomJob = createdJobs[i % createdJobs.length];
        const randomApplicant = users[Math.floor(Math.random() * users.length)];
        try {
            await prisma.application.upsert({
                where: {
                    jobId_userId: { jobId: randomJob.id, userId: randomApplicant.id },
                },
                update: {},
                create: {
                    jobId: randomJob.id,
                    userId: randomApplicant.id,
                    status: "Pending",
                },
            });
            console.log(`Created application ${i + 1}: ${randomApplicant.name} for ${randomJob.title}`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.warn(`Could not create application ${i + 1}: ${error.message}`);
            }
            else {
                console.warn(`Could not create application ${i + 1}: ${error}`);
            }
        }
    }
    console.log("Dummy data seeding complete!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
