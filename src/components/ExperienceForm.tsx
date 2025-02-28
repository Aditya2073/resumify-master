
import { useState, useEffect } from "react";
import { useResume, ExperienceItem } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { TrashIcon, PlusCircle, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { generateId } from "@/utils/resumeUtils";

const ExperienceForm = () => {
  const { resumeData, updateExperience, saveResumeData } = useResume();
  const [experiences, setExperiences] = useState<ExperienceItem[]>(resumeData.experience);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setExperiences(resumeData.experience);
  }, [resumeData.experience]);

  const resetForm = () => {
    setEditingExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [""],
      id: generateId(),
    });
    setFormErrors({});
  };

  const handleAddExperience = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditExperience = (experience: ExperienceItem) => {
    setEditingExperience({
      ...experience,
      achievements: experience.achievements.length ? experience.achievements : [""],
    });
    setDialogOpen(true);
  };

  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    updateExperience(updatedExperiences);
    saveResumeData();
    toast.success("Experience removed");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editingExperience?.company) {
      errors.company = "Company name is required";
    }
    
    if (!editingExperience?.position) {
      errors.position = "Position is required";
    }
    
    if (!editingExperience?.startDate) {
      errors.startDate = "Start date is required";
    }
    
    if (!editingExperience?.current && !editingExperience?.endDate) {
      errors.endDate = "End date is required for past positions";
    }
    
    if (!editingExperience?.description) {
      errors.description = "Description is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveExperience = () => {
    if (!validateForm()) return;
    
    // Filter out empty achievements
    const filteredAchievements = (editingExperience?.achievements || []).filter(
      (achievement) => achievement.trim() !== ""
    );
    
    const updatedExperience: ExperienceItem = {
      ...editingExperience!,
      achievements: filteredAchievements,
    };
    
    let updatedExperiences: ExperienceItem[];
    if (experiences.some((exp) => exp.id === updatedExperience.id)) {
      // Update existing experience
      updatedExperiences = experiences.map((exp) =>
        exp.id === updatedExperience.id ? updatedExperience : exp
      );
    } else {
      // Add new experience
      updatedExperiences = [...experiences, updatedExperience];
    }
    
    setExperiences(updatedExperiences);
    updateExperience(updatedExperiences);
    saveResumeData();
    setDialogOpen(false);
    toast.success("Experience saved");
  };

  const handleAddAchievement = () => {
    if (editingExperience) {
      setEditingExperience({
        ...editingExperience,
        achievements: [...editingExperience.achievements, ""],
      });
    }
  };

  const handleRemoveAchievement = (index: number) => {
    if (editingExperience) {
      const newAchievements = [...editingExperience.achievements];
      newAchievements.splice(index, 1);
      setEditingExperience({
        ...editingExperience,
        achievements: newAchievements.length ? newAchievements : [""],
      });
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    if (editingExperience) {
      const newAchievements = [...editingExperience.achievements];
      newAchievements[index] = value;
      setEditingExperience({
        ...editingExperience,
        achievements: newAchievements,
      });
    }
  };

  const handleSaveAllExperiences = () => {
    updateExperience(experiences);
    saveResumeData();
    toast.success("All experiences saved");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Work Experience</CardTitle>
        <CardDescription>
          Add your relevant work experience, focusing on achievements and responsibilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Button
            type="button"
            onClick={handleAddExperience}
            variant="outline"
            className="w-full hover-scale transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
          </Button>

          {experiences.length === 0 ? (
            <Alert className="bg-muted">
              <AlertDescription>
                No work experience added yet. Add your most relevant positions.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <Card key={experience.id} className="overflow-hidden transition-all hover:border-primary duration-200">
                  <CardHeader className="py-4 px-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{experience.position}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {experience.company}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExperience(experience)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExperience(experience.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {new Date(experience.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                        {" - "}
                        {experience.current
                          ? "Present"
                          : new Date(experience.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      {experiences.length > 0 && (
        <CardFooter>
          <Button type="button" onClick={handleSaveAllExperiences} className="hover-scale">
            Save All Experiences
          </Button>
        </CardFooter>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingExperience?.company ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-5 px-1 py-2">
              <div className="grid grid-cols-1 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization *</Label>
                  <Input
                    id="company"
                    value={editingExperience?.company || ""}
                    onChange={(e) =>
                      setEditingExperience(prev => ({
                        ...prev!,
                        company: e.target.value,
                      }))
                    }
                    placeholder="Company name"
                    className="transition-all duration-200 focus:ring-2"
                  />
                  {formErrors.company && (
                    <p className="text-sm text-red-500">{formErrors.company}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Title *</Label>
                  <Input
                    id="position"
                    value={editingExperience?.position || ""}
                    onChange={(e) =>
                      setEditingExperience(prev => ({
                        ...prev!,
                        position: e.target.value,
                      }))
                    }
                    placeholder="Your job title"
                    className="transition-all duration-200 focus:ring-2"
                  />
                  {formErrors.position && (
                    <p className="text-sm text-red-500">{formErrors.position}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="month"
                      value={editingExperience?.startDate || ""}
                      onChange={(e) =>
                        setEditingExperience(prev => ({
                          ...prev!,
                          startDate: e.target.value,
                        }))
                      }
                      className="transition-all duration-200 focus:ring-2"
                    />
                    {formErrors.startDate && (
                      <p className="text-sm text-red-500">{formErrors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="current"
                          checked={editingExperience?.current || false}
                          onCheckedChange={(checked) =>
                            setEditingExperience(prev => ({
                              ...prev!,
                              current: checked === true,
                            }))
                          }
                        />
                        <label
                          htmlFor="current"
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Current Position
                        </label>
                      </div>
                    </div>
                    <Input
                      id="endDate"
                      type="month"
                      value={editingExperience?.endDate || ""}
                      onChange={(e) =>
                        setEditingExperience(prev => ({
                          ...prev!,
                          endDate: e.target.value,
                        }))
                      }
                      disabled={editingExperience?.current || false}
                      className="transition-all duration-200 focus:ring-2"
                    />
                    {formErrors.endDate && (
                      <p className="text-sm text-red-500">{formErrors.endDate}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={editingExperience?.description || ""}
                    onChange={(e) =>
                      setEditingExperience(prev => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your role and responsibilities"
                    className="h-24 transition-all duration-200 focus:ring-2"
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>

                <div className="pt-2">
                  <h3 className="font-medium mb-3">Key Achievements</h3>
                  <div className="space-y-3">
                    {editingExperience?.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Textarea
                          value={achievement}
                          onChange={(e) => handleAchievementChange(index, e.target.value)}
                          placeholder="e.g., Increased sales by 20% through implementation of new strategy"
                          className="flex-1 h-20 transition-all duration-200 focus:ring-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAchievement(index)}
                          disabled={editingExperience.achievements.length === 1}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAchievement}
                      className="w-full hover-scale transition-all duration-200"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Achievement
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tip: Start with strong action verbs and include metrics when possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveExperience}>
              Save Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExperienceForm;
