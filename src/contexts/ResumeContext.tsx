
import React, { createContext, useContext, useState, ReactNode } from "react";

// Resume data types
export type ContactInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
};

export type SkillItem = {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  id: string;
};

export type ExperienceItem = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  id: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  id: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  id: string;
};

export type ProfessionalSummary = {
  summary: string;
};

export interface ResumeData {
  contactInfo: ContactInfo;
  professionalSummary: ProfessionalSummary;
  skills: SkillItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

// Initial empty resume data
const initialResumeData: ResumeData = {
  contactInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  professionalSummary: {
    summary: "",
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
};

// Context type
type ResumeContextType = {
  resumeData: ResumeData;
  updateContactInfo: (contactInfo: ContactInfo) => void;
  updateProfessionalSummary: (summary: ProfessionalSummary) => void;
  updateSkills: (skills: SkillItem[]) => void;
  updateExperience: (experience: ExperienceItem[]) => void;
  updateEducation: (education: EducationItem[]) => void;
  updateProjects: (projects: ProjectItem[]) => void;
  clearResumeData: () => void;
  loadSavedData: () => boolean;
  saveResumeData: () => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  steps: string[];
};

// Create context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Provider component
export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    // Try to get saved data from localStorage on initial load
    const savedData = localStorage.getItem("resumeData");
    return savedData ? JSON.parse(savedData) : initialResumeData;
  });
  
  const steps = [
    "Contact",
    "Summary",
    "Skills",
    "Experience",
    "Education",
    "Projects",
    "Preview",
  ];
  
  const [activeStep, setActiveStep] = useState(0);

  const updateContactInfo = (contactInfo: ContactInfo) => {
    setResumeData((prev) => ({ ...prev, contactInfo }));
  };

  const updateProfessionalSummary = (professionalSummary: ProfessionalSummary) => {
    setResumeData((prev) => ({ ...prev, professionalSummary }));
  };

  const updateSkills = (skills: SkillItem[]) => {
    setResumeData((prev) => ({ ...prev, skills }));
  };

  const updateExperience = (experience: ExperienceItem[]) => {
    setResumeData((prev) => ({ ...prev, experience }));
  };

  const updateEducation = (education: EducationItem[]) => {
    setResumeData((prev) => ({ ...prev, education }));
  };

  const updateProjects = (projects: ProjectItem[]) => {
    setResumeData((prev) => ({ ...prev, projects }));
  };

  const clearResumeData = () => {
    setResumeData(initialResumeData);
    localStorage.removeItem("resumeData");
  };

  const loadSavedData = () => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      setResumeData(JSON.parse(savedData));
      return true;
    }
    return false;
  };

  const saveResumeData = () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updateContactInfo,
        updateProfessionalSummary,
        updateSkills,
        updateExperience,
        updateEducation,
        updateProjects,
        clearResumeData,
        loadSavedData,
        saveResumeData,
        activeStep,
        setActiveStep,
        steps,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook for using resume context
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
