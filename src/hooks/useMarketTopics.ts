
import { useState, useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Topic, topicsData } from "@/data/topicsData";

export const useMarketTopics = () => {
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

  return {
    filteredTopics,
    coreTopics,
    supportiveTopics,
    handleSearch,
    handleDragEnd,
    handleChildSelectionChange
  };
};
