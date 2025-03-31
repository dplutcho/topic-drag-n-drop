
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  topicName: z.string().min(2, {
    message: "Topic name must be at least 2 characters.",
  }),
  notes: z.string().min(10, {
    message: "Please explain why this topic should be added (min 10 characters).",
  }),
  categories: z.array(z.string()).optional(),
});

const categoryOptions = [
  { id: "Technology", label: "Topic" },
  { id: "Product", label: "Product" },
  { id: "General Topic", label: "Solution" },
];

const RequestTopicForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicName: "",
      notes: "",
      categories: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Topic request submitted:", values);
      toast.success("Topic request submitted", {
        description: "Thanks for your suggestion. We'll review it soon.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
        <MessageSquare className="h-4 w-4" />
        Request Missing Topic
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <FormField
              control={form.control}
              name="topicName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Topic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic name" {...field} className="h-8 text-sm" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-1">
                    <FormLabel className="text-xs">Category (optional)</FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Select the type of topic requested.
                    </FormDescription>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categoryOptions.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-center space-x-1.5 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValues, category.id])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== category.id
                                          )
                                        );
                                  }}
                                  className="h-3.5 w-3.5"
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal cursor-pointer">
                                {category.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Why is this topic needed?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please explain the topic and why it should be added" 
                      className="resize-none min-h-24 text-sm py-1.5"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="sm" 
              disabled={isSubmitting}
              className="text-xs h-7 px-3 py-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RequestTopicForm;
