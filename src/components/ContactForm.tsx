
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContactInfo, useResume } from "@/contexts/ResumeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ContactForm = () => {
  const { resumeData, updateContactInfo, saveResumeData } = useResume();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInfo>({
    defaultValues: resumeData.contactInfo,
  });

  useEffect(() => {
    reset(resumeData.contactInfo);
  }, [reset, resumeData.contactInfo]);

  const onSubmit = (data: ContactInfo) => {
    updateContactInfo(data);
    saveResumeData();
    toast.success("Contact information saved");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Contact Information</CardTitle>
        <CardDescription>
          This information will appear at the top of your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                {...register("fullName", { required: "Name is required" })}
                placeholder="John Doe"
                className="transition-all duration-200 focus:ring-2"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="john.doe@example.com"
                  className="transition-all duration-200 focus:ring-2"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="(555) 123-4567"
                  className="transition-all duration-200 focus:ring-2"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("location", { required: "Location is required" })}
                placeholder="City, State, Country"
                className="transition-all duration-200 focus:ring-2"
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (optional)</Label>
              <Input
                id="linkedin"
                {...register("linkedin")}
                placeholder="linkedin.com/in/johndoe"
                className="transition-all duration-200 focus:ring-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website (optional)</Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="johndoe.com"
                className="transition-all duration-200 focus:ring-2"
              />
            </div>
          </div>

          <Button type="submit" className="hover-scale">
            Save Contact Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
