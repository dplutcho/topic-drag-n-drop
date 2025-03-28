
import { Droppable, Draggable } from "react-beautiful-dnd";
import TopicItem from "./TopicItem";
import { Topic } from "@/data/topicsData";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  id: string;
  title: string;
  topics: Topic[];
  className?: string;
  onChildSelectionChange: (topicId: string, childId: string, selected: boolean) => void;
}

const DropZone = ({ 
  id, 
  title, 
  topics, 
  className,
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
          <h2 className="text-lg font-semibold mb-3">{title}</h2>
          {topics.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex items-center justify-center text-slate-500">
              Drop topics here
            </div>
          ) : (
            topics.map((topic, index) => (
              <Draggable key={topic.id} draggableId={topic.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TopicItem 
                      topic={topic} 
                      inDropZone={true} 
                      onChildSelectionChange={onChildSelectionChange}
                    />
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DropZone;
