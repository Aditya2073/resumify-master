
import React from "react";
import { ResumeProvider } from "@/contexts/ResumeContext";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

const Resume = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    const previewComponent = document.getElementById('resume-preview');
    if (previewComponent) {
      toast({
        title: "Generating PDF",
        description: "Your resume is being prepared for download"
      });
    }
  };

  return (
    <ResumeProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Editor
            </Button>
          </Link>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download size={16} />
            Download PDF
          </Button>
        </div>

        <div className="mx-auto max-w-4xl bg-white p-8 rounded-lg resume-drop-shadow">
          <ResumePreview />
        </div>
      </div>
    </ResumeProvider>
  );
};

export default Resume;
