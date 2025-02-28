
import { useState, useEffect } from "react";
import { useResume, SkillItem } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, PlusCircle } from "lucide-react";
import { generateId, getSkillLevelClass } from "@/utils/resumeUtils";
import { Badge } from "@/components/ui/badge";

const SkillsForm = () => {
  const { resumeData, updateSkills, saveResumeData } = useResume();
  const [skills, setSkills] = useState<SkillItem[]>(resumeData.skills);
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert">("Intermediate");

  useEffect(() => {
    setSkills(resumeData.skills);
  }, [resumeData.skills]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    const skillExists = skills.some(
      (skill) => skill.name.toLowerCase() === newSkill.toLowerCase()
    );

    if (skillExists) {
      toast.error("This skill already exists");
      return;
    }

    const newSkillItem: SkillItem = {
      name: newSkill.trim(),
      level: newLevel,
      id: generateId(),
    };

    const updatedSkills = [...skills, newSkillItem];
    setSkills(updatedSkills);
    updateSkills(updatedSkills);
    saveResumeData();
    setNewSkill("");
    toast.success("Skill added");
  };

  const handleRemoveSkill = (id: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== id);
    setSkills(updatedSkills);
    updateSkills(updatedSkills);
    saveResumeData();
    toast.success("Skill removed");
  };

  const handleSaveSkills = () => {
    updateSkills(skills);
    saveResumeData();
    toast.success("Skills saved");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Skills</CardTitle>
        <CardDescription>
          Add your technical and soft skills with proficiency levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label htmlFor="newSkill">New Skill</Label>
                <Input
                  id="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., JavaScript, Project Management"
                  className="transition-all duration-200 focus:ring-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="skillLevel">Level</Label>
                <Select 
                  value={newLevel} 
                  onValueChange={(value) => setNewLevel(value as any)}
                >
                  <SelectTrigger id="skillLevel" className="transition-all duration-200 focus:ring-2">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={handleAddSkill}
              variant="outline"
              className="w-full hover-scale transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="text-md font-medium">Your Skills</h3>
            
            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    className={`text-sm py-1.5 px-3 font-normal flex items-center gap-1 ${getSkillLevelClass(skill.level)}`}
                  >
                    {skill.name} · {skill.level}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="ml-1 hover:text-red-400 transition-colors"
                      aria-label={`Remove ${skill.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <Button 
              type="button" 
              onClick={handleSaveSkills}
              className="hover-scale"
              disabled={skills.length === 0}
            >
              Save Skills
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsForm;
