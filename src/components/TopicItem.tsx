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

  // Special rendering for divider item
  if (topic.divider) {
    return (
      <div className={topic.className || "py-2 my-2 border-t-4 border-red-600 text-center text-red-600 font-bold"}>
        {topic.name}
      </div>
    );
  }

  // Calculate background color based on similarity score
  const getBackgroundColor = () => {
    if (inDropZone || topic.similarity === undefined) return "bg-white";
    
    // Convert similarity (0.0-1.0) to color
    if (topic.similarity >= 0.7) {
      // Green gradient for high similarity (0.7-1.0)
      return "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500";
    } else if (topic.similarity >= 0.4) {
      // Yellow gradient for medium similarity (0.4-0.69)
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500";
    } else {
      // Red gradient for low similarity (0.0-0.39)
      return "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500";
    }
  };

  return (
    <div 
      className={cn(
        getBackgroundColor(),
        "rounded-lg shadow-sm p-3 mb-2 border border-slate-200",
        inDropZone ? "hover:bg-slate-50 transition-colors" : "",
        isDraggable ? "cursor-grab active:cursor-grabbing" : ""
      )}
    >
      <div 
        className="flex items-center justify-between"
        onClick={handleToggleExpand}
      >
        <div className="flex items-center flex-1">
          <span className="font-medium">{topic.name}</span>
          {!inDropZone && topic.similarity !== undefined && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              topic.similarity >= 0.7 
                ? "bg-green-100 text-green-800" 
                : topic.similarity >= 0.4 
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}>
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