// Types cho ứng dụng Syllabus Management
// Cấu trúc response chuẩn từ Backend

export interface ApiResponse<T> {
  status: number; // 1000 = Success
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

// ========================
// Auth & Account
// ========================
export interface Account {
  accountId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: string | { roleName: string; permissions?: string[] };
}

export interface LoginResponse {
  token: string;
  account: Account;
}

export interface MeResponse {
  accountId: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: {
    roleName: string;
    permissions?: string[];
  };
}

// ========================
// Curriculum
// ========================
export interface Curriculum {
  curriculumId: string;
  curriculumCode: string;
  curriculumName?: string;
  displayName?: string;
  englishName?: string;
  totalCredits?: number;
  department?: string;
  description?: string;
  decisionNo?: string;
  startYear?: number;
  endYear?: number;
  major?: {
    majorId: string;
    majorCode: string;
    majorName: string;
  };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SemesterMapping {
  semester: number;
  subjects: SemesterSubject[];
}

export interface SemesterSubject {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  prerequisiteSubjectCode?: string;
  isElective?: boolean;
  electiveGroupId?: string;
  electiveGroupName?: string;
}

export interface SemesterMappingsResponse {
  curriculumId: string;
  semesterMappings: SemesterMapping[];
}

// ========================
// PLO
// ========================
export interface PLO {
  ploId: string;
  ploName: string;
  description: string;
  curriculumId?: string;
}

// ========================
// Subject
// ========================
export interface Subject {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits?: number;
  degreeLevel?: string;
  timeAllocation?: string;
  description?: string;
  studentTasks?: string;
  scoringScale?: number;
  decisionNo?: string;
  tool?: string;
  minToPass?: number;
  minBloomLevel?: number;
  theoryPeriods?: number;
  practicalPeriods?: number;
  selfStudyPeriods?: number;
  approvedDate?: string;
  status?: string;
  preRequisite?: string[];
  createdAt?: string;
  department?: {
    departmentId: string;
    departmentCode: string;
    departmentName: string;
    description: string;
    createdAt: string;
  };
  noCredit?: number;
  isActive?: boolean;
}

// ========================
// Source & CLO
// ========================
export interface SubjectSource {
  sourceId: string;
  sourceName: string;
  type: string;
  author?: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  url?: string;
}

export interface Clo {
  cloId: string;
  cloCode: string;
  cloName: string;
  description?: string;
  bloomLevel: string;
  status: string;
  createdAt: string;
}

// ========================
// Prerequisite
// ========================
export interface PrerequisiteRequirement {
  subjectCode: string;
  prerequisiteSubjectCode: string;
  isMandatory: boolean;
}

export interface DependentSubject {
  subjectCode: string;
  subjectName: string;
  credits?: number;
}

// ========================
// Syllabus
// ========================
export interface Syllabus {
  syllabusId: string;
  syllabusCode: string;
  syllabusName: string;
  englishName?: string;
  subjectId: string;
  subjectCode?: string;
  credits?: number;
  noCredit?: number;
  degreeLevel?: string;
  timeAllocation?: string;
  prerequisite?: string;
  description?: string;
  studentTasks?: string;
  tools?: string;
  scoringScale?: number;
  decisionNo?: string;
  isApproved?: boolean;
  note?: string;
  minAvgMarkToPass?: number;
  isActive?: boolean;
  approvedDate?: string;
  status?: string;
}

// ========================
// Session
// ========================
export interface Session {
  sessionId: string;
  syllabusId?: string;
  sessionNumber: number;
  sessionTitle: string;
  content?: string;
  teachingMethods?: string;
  duration?: number;
  sessionTopic?: string;
  sessionType?: string;
  createdAt?: string;
  
  // legacy/optional fields
  learningTeachingType?: string;
  lo?: string;
  itu?: string;
  studentMaterials?: string;
  studentTasks?: string;
}

// ========================
// Assessment
// ========================
export interface Assessment {
  assessmentId: string;
  category?: string;
  type?: string;
  part?: string;
  weight?: number | string;
  completionCriteria?: string;
  duration?: string;
  clo?: string;
  questionType?: string;
  noQuestion?: string | number;
  knowledgeAndSkill?: string;
  gradingGuide?: string;
  note?: string;
  syllabusId?: string;
}

// ========================
// Material
// ========================
export interface Material {
  materialId: string;
  title: string;
  materialType?: string;
  description?: string;
  author?: string;
  publisher?: string;
  publishedDate?: string;
  edition?: string;
  isbn?: string;
  isMainMaterial?: boolean;
  isHardCopy?: boolean;
  isOnline?: boolean;
  note?: string;
  uploadedAt?: string;
  status?: string;
  syllabusId?: string;
}

export interface SyllabusCompareData {
  removed_concepts: any[];
  added_concepts: any[];
  modified_concepts?: any;
  risk_assessment?: string;
  risk_reason?: string;
}

export interface MaterialBlock {
  blockId: string;
  idx: number;
  blockStyle: string;
  blockType: string;
  contentText: string;
}

export interface CloSessionMapping {
  id: string;
  cloId: string;
  cloCode: string;
  cloName: string;
  sessionId: string;
  sessionNumber: number;
  sessionTitle: string;
  sessionStatus?: string;
  syllabusId: string;
}

export interface CloAssessmentMapping {
  id: string;
  cloId: string;
  cloCode: string;
  cloName: string;
  assessmentId: string;
  assessmentPart?: number;
  assessmentStatus?: string;
  syllabusId: string;
}

export interface SessionMaterialItem {
  materialId: string;
  materialName: string;
}

export interface SessionBlockItem {
  blockId: string;
  content: string;
  idx: number;
}

export interface SessionMaterialBlockDetail {
  session: string;
  sessionNumber: number;
  sessionTitle: string;
  teachingMethods?: string;
  duration?: number;
  material: SessionMaterialItem[];
  block: SessionBlockItem[];
}
