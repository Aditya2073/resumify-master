
import { useState, useEffect } from "react";
import { useResume, EducationItem } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { TrashIcon, PlusCircle, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateId } from "@/utils/resumeUtils";

const EducationForm = () => {
  const { resumeData, updateEducation, saveResumeData } = useResume();
  const [educations, setEducations] = useState<EducationItem[]>(resumeData.education);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEducations(resumeData.education);
  }, [resumeData.education]);

  const resetForm = () => {
    setEditingEducation({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      id: generateId(),
    });
    setFormErrors({});
  };

  const handleAddEducation = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditEducation = (education: EducationItem) => {
    setEditingEducation({
      ...education,
    });
    setDialogOpen(true);
  };

  const handleRemoveEducation = (id: string) => {
    const updatedEducations = educations.filter((edu) => edu.id !== id);
    setEducations(updatedEducations);
    updateEducation(updatedEducations);
    saveResumeData();
    toast.success("Education removed");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editingEducation?.institution) {
      errors.institution = "Institution name is required";
    }
    
    if (!editingEducation?.degree) {
      errors.degree = "Degree is required";
    }
    
    if (!editingEducation?.field) {
      errors.field = "Field of study is required";
    }
    
    if (!editingEducation?.startDate) {
      errors.startDate = "Start date is required";
    }
    
    if (!editingEducation?.current && !editingEducation?.endDate) {
      errors.endDate = "End date is required for completed education";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEducation = () => {
    if (!validateForm()) return;
    
    let updatedEducations: EducationItem[];
    if (educations.some((edu) => edu.id === editingEducation!.id)) {
      // Update existing education
      updatedEducations = educations.map((edu) =>
        edu.id === editingEducation!.id ? editingEducation! : edu
      );
    } else {
      // Add new education
      updatedEducations = [...educations, editingEducation!];
    }
    
    setEducations(updatedEducations);
    updateEducation(updatedEducations);
    saveResumeData();
    setDialogOpen(false);
    toast.success("Education saved");
  };

  const handleSaveAllEducations = () => {
    updateEducation(educations);
    saveResumeData();
    toast.success("All education saved");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Education</CardTitle>
        <CardDescription>
          Add your educational background, including degrees and certifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Button
            type="button"
            onClick={handleAddEducation}
            variant="outline"
            className="w-full hover-scale transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add Education
          </Button>

          {educations.length === 0 ? (
            <Alert className="bg-muted">
              <AlertDescription>
                No education added yet. Add your degrees, certifications, or relevant coursework.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {educations.map((education) => (
                <Card key={education.id} className="overflow-hidden transition-all hover:border-primary duration-200">
                  <CardHeader className="py-4 px-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{education.degree} in {education.field}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {education.institution}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEducation(education)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(education.id)}
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
                        {new Date(education.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                        {" - "}
                        {education.current
                          ? "Present"
                          : new Date(education.endDate).toLocaleDateString('en-US', { 
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
      {educations.length > 0 && (
        <CardFooter>
          <Button type="button" onClick={handleSaveAllEducations} className="hover-scale">
            Save All Education
          </Button>
        </CardFooter>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingEducation?.institution ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution/School *</Label>
                <Input
                  id="institution"
                  value={editingEducation?.institution || ""}
                  onChange={(e) =>
                    setEditingEducation(prev => ({
                      ...prev!,
                      institution: e.target.value,
                    }))
                  }
                  placeholder="University or institution name"
                  className="transition-all duration-200 focus:ring-2"
                />
                {formErrors.institution && (
                  <p className="text-sm text-red-500">{formErrors.institution}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree/Certificate *</Label>
                  <Input
                    id="degree"
                    value={editingEducation?.degree || ""}
                    onChange={(e) =>
                      setEditingEducation(prev => ({
                        ...prev!,
                        degree: e.target.value,
                      }))
                    }
                    placeholder="Bachelor of Science, Certificate, etc."
                    className="transition-all duration-200 focus:ring-2"
                  />
                  {formErrors.degree && (
                    <p className="text-sm text-red-500">{formErrors.degree}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study *</Label>
                  <Input
                    id="field"
                    value={editingEducation?.field || ""}
                    onChange={(e) =>
                      setEditingEducation(prev => ({
                        ...prev!,
                        field: e.target.value,
                      }))
                    }
                    placeholder="Computer Science, Business, etc."
                    className="transition-all duration-200 focus:ring-2"
                  />
                  {formErrors.field && (
                    <p className="text-sm text-red-500">{formErrors.field}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eduStartDate">Start Date *</Label>
                  <Input
                    id="eduStartDate"
                    type="month"
                    value={editingEducation?.startDate || ""}
                    onChange={(e) =>
                      setEditingEducation(prev => ({
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
                    <Label htmlFor="eduEndDate">End Date</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="eduCurrent"
                        checked={editingEducation?.current || false}
                        onCheckedChange={(checked) =>
                          setEditingEducation(prev => ({
                            ...prev!,
                            current: checked === true,
                          }))
                        }
                      />
                      <label
                        htmlFor="eduCurrent"
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Currently Enrolled
                      </label>
                    </div>
                  </div>
                  <Input
                    id="eduEndDate"
                    type="month"
                    value={editingEducation?.endDate || ""}
                    onChange={(e) =>
                      setEditingEducation(prev => ({
                        ...prev!,
                        endDate: e.target.value,
                      }))
                    }
                    disabled={editingEducation?.current || false}
                    className="transition-all duration-200 focus:ring-2"
                  />
                  {formErrors.endDate && (
                    <p className="text-sm text-red-500">{formErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eduDescription">Additional Information (Optional)</Label>
                <Textarea
                  id="eduDescription"
                  value={editingEducation?.description || ""}
                  onChange={(e) =>
                    setEditingEducation(prev => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Relevant coursework, achievements, GPA, honors, activities, etc."
                  className="h-24 transition-all duration-200 focus:ring-2"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveEducation}>
              Save Education
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EducationForm;
