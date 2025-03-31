
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
      <h1 className="text-3xl font-bold mb-8 text-center">Market Topic Selector</h1>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SearchResults topics={filteredTopics} />
          </div>
          
          <div className="lg:col-span-1">
            <DropZone 
              id="coreTopics" 
              title="Core Topics" 
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
              title="Supportive Topics" 
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
      
      <TopicOutputGenerator 
        coreTopics={coreTopics} 
        supportiveTopics={supportiveTopics} 
      />
    </div>
  );
};

export default MarketTopicSelector;
