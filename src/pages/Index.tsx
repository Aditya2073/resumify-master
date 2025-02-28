
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeProvider } from "@/contexts/ResumeContext";
import SummaryForm from "@/components/SummaryForm";
import ContactForm from "@/components/ContactForm";
import EducationForm from "@/components/EducationForm";
import ExperienceForm from "@/components/ExperienceForm";
import SkillsForm from "@/components/SkillsForm";
import ProjectsForm from "@/components/ProjectsForm";
import ResumePreview from "@/components/ResumePreview";
import { useToast } from "@/components/ui/use-toast";
import { Download, ArrowLeft, ArrowRight } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("contact");
  const { toast } = useToast();

  const tabs = [
    { id: "contact", label: "Contact Info" },
    { id: "summary", label: "Summary" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "preview", label: "Preview" },
  ];

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      toast({
        title: "Progress saved",
        description: `Moved to ${tabs[currentIndex + 1].label} section`,
      });
    }
  };

  const handlePrevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  return (
    <ResumeProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Resumify</h1>
          <p className="text-xl text-muted-foreground">
            Build an ATS-optimized resume in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-7 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Card>
                <CardContent className="pt-6">
                  <TabsContent value="contact">
                    <ContactForm />
                  </TabsContent>
                  <TabsContent value="summary">
                    <SummaryForm />
                  </TabsContent>
                  <TabsContent value="education">
                    <EducationForm />
                  </TabsContent>
                  <TabsContent value="experience">
                    <ExperienceForm />
                  </TabsContent>
                  <TabsContent value="skills">
                    <SkillsForm />
                  </TabsContent>
                  <TabsContent value="projects">
                    <ProjectsForm />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="flex flex-col items-center">
                      <h2 className="text-2xl font-bold mb-6">Resume Preview</h2>
                      <div className="mb-6 w-full">
                        <ResumePreview />
                      </div>
                    </div>
                  </TabsContent>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevTab}
                      disabled={activeTab === "contact"}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    {activeTab !== "preview" ? (
                      <Button onClick={handleNextTab} className="flex items-center">
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        onClick={() => {
                          const resumePreviewComponent = document.getElementById('resume-preview');
                          if (resumePreviewComponent) {
                            toast({
                              title: "Generating PDF",
                              description: "Your resume is being prepared for download"
                            });
                          }
                        }}
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
              <div className="border border-border rounded-lg p-4 resume-drop-shadow bg-white flex items-center justify-center">
                <ResumePreview scale={0.6} simplified={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
};

export default Index;
