export interface LocaleString {
  ko: string
  en: string
}

export interface ProfileMeta {
  updatedAt: string
}

export interface Profile {
  name: LocaleString
  title: LocaleString
  email: string
  github: string
  linkedin: string
  phone: string
  location: LocaleString
  intro: LocaleString
  profileImage: string
}

export interface Skills {
  language: string[]
  framework: string[]
  db: string[]
  etc: string[]
}

export interface ExperiencePeriod {
  start: string
  end: string | null
}

export interface Experience {
  company: LocaleString
  role: LocaleString
  period: ExperiencePeriod
  tasks: { ko: string[]; en: string[] }
  techStack: string[]
}

export interface Project {
  name: LocaleString
  desc: LocaleString
  period: string
  techStack: string[]
  github: string | null
  demo: string | null
}

export interface Certification {
  name: LocaleString
  issuer: LocaleString
  date: string
  tag: string
}

export interface EducationPeriod {
  start: string
  end: string
}

export interface Education {
  institution: LocaleString
  major: LocaleString
  period: EducationPeriod
  gpa?: string
}

export interface ResumeData {
  meta: ProfileMeta
  profile: Profile
  skills: Skills
  experiences: Experience[]
  projects: Project[]
  certifications: Certification[]
  education: Education[]
  military: LocaleString
}
