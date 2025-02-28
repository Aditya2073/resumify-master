
import { useRef, useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { calculateATSScore } from "@/utils/resumeUtils";

import { Download, FileText, Info } from "lucide-react";
import AtsTemplate from "./resume-templates/AtsTemplate";
import html2pdf from "html2pdf.js";

interface ResumePreviewProps {
  scale?: number;
  simplified?: boolean;
}

const ResumePreview = ({ scale = 1, simplified = false }: ResumePreviewProps) => {
  const { resumeData, saveResumeData } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsAnalysisOpen, setAtsAnalysisOpen] = useState(false);

  const exportToPDF = () => {
    if (!resumeRef.current) return;

    toast.info("Preparing your PDF...");

    const resumeElement = resumeRef.current;
    const options = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `${resumeData.contactInfo.fullName.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(resumeElement)
      .set(options)
      .save()
      .then(() => {
        toast.success("Resume downloaded successfully");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to download resume");
      });
  };

  const analyzeATS = () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description for analysis");
      return;
    }

    const score = calculateATSScore(resumeData, jobDescription);
    setAtsScore(score);
    setAtsAnalysisOpen(true);
  };

  // If simplified is true, only render the resume content without tabs or buttons
  if (simplified) {
    return (
      <div 
        className="bg-white shadow-sm border border-gray-100 rounded-md overflow-hidden"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          height: scale < 1 ? '500px' : 'auto',
          overflow: 'hidden'
        }}
      >
        <div ref={resumeRef} className="bg-white p-4 w-full h-full">
          <AtsTemplate resumeData={resumeData} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="ats-optimization">ATS Optimization</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={saveResumeData} variant="outline" className="hover-scale">
              <FileText className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={exportToPDF} className="hover-scale">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="mt-0">
          <Card className="overflow-auto bg-white rounded-md shadow-md resume-drop-shadow p-0">
            <div 
              ref={resumeRef} 
              className="bg-white p-6 min-h-[29.7cm] w-[21cm] mx-auto"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            >
              <AtsTemplate resumeData={resumeData} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ats-optimization" className="mt-0">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 p-6 space-y-4">
              <div>
                <Label htmlFor="jobDescription" className="text-base font-medium">
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for ATS score analysis..."
                  className="h-64 mt-2"
                />
              </div>
              <Button onClick={analyzeATS} className="hover-scale">
                Analyze ATS Compatibility
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">ATS Optimization Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="space-y-1">
                  <h4 className="font-medium">Standard Headings</h4>
                  <p className="text-muted-foreground">Use clear, traditional section titles like "Experience," "Education," and "Skills".</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Simple Formatting</h4>
                  <p className="text-muted-foreground">Stick to a clean, single-column layout with standard fonts.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Relevant Keywords</h4>
                  <p className="text-muted-foreground">Include keywords and skills from the job description.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Avoid Graphics</h4>
                  <p className="text-muted-foreground">Don't use images, icons or graphs that can't be parsed.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">No Headers/Footers</h4>
                  <p className="text-muted-foreground">Keep all text in the main body of the document.</p>
                </div>
              </div>
            </Card>
          </div>

          <Dialog open={atsAnalysisOpen} onOpenChange={setAtsAnalysisOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>ATS Compatibility Analysis</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="relative w-32 h-32 mb-2">
                    <div 
                      className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-muted" 
                      style={{ 
                        background: `conic-gradient(#22c55e ${atsScore}%, #f3f4f6 0)` 
                      }}
                    >
                      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold">
                        {atsScore}%
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mt-2">
                    {atsScore && atsScore >= 90
                      ? "Excellent! Your resume is highly ATS-compatible."
                      : atsScore && atsScore >= 70
                      ? "Good! Your resume should pass most ATS systems."
                      : "Needs improvement to better pass ATS systems."}
                  </h3>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Improvement Tips:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {atsScore && atsScore < 100 && (
                      <>
                        {(!resumeData.skills.length || resumeData.skills.length < 5) && (
                          <li>Add more relevant skills that match the job description</li>
                        )}
                        {(!resumeData.experience.length || 
                          !resumeData.experience.some(e => e.achievements.length > 1)) && (
                          <li>Include more detailed achievements in your work experience</li>
                        )}
                        {(!resumeData.professionalSummary.summary || 
                          resumeData.professionalSummary.summary.length < 100) && (
                          <li>Expand your professional summary to include more relevant keywords</li>
                        )}
                        <li>Match your section titles to exactly what the ATS is looking for</li>
                        <li>Ensure your resume includes keywords from the job description</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumePreview;
