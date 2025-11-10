"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Must be the first import to load environment variables
var prisma_1 = require("../app/generated/prisma");
var prisma = new prisma_1.PrismaClient();
// Helper function to generate a random date within the 1980s
function getRandomDateIn1980s() {
    var start = new Date('1980-01-01T00:00:00Z');
    var end = new Date('1989-12-31T23:59:59Z');
    var randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTimestamp);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var userEmails, users, _i, userEmails_1, email, user, jobTitles, companies, locations, jobTypes, descriptions, salaries, createdJobs, i, randomUser, job, i, randomJob, randomApplicant, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Seeding database with dummy data...");
                    userEmails = [
                        "user1@example.com",
                        "user2@example.com",
                        "user3@example.com",
                        "user4@example.com",
                        "user5@example.com",
                    ];
                    users = [];
                    _i = 0, userEmails_1 = userEmails;
                    _a.label = 1;
                case 1:
                    if (!(_i < userEmails_1.length)) return [3 /*break*/, 4];
                    email = userEmails_1[_i];
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: email },
                            update: {},
                            create: {
                                email: email,
                                name: "User ".concat(email.split("@")[0]), // e.g., User user1
                            },
                        })];
                case 2:
                    user = _a.sent();
                    users.push(user);
                    console.log("Created dummy user: ".concat(user.name, " (").concat(user.id, ")"));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    jobTitles = [
                        "Frontend Developer", "Backend Engineer", "Fullstack Developer", "UI/UX Designer",
                        "DevOps Engineer", "Data Scientist", "Mobile Developer", "QA Engineer",
                        "Product Manager", "Project Manager", "Technical Writer", "Cloud Engineer",
                        "Cybersecurity Analyst", "Network Engineer", "Database Administrator", "Machine Learning Engineer",
                        "Embedded Systems Engineer", "Game Developer", "Blockchain Developer", "AI Engineer",
                    ];
                    companies = [
                        "Tech Solutions Inc.", "Data Innovations LLC", "Creative Agency", "Global Corp",
                        "Future Systems", "Innovate Co.", "Digital Dreams", "Code Wizards",
                        "Pixel Perfect", "Logic Labs", "Quantum Tech", "Synergy Group",
                        "Apex Innovations", "Byte Builders", "Visionary Tech", "Dynamic Solutions",
                        "Elite Software", "NextGen Labs", "Pioneer Tech", "Smart Systems",
                    ];
                    locations = [
                        "Remote", "New York, USA", "London, UK", "Berlin, Germany", "Paris, France",
                        "Tokyo, Japan", "Sydney, Australia", "Toronto, Canada", "Nairobi, Kenya", "Cape Town, South Africa",
                    ];
                    jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
                    descriptions = [
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
                    salaries = [
                        "$60,000 - $80,000", "$80,000 - $100,000", "$100,000 - $120,000", "$120,000 - $150,000",
                        "Competitive", "Negotiable",
                    ];
                    createdJobs = [];
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < 50)) return [3 /*break*/, 8];
                    randomUser = users[i % users.length];
                    return [4 /*yield*/, prisma.job.create({
                            data: {
                                title: jobTitles[Math.floor(Math.random() * jobTitles.length)] + " (Job ".concat(i + 1, ")"),
                                company: companies[Math.floor(Math.random() * companies.length)],
                                location: locations[Math.floor(Math.random() * locations.length)],
                                type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
                                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                                salary: salaries[Math.floor(Math.random() * salaries.length)],
                                postedById: randomUser.id,
                                postedAt: getRandomDateIn1980s(), // Assign a random date from the 1980s
                            },
                        })];
                case 6:
                    job = _a.sent();
                    createdJobs.push(job);
                    console.log("Created job ".concat(i + 1, ": ").concat(job.title, " by ").concat(randomUser.name));
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    i = 0;
                    _a.label = 9;
                case 9:
                    if (!(i < 50)) return [3 /*break*/, 15];
                    randomJob = createdJobs[i % createdJobs.length];
                    randomApplicant = users[Math.floor(Math.random() * users.length)];
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, prisma.application.upsert({
                            where: { jobId_userId: { jobId: randomJob.id, userId: randomApplicant.id } },
                            update: {},
                            create: {
                                jobId: randomJob.id,
                                userId: randomApplicant.id,
                                status: "Pending", // All applications start as pending
                            },
                        })];
                case 11:
                    _a.sent();
                    console.log("Created application ".concat(i + 1, ": ").concat(randomApplicant.name, " for ").concat(randomJob.title));
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    // This catch block is mostly for logging if an upsert fails for unexpected reasons
                    if (error_1 instanceof Error) {
                        console.warn("Could not create application ".concat(i + 1, " (possibly duplicate): ").concat(error_1.message));
                    }
                    else {
                        console.warn("Could not create application ".concat(i + 1, " (possibly duplicate): $Failed to edit, 0 occurrences found for old_string (import 'dotenv/config'; // Must be the first import to load environment variables\nimport { PrismaClient } from \"../app/generated/prisma\";\n\nconst prisma = new PrismaClient();\n\nasync function main() {\n  console.log(\"Seeding database with dummy data...\");\n\n  // --- Create Dummy Users ---\n  const userEmails = [\n    \"user1@example.com\",\n    \"user2@example.com\",\n    \"user3@example.com\",\n    \"user4@example.com\",\n    \"user5@example.com\",\n  ];\n  const users = [];\n  for (const email of userEmails) {\n    const user = await prisma.user.upsert({\n      where: { email: email },\n      update: {},\n      create: {\n        email: email,\n        name: "), User, $, { email: email, : .split("@")[0] }(templateObject_1 || (templateObject_1 = __makeTemplateObject([", // e.g., User user1\n      },\n    });\n    users.push(user);\n    console.log("], [", // e.g., User user1\n      },\n    });\n    users.push(user);\n    console.log("]))), Created, dummy, user, $, { user: user, : .name }($, { user: user, : .id })(templateObject_2 || (templateObject_2 = __makeTemplateObject([");\n  }\n\n  // --- Generate Job Data ---\n  const jobTitles = [\n    \"Frontend Developer\", \"Backend Engineer\", \"Fullstack Developer\", \"UI/UX Designer\",\n    \"DevOps Engineer\", \"Data Scientist\", \"Mobile Developer\", \"QA Engineer\",\n    \"Product Manager\", \"Project Manager\", \"Technical Writer\", \"Cloud Engineer\",\n    \"Cybersecurity Analyst\", \"Network Engineer\", \"Database Administrator\", \"Machine Learning Engineer\",\n    \"Embedded Systems Engineer\", \"Game Developer\", \"Blockchain Developer\", \"AI Engineer\",\n  ];\n  const companies = [\n    \"Tech Solutions Inc.\", \"Data Innovations LLC\", \"Creative Agency\", \"Global Corp\",\n    \"Future Systems\", \"Innovate Co.\", \"Digital Dreams\", \"Code Wizards\",\n    \"Pixel Perfect\", \"Logic Labs\", \"Quantum Tech\", \"Synergy Group\",\n    \"Apex Innovations\", \"Byte Builders\", \"Visionary Tech\", \"Dynamic Solutions\",\n    \"Elite Software\", \"NextGen Labs\", \"Pioneer Tech\", \"Smart Systems\",\n  ];\n  const locations = [\n    \"Remote\", \"New York, USA\", \"London, UK\", \"Berlin, Germany\", \"Paris, France\",\n    \"Tokyo, Japan\", \"Sydney, Australia\", \"Toronto, Canada\", \"Nairobi, Kenya\", \"Cape Town, South Africa\",\n  ];\n  const jobTypes = [\"Full-time\", \"Part-time\", \"Contract\", \"Internship\"];\n  const descriptions = [\n    \"Develop and maintain user-facing features using modern web technologies.\",\n    \"Design and implement scalable backend services and APIs.\",\n    \"Work across the full stack to deliver robust applications.\",\n    \"Create intuitive and engaging user experiences.\",\n    \"Manage and optimize cloud infrastructure and CI/CD pipelines.\",\n    \"Analyze complex data sets and build predictive models.\",\n    \"Develop native mobile applications for iOS and Android.\",\n    \"Ensure software quality through automated testing and manual QA.\",\n    \"Define product vision, strategy, and roadmap.\",\n    \"Lead project planning, execution, and delivery.\",\n    \"Create clear and concise technical documentation.\",\n    \"Design and implement cloud-based solutions.\",\n    \"Protect systems from cyber threats and vulnerabilities.\",\n    \"Maintain and troubleshoot network infrastructure.\",\n    \"Manage and optimize database systems.\",\n    \"Develop and deploy machine learning models.\",\n    \"Design and program software for embedded systems.\",\n    \"Create immersive and interactive gaming experiences.\",\n    \"Develop decentralized applications using blockchain technology.\",\n    \"Research and implement cutting-edge artificial intelligence solutions.\",\n  ];\n  const salaries = [\n    \"$60,000 - $80,000\", \"$80,000 - $100,000\", \"$100,000 - $120,000\", \"$120,000 - $150,000\",\n    \"Competitive\", \"Negotiable\",\n  ];\n\n  // --- Create 50 Dummy Jobs ---\n  const createdJobs = [];\n  for (let i = 0; i < 50; i++) {\n    const randomUser = users[i % users.length]; // Cycle through users\n    const job = await prisma.job.create({\n      data: {\n        title: jobTitles[Math.floor(Math.random() * jobTitles.length)] + "], [");\n  }\n\n  // --- Generate Job Data ---\n  const jobTitles = [\n    \"Frontend Developer\", \"Backend Engineer\", \"Fullstack Developer\", \"UI/UX Designer\",\n    \"DevOps Engineer\", \"Data Scientist\", \"Mobile Developer\", \"QA Engineer\",\n    \"Product Manager\", \"Project Manager\", \"Technical Writer\", \"Cloud Engineer\",\n    \"Cybersecurity Analyst\", \"Network Engineer\", \"Database Administrator\", \"Machine Learning Engineer\",\n    \"Embedded Systems Engineer\", \"Game Developer\", \"Blockchain Developer\", \"AI Engineer\",\n  ];\n  const companies = [\n    \"Tech Solutions Inc.\", \"Data Innovations LLC\", \"Creative Agency\", \"Global Corp\",\n    \"Future Systems\", \"Innovate Co.\", \"Digital Dreams\", \"Code Wizards\",\n    \"Pixel Perfect\", \"Logic Labs\", \"Quantum Tech\", \"Synergy Group\",\n    \"Apex Innovations\", \"Byte Builders\", \"Visionary Tech\", \"Dynamic Solutions\",\n    \"Elite Software\", \"NextGen Labs\", \"Pioneer Tech\", \"Smart Systems\",\n  ];\n  const locations = [\n    \"Remote\", \"New York, USA\", \"London, UK\", \"Berlin, Germany\", \"Paris, France\",\n    \"Tokyo, Japan\", \"Sydney, Australia\", \"Toronto, Canada\", \"Nairobi, Kenya\", \"Cape Town, South Africa\",\n  ];\n  const jobTypes = [\"Full-time\", \"Part-time\", \"Contract\", \"Internship\"];\n  const descriptions = [\n    \"Develop and maintain user-facing features using modern web technologies.\",\n    \"Design and implement scalable backend services and APIs.\",\n    \"Work across the full stack to deliver robust applications.\",\n    \"Create intuitive and engaging user experiences.\",\n    \"Manage and optimize cloud infrastructure and CI/CD pipelines.\",\n    \"Analyze complex data sets and build predictive models.\",\n    \"Develop native mobile applications for iOS and Android.\",\n    \"Ensure software quality through automated testing and manual QA.\",\n    \"Define product vision, strategy, and roadmap.\",\n    \"Lead project planning, execution, and delivery.\",\n    \"Create clear and concise technical documentation.\",\n    \"Design and implement cloud-based solutions.\",\n    \"Protect systems from cyber threats and vulnerabilities.\",\n    \"Maintain and troubleshoot network infrastructure.\",\n    \"Manage and optimize database systems.\",\n    \"Develop and deploy machine learning models.\",\n    \"Design and program software for embedded systems.\",\n    \"Create immersive and interactive gaming experiences.\",\n    \"Develop decentralized applications using blockchain technology.\",\n    \"Research and implement cutting-edge artificial intelligence solutions.\",\n  ];\n  const salaries = [\n    \"$60,000 - $80,000\", \"$80,000 - $100,000\", \"$100,000 - $120,000\", \"$120,000 - $150,000\",\n    \"Competitive\", \"Negotiable\",\n  ];\n\n  // --- Create 50 Dummy Jobs ---\n  const createdJobs = [];\n  for (let i = 0; i < 50; i++) {\n    const randomUser = users[i % users.length]; // Cycle through users\n    const job = await prisma.job.create({\n      data: {\n        title: jobTitles[Math.floor(Math.random() * jobTitles.length)] + "])))(Job, $, { i: i } + 1));
                    }
                    ",\n        company: companies[Math.floor(Math.random() * companies.length)],\n        location: locations[Math.floor(Math.random() * locations.length)],\n        type: jobTypes[Math.floor(Math.random() * jobTypes.length)],\n        description: descriptions[Math.floor(Math.random() * descriptions.length)],\n        salary: salaries[Math.floor(Math.random() * salaries.length)],\n        postedById: randomUser.id,\n      },\n    });\n    createdJobs.push(job);\n    console.log(";
                    Created;
                    job;
                    $;
                    {
                        i + 1;
                    }
                    $;
                    {
                        job.title;
                    }
                    by;
                    $;
                    {
                        randomUser.name;
                    }
                    ");\n  }\n\n  // --- Create 50 Dummy Applications ---\n  for (let i = 0; i < 50; i++) {\n    const randomJob = createdJobs[i % createdJobs.length]; // Cycle through created jobs\n    const randomApplicant = users[Math.floor(Math.random() * users.length)]; // Random applicant\n\n    // Ensure unique application per user per job using upsert\n    try {\n      await prisma.application.upsert({\n        where: { jobId_userId: { jobId: randomJob.id, userId: randomApplicant.id } },\n        update: {},\n        create: {\n          jobId: randomJob.id,\n          userId: randomApplicant.id,\n          status: \"Pending\", // All applications start as pending\n        },\n      });\n      console.log(";
                    Created;
                    application;
                    $;
                    {
                        i + 1;
                    }
                    $;
                    {
                        randomApplicant.name;
                    }
                    for ($; { randomJob: randomJob, : .title }(templateObject_3 || (templateObject_3 = __makeTemplateObject([");\n    } catch (error: unknown) {\n      // This catch block is mostly for logging if an upsert fails for unexpected reasons\n      console.warn(\n        "], [");\n    } catch (error: unknown) {\n      // This catch block is mostly for logging if an upsert fails for unexpected reasons\n      console.warn(\n        "]))); Could)
                        not;
                    create;
                    application;
                    $;
                    {
                        i + 1;
                    }
                    (possibly);
                    duplicate;
                    $;
                    {
                        error_1.message;
                    }
                    ",\n      );\n    }\n  }\n\n  console.log(\"Dummy data seeding complete!\");\n}\n\nmain()\n  .catch((e) => {\n    console.error(e);\n    process.exit(1);\n  })\n  .finally(async () => {\n    await prisma.$disconnect();\n  });\n). Original old_string was (import 'dotenv/config'; // Must be the first import to load environment variables\nimport { PrismaClient } from \"../app/generated/prisma\";\n\nconst prisma = new PrismaClient();\n\nasync function main() {\n  console.log(\"Seeding database with dummy data...\");\n\n  // --- Create Dummy Users ---\n  const userEmails = [\n    \"user1@example.com\",\n    \"user2@example.com\",\n    \"user3@example.com\",\n    \"user4@example.com\",\n    \"user5@example.com\",\n  ];\n  const users = [];\n  for (const email of userEmails) {\n    const user = await prisma.user.upsert({\n      where: { email: email },\n      update: {},\n      create: {\n        email: email,\n        name: ";
                    User;
                    $;
                    {
                        email.split("@")[0];
                    }
                    ", // e.g., User user1\n      },\n    });\n    users.push(user);\n    console.log(";
                    Created;
                    dummy;
                    user: $;
                    {
                        user.name;
                    }
                    ($);
                    {
                        user.id;
                    }
                    ");\n  }\n\n  // --- Generate Job Data ---\n  const jobTitles = [\n    \"Frontend Developer\", \"Backend Engineer\", \"Fullstack Developer\", \"UI/UX Designer\",\n    \"DevOps Engineer\", \"Data Scientist\", \"Mobile Developer\", \"QA Engineer\",\n    \"Product Manager\", \"Project Manager\", \"Technical Writer\", \"Cloud Engineer\",\n    \"Cybersecurity Analyst\", \"Network Engineer\", \"Database Administrator\", \"Machine Learning Engineer\",\n    \"Embedded Systems Engineer\", \"Game Developer\", \"Blockchain Developer\", \"AI Engineer\",\n  ];\n  const companies = [\n    \"Tech Solutions Inc.\", \"Data Innovations LLC\", \"Creative Agency\", \"Global Corp\",\n    \"Future Systems\", \"Innovate Co.\", \"Digital Dreams\", \"Code Wizards\",\n    \"Pixel Perfect\", \"Logic Labs\", \"Quantum Tech\", \"Synergy Group\",\n    \"Apex Innovations\", \"Byte Builders\", \"Visionary Tech\", \"Dynamic Solutions\",\n    \"Elite Software\", \"NextGen Labs\", \"Pioneer Tech\", \"Smart Systems\",\n  ];\n  const locations = [\n    \"Remote\", \"New York, USA\", \"London, UK\", \"Berlin, Germany\", \"Paris, France\",\n    \"Tokyo, Japan\", \"Sydney, Australia\", \"Toronto, Canada\", \"Nairobi, Kenya\", \"Cape Town, South Africa\",\n  ];\n  const jobTypes = [\"Full-time\", \"Part-time\", \"Contract\", \"Internship\"];\n  const descriptions = [\n    \"Develop and maintain user-facing features using modern web technologies.\",\n    \"Design and implement scalable backend services and APIs.\",\n    \"Work across the full stack to deliver robust applications.\",\n    \"Create intuitive and engaging user experiences.\",\n    \"Manage and optimize cloud infrastructure and CI/CD pipelines.\",\n    \"Analyze complex data sets and build predictive models.\",\n    \"Develop native mobile applications for iOS and Android.\",\n    \"Ensure software quality through automated testing and manual QA.\",\n    \"Define product vision, strategy, and roadmap.\",\n    \"Lead project planning, execution, and delivery.\",\n    \"Create clear and concise technical documentation.\",\n    \"Design and implement cloud-based solutions.\",\n    \"Protect systems from cyber threats and vulnerabilities.\",\n    \"Maintain and troubleshoot network infrastructure.\",\n    \"Manage and optimize database systems.\",\n    \"Develop and deploy machine learning models.\",\n    \"Design and program software for embedded systems.\",\n    \"Create immersive and interactive gaming experiences.\",\n    \"Develop decentralized applications using blockchain technology.\",\n    \"Research and implement cutting-edge artificial intelligence solutions.\",\n  ];\n  const salaries = [\n    \"$60,000 - $80,000\", \"$80,000 - $100,000\", \"$100,000 - $120,000\", \"$120,000 - $150,000\",\n    \"Competitive\", \"Negotiable\",\n  ];\n\n  // --- Create 50 Dummy Jobs ---\n  const createdJobs = [];\n  for (let i = 0; i < 50; i++) {\n    const randomUser = users[i % users.length]; // Cycle through users\n    const job = await prisma.job.create({\n      data: {\n        title: jobTitles[Math.floor(Math.random() * jobTitles.length)] + "(Job, $, { i: i } + 1);
                    return [3 /*break*/, 13];
                case 13:
                    ",\n        company: companies[Math.floor(Math.random() * companies.length)],\n        location: locations[Math.floor(Math.random() * locations.length)],\n        type: jobTypes[Math.floor(Math.random() * jobTypes.length)],\n        description: descriptions[Math.floor(Math.random() * descriptions.length)],\n        salary: salaries[Math.floor(Math.random() * salaries.length)],\n        postedById: randomUser.id,\n      },\n    });\n    createdJobs.push(job);\n    console.log(";
                    Created;
                    job;
                    $;
                    {
                        i + 1;
                    }
                    $;
                    {
                        job.title;
                    }
                    by;
                    $;
                    {
                        randomUser.name;
                    }
                    ");\n  }\n\n  // --- Create 50 Dummy Applications ---\n  for (let i = 0; i < 50; i++) {\n    const randomJob = createdJobs[i % createdJobs.length]; // Cycle through created jobs\n    const randomApplicant = users[Math.floor(Math.random() * users.length)]; // Random applicant\n\n    // Ensure unique application per user per job using upsert\n    try {\n      await prisma.application.upsert({\n        where: { jobId_userId: { jobId: randomJob.id, userId: randomApplicant.id } },\n        update: {},\n        create: {\n          jobId: randomJob.id,\n          userId: randomApplicant.id,\n          status: \"Pending\", // All applications start as pending\n        },\n      });\n      console.log(";
                    Created;
                    application;
                    $;
                    {
                        i + 1;
                    }
                    $;
                    {
                        randomApplicant.name;
                    }
                    for ($; { randomJob: randomJob, : .title }(templateObject_4 || (templateObject_4 = __makeTemplateObject([");\n    } catch (error: unknown) {\n      // This catch block is mostly for logging if an upsert fails for unexpected reasons\n      console.warn(\n        "], [");\n    } catch (error: unknown) {\n      // This catch block is mostly for logging if an upsert fails for unexpected reasons\n      console.warn(\n        "]))); Could)
                        not;
                    create;
                    application;
                    $;
                    {
                        i + 1;
                    }
                    (possibly);
                    duplicate;
                    $;
                    {
                        error.message;
                    }
                    ",\n      );\n    }\n  }\n\n  console.log(\"Dummy data seeding complete!\");\n}\n\nmain()\n  .catch((e) => {\n    console.error(e);\n    process.exit(1);\n  })\n  .finally(async () => {\n    await prisma.$disconnect();\n  });\n)\" ,\n        );\n      }\n    }\n  }\n\n  console.log(\"Dummy data seeding complete!\");\n}\n\nmain()\n  .catch((e) => {\n    console.error(e);\n    process.exit(1);\n  })\n  .finally(async () => {\n    await prisma.$disconnect();\n  });\n";
                    _a.label = 14;
                case 14:
                    i++;
                    return [3 /*break*/, 9];
                case 15: return [2 /*return*/];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
