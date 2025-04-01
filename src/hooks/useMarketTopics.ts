
import { useState, useEffect } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Topic, topicsData } from "@/data/topicsData";

// Create a map to store and normalize market share percentages
const marketShareMap = new Map<string, number>();

// Function to normalize market shares to sum to 100%
export const normalizeMarketShares = (topics: Topic[]) => {
  // If no topics, nothing to normalize
  if (topics.length === 0) return;
  
  // Generate random values for any topics that don't have market share yet
  topics.forEach(topic => {
    if (!marketShareMap.has(topic.id)) {
      // Generate value between 5 and 95
      marketShareMap.set(topic.id, Math.floor(Math.random() * 91) + 5);
    }
  });
  
  // Calculate sum of all market shares for current topics
  let sum = 0;
  topics.forEach(topic => {
    sum += marketShareMap.get(topic.id) || 0;
  });
  
  // Normalize to 100%
  if (sum > 0) {
    topics.forEach(topic => {
      const currentShare = marketShareMap.get(topic.id) || 0;
      marketShareMap.set(topic.id, Math.round((currentShare / sum) * 100));
    });
    
    // Check for rounding errors and adjust last item if needed
    let newSum = 0;
    topics.slice(0, -1).forEach(topic => {
      newSum += marketShareMap.get(topic.id) || 0;
    });
    
    if (topics.length > 0) {
      const lastTopic = topics[topics.length - 1];
      marketShareMap.set(lastTopic.id, 100 - newSum);
    }
  }
};

// Function to get market share for a topic
export const getMarketShare = (topicId: string): number => {
  return marketShareMap.get(topicId) || 0;
};

export const useMarketTopics = () => {
  const [allTopics, setAllTopics] = useState<Topic[]>(topicsData);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>(topicsData);
  const [coreTopics, setCoreTopics] = useState<Topic[]>([]);
  const [supportiveTopics, setSupportiveTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Normalize market shares whenever core topics change
  useEffect(() => {
    normalizeMarketShares(coreTopics);
  }, [coreTopics]);

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
      
      // Create a clean clone that preserves only the necessary properties
      const topicClone = {
        ...topicToMove,
        id: topicToMove.id,
        name: topicToMove.name,
        children: topicToMove.children.map(child => ({
          ...child,
          id: child.id,
          name: child.name
        }))
      };
      
      if (destination.droppableId === "coreTopics") {
        // Preserve the topic as-is, just adding the dropZoneId
        const preservedTopic = {
          ...topicClone,
          dropZoneId: "coreTopics"
        };
        setCoreTopics([...coreTopics, preservedTopic]);
      } else if (destination.droppableId === "supportiveTopics") {
        // Preserve the topic as-is, just adding the dropZoneId
        const preservedTopic = {
          ...topicClone,
          dropZoneId: "supportiveTopics"
        };
        setSupportiveTopics([...supportiveTopics, preservedTopic]);
      }
    }
    else if (
      (source.droppableId === "coreTopics" && destination.droppableId === "supportiveTopics") ||
      (source.droppableId === "supportiveTopics" && destination.droppableId === "coreTopics")
    ) {
      if (source.droppableId === "coreTopics" && destination.droppableId === "supportiveTopics") {
        const newCoreTopics = Array.from(coreTopics);
        const [movedTopic] = newCoreTopics.splice(source.index, 1);
        // Update dropZoneId but preserve everything else
        const preservedTopic = {
          ...movedTopic,
          dropZoneId: "supportiveTopics"
        };
        setCoreTopics(newCoreTopics);
        setSupportiveTopics([...supportiveTopics, preservedTopic]);
      } else if (source.droppableId === "supportiveTopics" && destination.droppableId === "coreTopics") {
        const newSupportiveTopics = Array.from(supportiveTopics);
        const [movedTopic] = newSupportiveTopics.splice(source.index, 1);
        // Update dropZoneId but preserve everything else
        const preservedTopic = {
          ...movedTopic,
          dropZoneId: "coreTopics"
        };
        setSupportiveTopics(newSupportiveTopics);
        setCoreTopics([...coreTopics, preservedTopic]);
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
