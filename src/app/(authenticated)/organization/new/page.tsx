'use client';
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { createOrganization } from '@/server/action/organization'; // Adjust import path
import { useToast } from '@/hooks/use-toast';
import { Toaster } from "@/components/ui/toaster";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema
const organizationSchema = z.object({
  name: z.string()
    .min(2, { message: "Organization name must be at least 2 characters" })
    .max(50, { message: "Organization name must be less than 50 characters" }),
  slug: z.string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug must be lowercase, alphanumeric, or hyphen" }),
  description: z.string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  website: z.string()
    .optional(),
  logo: z.string()
    .optional()
});

export default function CreateOrganizationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      website: "",
      logo: ""
    }
  });

  // Generate slug automatically from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with hyphen
      .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof organizationSchema>) => {
    setIsSubmitting(true);
    
    try {
      const result = await createOrganization(values);
      console.log(result);
      if (result) {
        localStorage.setItem('organization', JSON.stringify(result._id));
        toast({
          title: "Organization Created",
          description: `${values.name} has been successfully created.`,
          variant: "default"
        });
        
        // Reset form after successful submission
        form.reset();
      } else {
        toast({
          title: "Error",
          description: "Failed to create organization",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md bg-background-secondary">
        <CardHeader>
          <CardTitle>Create New Organization</CardTitle>
          <CardDescription>
            Enter details to create a new organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter organization name" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Automatically generate slug
                          form.setValue('slug', generateSlug(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Organization slug" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier for your organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description (Optional) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of the organization" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website (Optional) */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo (Optional) */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/logo.png" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Organization"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}