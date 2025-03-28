
import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import DropZone from "./DropZone";
import { Topic, topicsData, TopicChild } from "@/data/topicsData";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const MarketTopicSelector = () => {
  const [allTopics, setAllTopics] = useState<Topic[]>(topicsData);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>(topicsData);
  const [coreTopics, setCoreTopics] = useState<Topic[]>([]);
  const [supportiveTopics, setSupportiveTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredTopics(allTopics.filter(
        topic => !coreTopics.some(ct => ct.id === topic.id) && 
                !supportiveTopics.some(st => st.id === topic.id)
      ));
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = allTopics.filter(
      topic => 
        (topic.name.toLowerCase().includes(lowercaseQuery) || 
         topic.children.some(child => child.name.toLowerCase().includes(lowercaseQuery))) &&
        !coreTopics.some(ct => ct.id === topic.id) && 
        !supportiveTopics.some(st => st.id === topic.id)
    );
    
    setFilteredTopics(filtered);
  };

  // Update filtered topics whenever core or supportive topics change
  useEffect(() => {
    handleSearch(searchQuery);
  }, [coreTopics, supportiveTopics]);

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a valid drop zone
    if (!destination) return;
    
    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // Move within the same droppable
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "coreTopics") {
        const newCoreTopics = Array.from(coreTopics);
        const [movedTopic] = newCoreTopics.splice(source.index, 1);
        newCoreTopics.splice(destination.index, 0, movedTopic);
        setCoreTopics(newCoreTopics);
      } else if (source.droppableId === "supportiveTopics") {
        const newSupportiveTopics = Array.from(supportiveTopics);
        const [movedTopic] = newSupportiveTopics.splice(source.index, 1);
        newSupportiveTopics.splice(destination.index, 0, movedTopic);
        setSupportiveTopics(newSupportiveTopics);
      }
      return;
    }
    
    // Moving from search results to a drop zone
    if (source.droppableId === "searchResults") {
      const topicToMove = filteredTopics[source.index];
      
      // Clone topic to avoid reference issues
      const topicClone = JSON.parse(JSON.stringify(topicToMove));
      
      if (destination.droppableId === "coreTopics") {
        setCoreTopics([...coreTopics, topicClone]);
      } else if (destination.droppableId === "supportiveTopics") {
        setSupportiveTopics([...supportiveTopics, topicClone]);
      }
    }
    // Moving between core and supportive topics
    else {
      if (source.droppableId === "coreTopics" && destination.droppableId === "supportiveTopics") {
        const newCoreTopics = Array.from(coreTopics);
        const [movedTopic] = newCoreTopics.splice(source.index, 1);
        setCoreTopics(newCoreTopics);
        setSupportiveTopics([...supportiveTopics, movedTopic]);
      } else if (source.droppableId === "supportiveTopics" && destination.droppableId === "coreTopics") {
        const newSupportiveTopics = Array.from(supportiveTopics);
        const [movedTopic] = newSupportiveTopics.splice(source.index, 1);
        setSupportiveTopics(newSupportiveTopics);
        setCoreTopics([...coreTopics, movedTopic]);
      }
    }
  };

  // Handle child selection change
  const handleChildSelectionChange = (
    topicId: string, 
    childId: string, 
    selected: boolean, 
    isCore: boolean
  ) => {
    if (isCore) {
      setCoreTopics(prevTopics => 
        prevTopics.map(topic => 
          topic.id === topicId 
            ? {
                ...topic,
                children: topic.children.map(child => 
                  child.id === childId ? { ...child, selected } : child
                )
              }
            : topic
        )
      );
    } else {
      setSupportiveTopics(prevTopics => 
        prevTopics.map(topic => 
          topic.id === topicId 
            ? {
                ...topic,
                children: topic.children.map(child => 
                  child.id === childId ? { ...child, selected } : child
                )
              }
            : topic
        )
      );
    }
  };

  // Generate JSON output
  const generateOutput = () => {
    const output = {
      coreTopics: coreTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        children: topic.children.filter(child => child.selected).map(child => ({
          id: child.id,
          name: child.name
        }))
      })),
      supportiveTopics: supportiveTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        children: topic.children.filter(child => child.selected).map(child => ({
          id: child.id,
          name: child.name
        }))
      }))
    };
    
    console.log(JSON.stringify(output, null, 2));
    toast.success("Market topic selection data generated!", {
      description: "Check the console (F12) to see the JSON data."
    });
  };

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
              onChildSelectionChange={(topicId, childId, selected) => 
                handleChildSelectionChange(topicId, childId, selected, false)
              }
            />
          </div>
        </div>
      </DragDropContext>
      
      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={generateOutput}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Generate Market Selection
        </Button>
      </div>
    </div>
  );
};

export default MarketTopicSelector;
