import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Topic, TopicChild } from "@/data/topicsData";
import { cn } from "@/lib/utils";
import { getMarketShare } from "@/hooks/useMarketTopics";

interface TopicItemProps {
  topic: Topic;
  isDraggable?: boolean;
  inDropZone: boolean;
  onChildSelectionChange?: (topicId: string, childId: string, selected: boolean) => void;
}

const TopicItem = ({ 
  topic, 
  isDraggable = true, 
  inDropZone, 
  onChildSelectionChange 
}: TopicItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get the normalized market share percentage
  const marketShare = getMarketShare(topic.id);

  // Determine if the topic is beyond the relevance threshold
  const isLowRelevanceTopic = topic.name === 'APIs and microservices' || topic.name.localeCompare('APIs and microservices') >= 0;
  
  // Get topic visual status - for styling
  const getTopicStatus = () => {
    if (!isLowRelevanceTopic) return 'relevant';
    return 'low-relevance';
  };

  const topicStatus = getTopicStatus();


  const handleToggleExpand = () => {
    if (inDropZone) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleChildCheckboxChange = (childId: string, checked: boolean) => {
    if (onChildSelectionChange) {
      onChildSelectionChange(topic.id, childId, checked);
    }
  };

  return (
    <div 
      className={cn(
        "rounded-lg shadow-sm p-3 mb-2 border",
        topicStatus === 'low-relevance' 
          ? "bg-red-50 border-red-200" 
          : "bg-white border-slate-200",
        inDropZone 
          ? (topicStatus === 'low-relevance' 
              ? 'bg-red-50 border-red-200' 
              : 'hover:bg-slate-50 transition-colors') 
          : "",
        isDraggable ? "cursor-grab active:cursor-grabbing" : ""
      )}
    >
      <div 
        className="flex items-center justify-between"
        onClick={handleToggleExpand}
      >
        <div className="flex items-center flex-1">
          <span className={cn(
            "font-medium", 
            topicStatus === 'low-relevance' ? "text-red-700" : ""
          )}>
            {topic.name}
          </span>
          
          {topicStatus === 'low-relevance' && (
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
              Low Relevance
            </span>
          )}
          
          {!inDropZone && topic.similarity !== undefined && (
            <span className={cn(
              "ml-2 text-xs px-2 py-0.5 rounded-full",
              topicStatus === 'low-relevance' 
                ? "bg-red-100 text-red-800" 
                : "bg-blue-100 text-blue-800"
            )}>
              {topic.similarity.toFixed(1)}
            </span>
          )}
          {inDropZone && topic.children.length > 0 && (
            <button 
              className="ml-2 p-1 hover:bg-slate-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500" />
              )}
            </button>
          )}
        </div>

        {/* Only show market share for topics in the Core Topics box */}
        {inDropZone && topic.dropZoneId === "coreTopics" && (
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500" 
                  style={{ width: `${marketShare}%` }}
                ></div>
              </div>
              <span className="text-xs ml-1.5 text-slate-700">{marketShare}%</span>
            </div>
          </div>
        )}
      </div>

      {inDropZone && isExpanded && (
        <div className="mt-2 pl-4 border-l-2 border-slate-200">
          {topic.children.map((child: TopicChild) => (
            <div key={child.id} className="flex items-center py-1">
              <Checkbox
                id={child.id}
                checked={child.selected}
                onCheckedChange={(checked) => 
                  handleChildCheckboxChange(child.id, checked === true)
                }
                className="mr-2"
              />
              <label htmlFor={child.id} className="text-sm cursor-pointer">
                {child.name}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicItem;