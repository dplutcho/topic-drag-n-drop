
import { Topic } from "@/data/topicsData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TopicOutputGeneratorProps {
  coreTopics: Topic[];
  supportiveTopics: Topic[];
}

const TopicOutputGenerator = ({ coreTopics, supportiveTopics }: TopicOutputGeneratorProps) => {
  const generateOutput = () => {
    const output = {
      coreTopics: coreTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        children: topic.children.filter(child => child.selected).map(child => ({
          id: child.id,
          name: child.name
        }))
      })),
      supportiveTopics: supportiveTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        children: topic.children.filter(child => child.selected).map(child => ({
          id: child.id,
          name: child.name
        }))
      }))
    };
    
    console.log(JSON.stringify(output, null, 2));
    toast.success("Market topic selection data generated!", {
      description: "Check the console (F12) to see the JSON data."
    });
  };

  return (
    <div className="mt-8 text-center">
      <Button 
        size="lg" 
        onClick={generateOutput}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        Generate Audience Analytics
      </Button>
    </div>
  );
};

export default TopicOutputGenerator;
