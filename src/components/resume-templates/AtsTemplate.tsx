
import { ResumeData } from "@/contexts/ResumeContext";
import { getSkillLevelClass } from "@/utils/resumeUtils";

interface AtsTemplateProps {
  resumeData: ResumeData;
}

const AtsTemplate = ({ resumeData }: AtsTemplateProps) => {
  const { contactInfo, professionalSummary, skills, experience, education, projects } = resumeData;

  return (
    <div className="text-black text-left">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{contactInfo.fullName}</h1>
        <div className="flex flex-wrap gap-x-3 text-sm">
          {contactInfo.email && <span>{contactInfo.email}</span>}
          {contactInfo.phone && (
            <>
              <span className="text-gray-400">•</span>
              <span>{contactInfo.phone}</span>
            </>
          )}
          {contactInfo.location && (
            <>
              <span className="text-gray-400">•</span>
              <span>{contactInfo.location}</span>
            </>
          )}
          {contactInfo.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <a href={contactInfo.linkedin} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {contactInfo.website && (
            <>
              <span className="text-gray-400">•</span>
              <a href={contactInfo.website} className="text-blue-600 hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {professionalSummary.summary && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm">{professionalSummary.summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-gray-100"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold">{exp.position}</h3>
                  <span className="text-xs text-gray-600">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                    {" – "}
                    {exp.current
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                    }
                  </span>
                </div>
                <p className="text-xs font-medium">{exp.company}</p>
                <p className="text-xs mt-1">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="text-xs">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-xs text-gray-600">
                    {new Date(edu.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                    {" – "}
                    {edu.current
                      ? "Present"
                      : new Date(edu.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                    }
                  </span>
                </div>
                <p className="text-xs font-medium">{edu.institution}</p>
                {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold">{project.title}</h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-xs text-gray-600">
                      {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                      {project.startDate && project.endDate && " – "}
                      {project.endDate && new Date(project.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-xs text-gray-600">Technologies:</span>
                    <span className="text-xs">{project.technologies.join(", ")}</span>
                  </div>
                )}
                {project.link && (
                  <div className="mt-1">
                    <a href={project.link} className="text-xs text-blue-600 hover:underline">
                      {project.link}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AtsTemplate;
