
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
      // When no query, show all available topics with descending similarity scores
      const available = allTopics.filter(
        topic => !coreTopics.some(ct => ct.id === topic.id) && 
                !supportiveTopics.some(st => st.id === topic.id)
      );
      
      // Keep Blockchain and Fintech at the top with highest similarity scores
      const blockchainAndFintech = available.filter(topic => 
        topic.name === "Blockchain" || topic.name === "Fintech"
      );
      blockchainAndFintech.forEach(topic => topic.similarity = 1.0);
      
      const others = available.filter(topic => 
        topic.name !== "Blockchain" && topic.name !== "Fintech"
      );
      
      // Assign descending similarity scores from 0.9 to 0.2 for other topics
      const startValue = 0.9;
      const endValue = 0.2;
      const step = others.length > 1 ? (startValue - endValue) / (others.length - 1) : 0;
      
      others.forEach((topic, index) => {
        topic.similarity = parseFloat((startValue - (step * index)).toFixed(2));
      });
      
      setFilteredTopics([...blockchainAndFintech, ...others]);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = allTopics
      .filter(
        topic => 
          (topic.name.toLowerCase().includes(lowercaseQuery) || 
          topic.children.some(child => child.name.toLowerCase().includes(lowercaseQuery))) &&
          !coreTopics.some(ct => ct.id === topic.id) && 
          !supportiveTopics.some(st => st.id === topic.id)
      )
      .map(topic => {
        // Calculate base similarity score
        let baseSimilarity = 0;
        
        // Exact name match gets highest score
        if (topic.name.toLowerCase() === lowercaseQuery) {
          baseSimilarity = 1.0;
        }
        // Partial name match gets proportional score
        else if (topic.name.toLowerCase().includes(lowercaseQuery)) {
          baseSimilarity = 0.7 + (lowercaseQuery.length / topic.name.length) * 0.3;
        }
        // Child match gets lower score
        else if (topic.children.some(child => child.name.toLowerCase().includes(lowercaseQuery))) {
          const matchingChild = topic.children.find(child => 
            child.name.toLowerCase().includes(lowercaseQuery)
          );
          baseSimilarity = matchingChild 
            ? 0.5 + (lowercaseQuery.length / matchingChild.name.length) * 0.2 
            : 0.5;
        }
        
        // Apply power law transformation (y = x^α where α > 1 creates power law curve)
        // Using α = 1.5 for a moderate power law effect
        const powerLawSimilarity = Math.pow(baseSimilarity, 1.5);
        
        return {
          ...topic,
          similarity: parseFloat(powerLawSimilarity.toFixed(2)) // Round to 2 decimal places
        };
      })
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0)); // Sort by similarity score (descending)
      
      // Normalize scores to range from 1.0 to 0.2 after sorting
      if (filtered.length > 0) {
        const maxScore = 1.0;
        const minScore = 0.2;
        const range = maxScore - minScore;
        
        filtered.forEach((topic, index) => {
          const normalizedScore = index === 0 
            ? maxScore 
            : maxScore - (range * (index / (filtered.length - 1 || 1)));
          topic.similarity = parseFloat(normalizedScore.toFixed(2));
        });
      }
    
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
