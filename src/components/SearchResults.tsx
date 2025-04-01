
import { Droppable, Draggable } from "react-beautiful-dnd";
import TopicItem from "./TopicItem";
import { Topic } from "@/data/topicsData";

interface SearchResultsProps {
  topics: Topic[];
}

const SearchResults = ({ topics }: SearchResultsProps) => {
  // Sort topics to put Fintech and Blockchain at the top
  const sortedTopics = [...topics].sort((a, b) => {
    if (a.name === "Fintech") return -1;
    if (b.name === "Fintech") return 1;
    if (a.name === "Blockchain") return -1;
    if (b.name === "Blockchain") return 1;
    return 0;
  });

  return (
    <Droppable droppableId="searchResults">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-slate-50 rounded-lg p-4 h-[calc(100vh-250px)] overflow-y-auto"
        >
          <h2 className="text-lg font-semibold mb-3">Search Results</h2>
          {sortedTopics.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No topics found. Try a different search term.
            </div>
          ) : (
            sortedTopics.map((topic, index) => (
              <Draggable key={topic.id} draggableId={topic.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TopicItem topic={topic} inDropZone={false} />
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

export default SearchResults;
