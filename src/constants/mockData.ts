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
