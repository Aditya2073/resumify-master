
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProfessionalSummary, useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SummaryForm = () => {
  const { resumeData, updateProfessionalSummary, saveResumeData } = useResume();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfessionalSummary>({
    defaultValues: resumeData.professionalSummary,
  });

  useEffect(() => {
    reset(resumeData.professionalSummary);
  }, [reset, resumeData.professionalSummary]);

  const onSubmit = (data: ProfessionalSummary) => {
    updateProfessionalSummary(data);
    saveResumeData();
    toast.success("Professional summary saved");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Professional Summary</CardTitle>
        <CardDescription>
          Write a compelling summary that highlights your expertise and career goals.
          Keep it concise (3-5 sentences) and tailored to your target role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              {...register("summary", {
                required: "Professional summary is required",
                minLength: {
                  value: 50,
                  message: "Summary should be at least 50 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Summary should not exceed 500 characters",
                },
              })}
              placeholder="Experienced software developer with 5+ years of expertise in building scalable web applications using React and Node.js. Passionate about creating intuitive user interfaces and optimizing application performance. Proven track record of delivering projects on time and mentoring junior developers."
              className="h-40 transition-all duration-200 focus:ring-2"
            />
            {errors.summary && (
              <p className="text-sm text-red-500">{errors.summary.message}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Tip: Focus on your most relevant skills and achievements. Use keywords from job descriptions you're targeting.
            </p>
          </div>

          <Button type="submit" className="hover-scale">
            Save Professional Summary
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SummaryForm;
