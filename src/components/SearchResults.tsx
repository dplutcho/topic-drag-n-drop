
import { Droppable, Draggable } from "react-beautiful-dnd";
import TopicItem from "./TopicItem";
import { Topic } from "@/data/topicsData";

// Add similarity score to topics
interface TopicWithScore extends Topic {
  similarityScore?: number;
}

interface SearchResultsProps {
  topics: Topic[];
}

const SearchResults = ({ topics }: SearchResultsProps) => {
  // Add random similarity scores to topics and sort by score
  const sortedTopics = [...topics].map(topic => {
    // Generate a random similarity score between 0.1 and 1.0
    // Assign higher scores to Fintech and Blockchain
    let score = 0;
    if (topic.name === "Fintech") {
      score = 0.95;
    } else if (topic.name === "Blockchain") {
      score = 0.92;
    } else {
      // Random score for other topics between 0.1 and 0.89
      score = Math.round((0.1 + Math.random() * 0.79) * 100) / 100;
    }
    
    return {
      ...topic,
      similarityScore: score
    } as TopicWithScore;
  }).sort((a, b) => {
    return (b.similarityScore || 0) - (a.similarityScore || 0);
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
