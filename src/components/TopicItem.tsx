import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Topic, TopicChild } from "@/data/topicsData";
import { Checkbox } from "@/components/ui/checkbox";
import { getMarketShare } from "@/hooks/useMarketTopics";
import { cn } from "@/lib/utils";

interface TopicItemProps {
  topic: Topic;
  isDraggable?: boolean;
  inDropZone: boolean;
  onChildSelectionChange?: (topicId: string, childId: string, selected: boolean) => void;
  onDragEnd?: (topicId: string, targetZoneId: string) => void; // Added for drag-and-drop handling
}

const TopicItem = ({ 
  topic, 
  inDropZone, 
  onChildSelectionChange,
  onDragEnd // Added for drag-and-drop handling
}: TopicItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChildCheckboxChange = (childId: string, selected: boolean) => {
    if (onChildSelectionChange) {
      onChildSelectionChange(topic.id, childId, selected);
    }
  };

  // Use market share from the hook
  const marketShare = inDropZone && topic.dropZoneId === 'coreTopics' ? getMarketShare(topic.id) : 0;

  // Handle mouse down event to set dragging styles
  const handleMouseDown = (e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLDivElement;
    element.style.cursor = 'grabbing';

    // Cleanup function
    const handleMouseUp = () => {
      element.style.cursor = 'grab';
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const targetZoneId = e.target?.closest('[data-zone-id]')?.dataset.zoneId;
    if(targetZoneId && onDragEnd){
      onDragEnd(topic.id, targetZoneId);
    }

  }

  return (
    <div 
      className={cn(
        "mb-2 p-3 bg-white rounded-md shadow-sm border border-slate-100 cursor-grab",
        inDropZone ? "border-l-4 border-l-blue-500" : ""
      )}
      onMouseDown={handleMouseDown}
      draggable={true}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-grow">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className="font-medium">{topic.name}</div>

          {topic.similarity !== undefined && !inDropZone && (
            <div className="ml-2 py-0.5 px-2 bg-slate-100 rounded-full text-xs text-slate-500">
              {Math.round(topic.similarity * 100)}%
            </div>
          )}
        </div>

        {inDropZone && topic.dropZoneId === 'coreTopics' && (
          <div className="text-xs font-semibold bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full">
            {marketShare}%
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