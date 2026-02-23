export interface PLO {
    name: string;
    description: string;
}

export interface Subject {
    code: string;
    name: string;
    englishName?: string;
    semester: number;
    credits: number;
    prerequisite?: string;
}

export interface Material {
    description: string;
    author: string;
    publisher: string;
    publishedDate: string;
    edition: string;
    isbn: string;
    isMainMaterial: boolean;
    isHardCopy: boolean;
    isOnline: boolean;
    note: string;
}

export interface CLO {
    name: string;
    description: string;
}

export interface Session {
    sessionNo: number;
    topic: string;
    learningTeachingType: string;
    lo: string;
    itu: string;
    studentMaterials: string;
    studentTasks: string;
}

export interface ConstructiveQuestion {
    sessionNo: number;
    name: string;
    details: string;
}

export interface Assessment {
    category: string;
    type: string;
    part: string;
    weight: string;
    completionCriteria: string;
    duration: string;
    clo: string;
    questionType: string;
    noQuestion: string;
    knowledgeAndSkill: string;
    gradingGuide: string;
    note: string;
}

export interface Syllabus {
    id: string; // Syllabus ID
    name: string; // Syllabus Name
    englishName: string; // Syllabus English
    subjectCode: string;
    credits: number; // NoCredit
    degreeLevel: string;
    timeAllocation: string;
    prerequisite: string;
    description: string;
    studentTasks: string;
    tools: string;
    scoringScale: number;
    decisionNo: string;
    isApproved: boolean;
    note: string;
    minAvgMarkToPass: number;
    isActive: boolean;
    approvedDate: string;

    materials: Material[];
    clos: CLO[];
    sessions: Session[];
    constructiveQuestions: ConstructiveQuestion[];
    assessments: Assessment[];
}

export interface Curriculum {
    id: string;
    name: string;
    englishName: string;
    code: string;
    credits: number;
    department: string;
    description?: string;
    decisionNo?: string;
    plos?: PLO[];
    subjects?: Subject[];
}

export const MOCK_CURRICULUMS: Curriculum[] = [
    {
        id: "c-se",
        name: "Kỹ thuật phần mềm",
        englishName: "Software Engineering",
        code: "SE",
        credits: 145,
        department: "Công nghệ thông tin",
        description: "Chương trình đào tạo Kỹ sư Kỹ thuật phần mềm trang bị cho sinh viên kiến thức chuyên sâu về công nghệ và quy trình sản xuất phần mềm. Đặc biệt là các hệ thống phần mềm quy mô lớn.",
        decisionNo: "123/QD-DH 10/15/2023",
        plos: [
            { name: "PLO 1", description: "Áp dụng kiến thức toán học, khoa học, khoa học máy tính và kỹ thuật để giải quyết các vấn đề phức tạp." },
            { name: "PLO 2", description: "Phân tích, thiết kế, triển khai và đánh giá các giải pháp phần mềm đáp ứng các yêu cầu cụ thể." },
            { name: "PLO 3", description: "Làm việc hiệu quả trong các nhóm đa ngành để đạt được mục tiêu chung." }
        ],
        subjects: [
            { code: "PRF192", name: "Cơ sở lập trình", semester: 1, credits: 3, prerequisite: "" },
            { code: "PRO192", name: "Lập trình hướng đối tượng", semester: 2, credits: 3, prerequisite: "PRF192" },
            { code: "CSD201", name: "Cấu trúc dữ liệu và giải thuật", semester: 3, credits: 3, prerequisite: "PRO192" },
            { code: "PRJ301", name: "Lập trình Java Web", semester: 4, credits: 3, prerequisite: "PRO192" },
            { code: "SWP391", name: "Dự án ứng dụng phần mềm", semester: 5, credits: 3, prerequisite: "PRJ301" }
        ]
    },
    {
        id: "c-ia",
        name: "An toàn thông tin",
        englishName: "Information Assurance",
        code: "IA",
        credits: 142,
        department: "Công nghệ thông tin",
    },
    {
        id: "c-ai",
        name: "Trí tuệ nhân tạo",
        englishName: "Artificial Intelligence",
        code: "AI",
        credits: 145,
        department: "Công nghệ thông tin",
    },
    {
        id: "c-gd",
        name: "Thiết kế đồ họa số",
        englishName: "Digital Art & Design",
        code: "GD",
        credits: 135,
        department: "Thiết kế",
    },
    {
        id: "c-ib",
        name: "Kinh doanh quốc tế",
        englishName: "International Business",
        code: "IB",
        credits: 130,
        department: "Kinh tế",
    },
    {
        id: "c-mc",
        name: "Truyền thông đa phương tiện",
        englishName: "Multimedia Communications",
        code: "MC",
        credits: 132,
        department: "Truyền thông",
    },
    {
        id: "c-jl",
        name: "Ngôn ngữ Nhật",
        englishName: "Japanese Language",
        code: "JL",
        credits: 138,
        department: "Ngôn ngữ học",
    },
    {
        id: "c-el",
        name: "Ngôn ngữ Anh",
        englishName: "English Language",
        code: "EL",
        credits: 138,
        department: "Ngôn ngữ học",
    },
    {
        id: "c-is",
        name: "Hệ thống thông tin",
        englishName: "Information Systems",
        code: "IS",
        credits: 140,
        department: "Công nghệ thông tin",
    },
    {
        id: "c-mk",
        name: "Quản trị Marketing",
        englishName: "Digital Marketing",
        code: "MK",
        credits: 130,
        department: "Kinh tế",
    },
    {
        id: "c-st",
        name: "Khoa học công nghệ",
        englishName: "Science and Technology",
        code: "ST",
        credits: 140,
        department: "Công nghệ thông tin",
    }
];

