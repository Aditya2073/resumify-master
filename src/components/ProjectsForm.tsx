
import { useState, useEffect } from "react";
import { useResume, ProjectItem } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { TrashIcon, PlusCircle, Pencil, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateId } from "@/utils/resumeUtils";

const ProjectsForm = () => {
  const { resumeData, updateProjects, saveResumeData } = useResume();
  const [projects, setProjects] = useState<ProjectItem[]>(resumeData.projects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newTechnology, setNewTechnology] = useState("");

  useEffect(() => {
    setProjects(resumeData.projects);
  }, [resumeData.projects]);

  const resetForm = () => {
    setEditingProject({
      title: "",
      description: "",
      technologies: [],
      link: "",
      startDate: "",
      endDate: "",
      id: generateId(),
    });
    setFormErrors({});
  };

  const handleAddProject = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditProject = (project: ProjectItem) => {
    setEditingProject({
      ...project,
    });
    setDialogOpen(true);
  };

  const handleRemoveProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    updateProjects(updatedProjects);
    saveResumeData();
    toast.success("Project removed");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editingProject?.title) {
      errors.title = "Project title is required";
    }
    
    if (!editingProject?.description) {
      errors.description = "Project description is required";
    }
    
    if (editingProject?.technologies.length === 0) {
      errors.technologies = "Add at least one technology";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProject = () => {
    if (!validateForm()) return;
    
    let updatedProjects: ProjectItem[];
    if (projects.some((proj) => proj.id === editingProject!.id)) {
      // Update existing project
      updatedProjects = projects.map((proj) =>
        proj.id === editingProject!.id ? editingProject! : proj
      );
    } else {
      // Add new project
      updatedProjects = [...projects, editingProject!];
    }
    
    setProjects(updatedProjects);
    updateProjects(updatedProjects);
    saveResumeData();
    setDialogOpen(false);
    toast.success("Project saved");
  };

  const handleAddTechnology = () => {
    if (!newTechnology.trim()) {
      return;
    }
    
    if (editingProject) {
      if (editingProject.technologies.includes(newTechnology.trim())) {
        toast.error("This technology is already added");
        return;
      }
      
      setEditingProject({
        ...editingProject,
        technologies: [...editingProject.technologies, newTechnology.trim()],
      });
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        technologies: editingProject.technologies.filter((t) => t !== tech),
      });
    }
  };

  const handleSaveAllProjects = () => {
    updateProjects(projects);
    saveResumeData();
    toast.success("All projects saved");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Projects</CardTitle>
        <CardDescription>
          Add projects that showcase your skills and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Button
            type="button"
            onClick={handleAddProject}
            variant="outline"
            className="w-full hover-scale transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Project
          </Button>

          {projects.length === 0 ? (
            <Alert className="bg-muted">
              <AlertDescription>
                No projects added yet. Add projects that highlight your skills and accomplishments.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all hover:border-primary duration-200">
                  <CardHeader className="py-4 px-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="text-base mt-1 line-clamp-1">
                          {project.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProject(project.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0 px-5 pb-4">
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      {projects.length > 0 && (
        <CardFooter>
          <Button type="button" onClick={handleSaveAllProjects} className="hover-scale">
            Save All Projects
          </Button>
        </CardFooter>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.title ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={editingProject?.title || ""}
                  onChange={(e) =>
                    setEditingProject(prev => ({
                      ...prev!,
                      title: e.target.value,
                    }))
                  }
                  placeholder="E-commerce Website, Mobile App, etc."
                  className="transition-all duration-200 focus:ring-2"
                />
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={editingProject?.description || ""}
                  onChange={(e) =>
                    setEditingProject(prev => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what the project does and your role in it"
                  className="h-24 transition-all duration-200 focus:ring-2"
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Project Link (Optional)</Label>
                <Input
                  id="link"
                  value={editingProject?.link || ""}
                  onChange={(e) =>
                    setEditingProject(prev => ({
                      ...prev!,
                      link: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/yourusername/project"
                  className="transition-all duration-200 focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projStartDate">Start Date (Optional)</Label>
                  <Input
                    id="projStartDate"
                    type="month"
                    value={editingProject?.startDate || ""}
                    onChange={(e) =>
                      setEditingProject(prev => ({
                        ...prev!,
                        startDate: e.target.value,
                      }))
                    }
                    className="transition-all duration-200 focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projEndDate">End Date (Optional)</Label>
                  <Input
                    id="projEndDate"
                    type="month"
                    value={editingProject?.endDate || ""}
                    onChange={(e) =>
                      setEditingProject(prev => ({
                        ...prev!,
                        endDate: e.target.value,
                      }))
                    }
                    className="transition-all duration-200 focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="technologies">Technologies Used *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="technologies"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="React, Python, AWS, etc."
                    className="transition-all duration-200 focus:ring-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTechnology}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
                {formErrors.technologies && (
                  <p className="text-sm text-red-500">{formErrors.technologies}</p>
                )}
                
                {editingProject?.technologies && editingProject.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editingProject.technologies.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-slate-100"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="ml-1 text-slate-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No technologies added yet
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveProject}>
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectsForm;
