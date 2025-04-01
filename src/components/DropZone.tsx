
import { Droppable, Draggable } from "react-beautiful-dnd";
import TopicItem from "./TopicItem";
import { Topic } from "@/data/topicsData";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
import TopicOutputGenerator from "./TopicOutputGenerator";

interface DropZoneProps {
  id: string;
  title: string;
  topics: Topic[];
  className?: string;
  tooltipText?: string;
  onChildSelectionChange: (topicId: string, childId: string, selected: boolean) => void;
}

const DropZone = ({ 
  id, 
  title, 
  topics, 
  className,
  tooltipText,
  onChildSelectionChange 
}: DropZoneProps) => {
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "bg-slate-50 rounded-lg p-4 h-[calc(100vh-250px)] overflow-y-auto",
            snapshot.isDraggingOver ? "bg-slate-100" : "",
            className
          )}
        >
          <div className="flex items-center mb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            {tooltipText && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="ml-1.5 text-slate-500 hover:text-slate-700">
                    <InfoIcon size={16} />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-3 text-sm">
                  {tooltipText}
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          
          {topics.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex items-center justify-center text-slate-500">
              Drop topics here
            </div>
          ) : (
            <div className="mb-4">
              {topics.map((topic, index) => (
                <Draggable key={topic.id} draggableId={topic.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TopicItem 
                        topic={{...topic, dropZoneId: id}}
                        inDropZone={true} 
                        onChildSelectionChange={onChildSelectionChange}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
          
          {id === "coreTopics" && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Market Analytics</h2>
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{topics.length > 0 ? topics.length * 320 : 0}</div>
                    <div className="text-xs text-gray-500">Intent Activity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{topics.length > 0 ? topics.length * 1280 : 0}</div>
                    <div className="text-xs text-gray-500">Prospects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{topics.length > 0 ? topics.length * 84 : 0}</div>
                    <div className="text-xs text-gray-500">Companies</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                {onChildSelectionChange && (
                  <TopicOutputGenerator 
                    coreTopics={topics} 
                    supportiveTopics={[]} 
                  />
                )}
              </div>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DropZone;