export const MOCK_SYLLABUSES: Syllabus[] = [
    {
        id: "syl-prf192",
        name: "Cơ sở lập trình",
        englishName: "Programming Fundamentals",
        subjectCode: "PRF192",
        credits: 3,
        degreeLevel: "Undergraduate",
        timeAllocation: "30h Theory, 30h Practice",
        prerequisite: "None",
        description: "Môn học cung cấp kiến thức nền tảng về lập trình bằng ngôn ngữ C. Sinh viên sẽ học về biến, kiểu dữ liệu, cấu trúc điều khiển, mảng, con trỏ và hàm.",
        studentTasks: "Attend 80% classes, submit assignments on time",
        tools: "Dev-C++, Visual Studio Code",
        scoringScale: 10,
        decisionNo: "456/QD-DH 01/05/2023",
        isApproved: true,
        note: "Core subject for SE",
        minAvgMarkToPass: 5.0,
        isActive: true,
        approvedDate: "2023-05-01",
        materials: [
            {
                description: "C Programming Approach",
                author: "Paul Deitel",
                publisher: "Pearson",
                publishedDate: "2016",
                edition: "8th Update",
                isbn: "978-0133976892",
                isMainMaterial: true,
                isHardCopy: true,
                isOnline: false,
                note: "Use chapter 1-10"
            }
        ],
        clos: [
            { name: "CLO 1", description: "Hiểu và áp dụng các cấu trúc điều khiển cơ bản trong C (if, switch, for, while)." },
            { name: "CLO 2", description: "Làm việc với mảng (1D, 2D) và chuỗi." },
            { name: "CLO 3", description: "Viết hàm và hiểu cách truyền tham số (pass by value, pass by reference với con trỏ)." }
        ],
        sessions: [
            {
                sessionNo: 1,
                topic: "Introduction to C Programming",
                learningTeachingType: "Theory/Practice",
                lo: "CLO 1",
                itu: "I",
                studentMaterials: "Read chapter 1-2",
                studentTasks: "Complete intro exercise"
            },
            {
                sessionNo: 2,
                topic: "Control Structures",
                learningTeachingType: "Theory/Practice",
                lo: "CLO 1",
                itu: "T",
                studentMaterials: "Read chapter 3-4",
                studentTasks: "Practice conditional statements"
            }
        ],
        constructiveQuestions: [
            {
                sessionNo: 1,
                name: "Q1. Setup Environment",
                details: "How do you compile a C program using GCC?"
            },
            {
                sessionNo: 2,
                name: "Q2. Loop Analysis",
                details: "What is the difference between while and do-while loops?"
            }
        ],
        assessments: [
            {
                category: "Final",
                type: "Practical Exam",
                part: "PE",
                weight: "40%",
                completionCriteria: ">= 4.0",
                duration: "90 min",
                clo: "CLO1, CLO2, CLO3",
                questionType: "Coding",
                noQuestion: "3",
                knowledgeAndSkill: "Algorithms and Coding",
                gradingGuide: "Passed test cases",
                note: "Closed book"
            },
            {
                category: "Final",
                type: "Final Exam",
                part: "FE",
                weight: "30%",
                completionCriteria: ">= 4.0",
                duration: "60 min",
                clo: "CLO1, CLO2",
                questionType: "Multiple Choice",
                noQuestion: "50",
                knowledgeAndSkill: "Theory",
                gradingGuide: "Machine graded",
                note: "Closed book"
            }
        ]
    },
    {
        id: "syl-pro192",
        name: "Lập trình hướng đối tượng",
        englishName: "Object-Oriented Programming",
        subjectCode: "PRO192",
        credits: 3,
        degreeLevel: "Undergraduate",
        timeAllocation: "30h Theory, 30h Practice",
        prerequisite: "PRF192",
        description: "Môn học cung cấp kiến thức nền tảng về lập trình hướng đối tượng bằng ngôn ngữ Java. Sinh viên học cách thiết kế class, kế thừa, đa hình, interface và xử lý ngoại lệ.",
        studentTasks: "Attend lectures, complete weekly practical exercises",
        tools: "NetBeans, IntelliJ IDEA, Eclipse",
        scoringScale: 10,
        decisionNo: "125/QD-DH 12/08/2023",
        isApproved: true,
        note: "Trọng tâm kỹ năng Java",
        minAvgMarkToPass: 5.0,
        isActive: true,
        approvedDate: "2023-08-12",
        materials: [
            {
                description: "Introduction to Java Programming",
                author: "Y. Daniel Liang",
                publisher: "Pearson",
                publishedDate: "2018",
                edition: "11th Edition",
                isbn: "978-0134670942",
                isMainMaterial: true,
                isHardCopy: true,
                isOnline: false,
                note: "Use chapter 9-13"
            }
        ],
        clos: [
            { name: "CLO 1", description: "Hiểu các khái niệm cơ bản của OOP: Encapsulation, Inheritance, Polymorphism." },
            { name: "CLO 2", description: "Vận dụng được Collections framework trong Java." },
            { name: "CLO 3", description: "Xử lý ngoại lệ và luồng I/O cơ bản." }
        ],
        sessions: [
            {
                sessionNo: 1,
                topic: "Introduction to Objects and Classes",
                learningTeachingType: "Theory",
                lo: "CLO 1",
                itu: "I",
                studentMaterials: "Read chapter 9",
                studentTasks: "Create simple classes"
            },
            {
                sessionNo: 2,
                topic: "Inheritance and Polymorphism",
                learningTeachingType: "Theory/Practice",
                lo: "CLO 1",
                itu: "T",
                studentMaterials: "Read chapter 11",
                studentTasks: "Implement overriding and overloading"
            }
        ],
        constructiveQuestions: [
            {
                sessionNo: 1,
                name: "Q1. Constructor",
                details: "What is the difference between a constructor and a standard method?"
            }
        ],
        assessments: [
            {
                category: "Final",
                type: "Practical Exam",
                part: "PE",
                weight: "40%",
                completionCriteria: ">= 4.0",
                duration: "90 min",
                clo: "CLO1, CLO2, CLO3",
                questionType: "Coding",
                noQuestion: "3",
                knowledgeAndSkill: "Java Coding",
                gradingGuide: "Passed test cases",
                note: "Allowed documentation"
            }
        ]
    },
    {
        id: "syl-csd201",
        name: "Cấu trúc dữ liệu và giải thuật",
        englishName: "Data Structures and Algorithms",
        subjectCode: "CSD201",
        credits: 3,
        degreeLevel: "Undergraduate",
        timeAllocation: "30h Theory, 30h Practice",
        prerequisite: "PRO192",
        description: "Môn học giới thiệu các cấu trúc dữ liệu cơ bản (List, Stack, Queue, Tree, Graph) và các giải thuật tìm kiếm, sắp xếp.",
        studentTasks: "Do assignments and implement algorithms from scratch",
        tools: "Java, C++",
        scoringScale: 10,
        decisionNo: "888/QD-DH 01/01/2024",
        isApproved: true,
        note: "Requires strong programming fundamental",
        minAvgMarkToPass: 5.0,
        isActive: true,
        approvedDate: "2024-01-01",
        materials: [
            {
                description: "Data Structures and Algorithm Analysis",
                author: "Mark Allen Weiss",
                publisher: "Pearson",
                publishedDate: "2011",
                edition: "3rd Edition",
                isbn: "978-0132847377",
                isMainMaterial: true,
                isHardCopy: true,
                isOnline: false,
                note: ""
            }
        ],
        clos: [
            { name: "CLO 1", description: "Phân tích độ phức tạp thời gian và không gian của giải thuật." },
            { name: "CLO 2", description: "Cài đặt và áp dụng List, Stack, Queue." },
            { name: "CLO 3", description: "Cài đặt và hiểu cơ chế hoạt động của Binary Search Tree, Graph." }
        ],
        sessions: [
            {
                sessionNo: 1,
                topic: "Array Allocation, Linked Lists",
                learningTeachingType: "Theory/Practice",
                lo: "CLO 2",
                itu: "I, T",
                studentMaterials: "Read chapter 3",
                studentTasks: "Implement Singly Linked List"
            }
        ],
        constructiveQuestions: [],
        assessments: [
            {
                category: "Final",
                type: "Practical Exam",
                part: "PE",
                weight: "100%",
                completionCriteria: ">= 4.0",
                duration: "90 min",
                clo: "CLO1, CLO2, CLO3",
                questionType: "Coding",
                noQuestion: "3",
                knowledgeAndSkill: "Algorithms Implementation",
                gradingGuide: "Passed automated tests",
                note: "Paperless"
            }
        ]
    }
];
