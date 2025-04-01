
import { DragDropContext } from "react-beautiful-dnd";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import DropZone from "./DropZone";
import TopicOutputGenerator from "./TopicOutputGenerator";
import { useMarketTopics } from "@/hooks/useMarketTopics";

const MarketTopicSelector = () => {
  const {
    filteredTopics,
    coreTopics,
    supportiveTopics,
    handleSearch,
    handleDragEnd,
    handleChildSelectionChange
  } = useMarketTopics();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Audience Builder</h1>
      
      <div className="mb-6 flex gap-4 justify-end">
        <div className="w-80">
          <div className="relative">
            <input
              placeholder="Segment name"
              className="w-full h-12 px-3 rounded-md border border-input bg-background"
            />
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-sm"
              onClick={() => {
                const segmentNameInput = document.querySelector('input[placeholder="Segment name"]') as HTMLInputElement;
                if (segmentNameInput && segmentNameInput.value) {
                  alert(`Segment "${segmentNameInput.value}" saved successfully`);
                } else {
                  alert("Please enter a segment name");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SearchResults topics={filteredTopics} />
          </div>
          
          <div className="lg:col-span-1">
            <DropZone 
              id="coreTopics" 
              title="Core Audience" 
              topics={coreTopics} 
              className="bg-blue-50 border border-blue-100"
              tooltipText="Topics that are the core of your solution, tool, offering e.g. 'FinTech Platform' or 'Bitcoin'. The Core Topics define the market/audience and determine the Intent used to identify that audience."
              onChildSelectionChange={(topicId, childId, selected) => 
                handleChildSelectionChange(topicId, childId, selected, true)
              }
            />
          </div>
          
          <div className="lg:col-span-1">
            <DropZone 
              id="supportiveTopics" 
              title="Also Interested in" 
              topics={supportiveTopics} 
              className="bg-green-50 border border-green-100"
              tooltipText="Topics that the prospects are also interested in but does NOT define your core solution or your core audience. These topics are always within the context of the core topics.e.g The prospect is reading about AI in FinTech."
              onChildSelectionChange={(topicId, childId, selected) => 
                handleChildSelectionChange(topicId, childId, selected, false)
              }
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default MarketTopicSelector;
