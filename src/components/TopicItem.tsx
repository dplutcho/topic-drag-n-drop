
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Topic, TopicChild } from "@/data/topicsData";
import { cn } from "@/lib/utils";

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
  
  // Generate a random but consistent market share percentage for each topic
  const getMarketShare = () => {
    // Create a hash-like value from the topic id to ensure consistency for each topic
    let hash = 0;
    for (let i = 0; i < topic.id.length; i++) {
      hash = ((hash << 5) - hash) + topic.id.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Use the hash to generate a value between 0 and 1
    const normalizedValue = (Math.abs(hash) % 1000) / 1000;
    
    // Apply a bell curve approximation
    // This uses the Box-Muller transform to create a normal-ish distribution
    const u1 = normalizedValue;
    const u2 = ((hash >> 8) & 0xFF) / 255;
    
    // Calculate using a simplified normal distribution approximation
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Scale to range 5-95%
    const scaled = 50 + z * 20;
    return Math.max(5, Math.min(95, Math.round(scaled)));
  };
  
  const marketShare = getMarketShare();

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
        "bg-white rounded-lg shadow-sm p-3 mb-2 border border-slate-200",
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
