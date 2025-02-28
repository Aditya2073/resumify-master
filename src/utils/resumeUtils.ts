
import { ResumeData } from "@/contexts/ResumeContext";

// Generate unique IDs for items
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Format a date for display (MM/YYYY)
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Check if a section of the resume has valid data
export const isSectionComplete = (
  section: string,
  resumeData: ResumeData
): boolean => {
  switch (section) {
    case "Contact":
      const { fullName, email, phone, location } = resumeData.contactInfo;
      return !!fullName && !!email && !!phone && !!location;
    case "Summary":
      return !!resumeData.professionalSummary.summary;
    case "Skills":
      return resumeData.skills.length > 0;
    case "Experience":
      return resumeData.experience.length > 0;
    case "Education":
      return resumeData.education.length > 0;
    case "Projects":
      return resumeData.projects.length > 0;
    default:
      return false;
  }
};

// Calculate the overall progress of the resume
export const calculateProgress = (resumeData: ResumeData): number => {
  const sections = ["Contact", "Summary", "Skills", "Experience", "Education", "Projects"];
  const completedSections = sections.filter((section) =>
    isSectionComplete(section, resumeData)
  );
  return Math.round((completedSections.length / sections.length) * 100);
};

// Calculate ATS score based on various factors
export const calculateATSScore = (resumeData: ResumeData, jobDescription?: string): number => {
  let score = 0;
  const maxScore = 100;
  
  // Contact info complete: +15 points
  if (isSectionComplete("Contact", resumeData)) {
    score += 15;
  }
  
  // Has professional summary: +10 points
  if (isSectionComplete("Summary", resumeData)) {
    score += 10;
  }
  
  // Skills section (up to 15 points)
  if (resumeData.skills.length > 0) {
    score += Math.min(resumeData.skills.length * 3, 15);
  }
  
  // Experience section (up to 25 points)
  const expCount = resumeData.experience.length;
  if (expCount > 0) {
    // Basic points for having experiences
    score += Math.min(expCount * 5, 15);
    
    // Additional points for detailed achievements
    const hasDetailedAchievements = resumeData.experience.some(
      exp => exp.achievements && exp.achievements.length > 1
    );
    if (hasDetailedAchievements) score += 10;
  }
  
  // Education section (up to 15 points)
  if (resumeData.education.length > 0) {
    score += Math.min(resumeData.education.length * 7.5, 15);
  }
  
  // Projects section (up to 10 points)
  if (resumeData.projects.length > 0) {
    score += Math.min(resumeData.projects.length * 5, 10);
  }
  
  // If job description provided, check for keyword matching (up to 10 points)
  if (jobDescription) {
    const keywordScore = analyzeKeywordMatch(resumeData, jobDescription);
    score += keywordScore;
  } else {
    // If no job description, give average score for this section
    score += 5;
  }
  
  return Math.min(Math.round(score), maxScore);
};

// Keyword analysis (simplified version)
const analyzeKeywordMatch = (resumeData: ResumeData, jobDescription: string): number => {
  // Extract keywords from job description (simplified approach)
  const descLower = jobDescription.toLowerCase();
  let matchScore = 0;
  
  // Check if skills are mentioned in job description
  resumeData.skills.forEach(skill => {
    if (descLower.includes(skill.name.toLowerCase())) {
      matchScore += 1;
    }
  });
  
  // Check for job title matches in experience
  resumeData.experience.forEach(exp => {
    if (descLower.includes(exp.position.toLowerCase())) {
      matchScore += 0.5;
    }
  });
  
  // Calculate final score (max 10)
  return Math.min(matchScore, 10);
};

// Format skills for display based on level
export const getSkillLevelClass = (level: string): string => {
  switch (level) {
    case "Beginner":
      return "bg-slate-200 text-slate-800";
    case "Intermediate":
      return "bg-slate-300 text-slate-800";
    case "Advanced":
      return "bg-slate-400 text-slate-800";
    case "Expert":
      return "bg-slate-500 text-white";
    default:
      return "bg-slate-200 text-slate-800";
  }
};
