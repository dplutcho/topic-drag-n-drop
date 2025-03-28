
import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import DropZone from "./DropZone";
import { Topic, topicsData, TopicChild } from "@/data/topicsData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MarketTopicSelector = () => {
  const [allTopics, setAllTopics] = useState<Topic[]>(topicsData);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>(topicsData);
  const [coreTopics, setCoreTopics] = useState<Topic[]>([]);
  const [supportiveTopics, setSupportiveTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    handleSearch(searchQuery);
  }, [coreTopics, supportiveTopics]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

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
    
    if (source.droppableId === "searchResults") {
      const topicToMove = filteredTopics[source.index];
      
      const topicClone = JSON.parse(JSON.stringify(topicToMove));
      
      if (destination.droppableId === "coreTopics") {
        setCoreTopics([...coreTopics, topicClone]);
      } else if (destination.droppableId === "supportiveTopics") {
        setSupportiveTopics([...supportiveTopics, topicClone]);
      }
    }
    else if (
      (source.droppableId === "coreTopics" && destination.droppableId === "supportiveTopics") ||
      (source.droppableId === "supportiveTopics" && destination.droppableId === "coreTopics")
    ) {
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
    else if (
      (source.droppableId === "coreTopics" || source.droppableId === "supportiveTopics") && 
      destination.droppableId === "searchResults"
    ) {
      if (source.droppableId === "coreTopics") {
        const newCoreTopics = Array.from(coreTopics);
        const [removedTopic] = newCoreTopics.splice(source.index, 1);
        setCoreTopics(newCoreTopics);
      } else if (source.droppableId === "supportiveTopics") {
        const newSupportiveTopics = Array.from(supportiveTopics);
        const [removedTopic] = newSupportiveTopics.splice(source.index, 1);
        setSupportiveTopics(newSupportiveTopics);
      }
    }
  };

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
              tooltipText="Topics that will always be within the context of the core topic. e.g AI as a supportive topic will only include intent that is about Fintech AI."
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
          Generate Audience Analytics
        </Button>
      </div>
    </div>
  );
};

export default MarketTopicSelector;
