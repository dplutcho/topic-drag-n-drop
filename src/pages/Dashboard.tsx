
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { DropZone } from "../components/DropZone";
import { TopicOutputGenerator } from "../components/TopicOutputGenerator";
import topicsData from "../data/topicsData";
import { Topic } from "../data/topicsData";
import { useLocation, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [coreTopics, setCoreTopics] = useState<Topic[]>([]);
  const [supportiveTopics, setSupportiveTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [audienceName, setAudienceName] = useState("New Audience");
  const [audienceId, setAudienceId] = useState<string | null>(null);
  
  // Check for audience ID in URL params for editing
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
      // Load audience data from localStorage
      const savedAudiences = localStorage.getItem('savedAudiences');
      if (savedAudiences) {
        const audiences = JSON.parse(savedAudiences);
        const audience = audiences.find((a: any) => a.id === id);
        
        if (audience) {
          setAudienceId(id);
          setAudienceName(audience.name);
          if (audience.coreTopics) setCoreTopics(audience.coreTopics);
          if (audience.supportiveTopics) setSupportiveTopics(audience.supportiveTopics);
        }
      }
    }
  }, [location]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    // Find the topic that was dragged
    const topic = findTopicById(draggableId);
    if (!topic) return;

    // Handle moving to core topics
    if (destination.droppableId === "coreTopics") {
      // If moving within core topics, reorder
      if (source.droppableId === "coreTopics") {
        const reordered = Array.from(coreTopics);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
        setCoreTopics(reordered);
      } 
      // If moving from supportive topics to core topics
      else if (source.droppableId === "supportiveTopics") {
        setSupportiveTopics(supportiveTopics.filter(t => t.id !== draggableId));
        setCoreTopics([...coreTopics.slice(0, destination.index), topic, ...coreTopics.slice(destination.index)]);
      } 
      // If moving from search results to core topics
      else if (source.droppableId === "searchResults") {
        // Check if the topic is already in supportive topics
        if (supportiveTopics.some(t => t.id === draggableId)) {
          setSupportiveTopics(supportiveTopics.filter(t => t.id !== draggableId));
        }
        
        if (!coreTopics.some(t => t.id === draggableId)) {
          setCoreTopics([...coreTopics.slice(0, destination.index), topic, ...coreTopics.slice(destination.index)]);
        }
      }
    }
    // Handle moving to supportive topics
    else if (destination.droppableId === "supportiveTopics") {
      // If moving within supportive topics, reorder
      if (source.droppableId === "supportiveTopics") {
        const reordered = Array.from(supportiveTopics);
        const [removed] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, removed);
        setSupportiveTopics(reordered);
      } 
      // If moving from core topics to supportive topics
      else if (source.droppableId === "coreTopics") {
        setCoreTopics(coreTopics.filter(t => t.id !== draggableId));
        setSupportiveTopics([...supportiveTopics.slice(0, destination.index), topic, ...supportiveTopics.slice(destination.index)]);
      } 
      // If moving from search results to supportive topics
      else if (source.droppableId === "searchResults") {
        // Check if the topic is already in core topics
        if (coreTopics.some(t => t.id === draggableId)) {
          setCoreTopics(coreTopics.filter(t => t.id !== draggableId));
        }
        
        if (!supportiveTopics.some(t => t.id === draggableId)) {
          setSupportiveTopics([...supportiveTopics.slice(0, destination.index), topic, ...supportiveTopics.slice(destination.index)]);
        }
      }
    }
  };

  const findTopicById = (id: string): Topic | undefined => {
    return topicsData.find(topic => topic.id === id);
  };

  const removeFromCoreTopics = (topicId: string) => {
    setCoreTopics(coreTopics.filter(topic => topic.id !== topicId));
  };

  const removeFromSupportiveTopics = (topicId: string) => {
    setSupportiveTopics(supportiveTopics.filter(topic => topic.id !== topicId));
  };

  const saveAudience = () => {
    // Get existing audiences or initialize empty array
    const savedAudiences = localStorage.getItem('savedAudiences');
    const audiences = savedAudiences ? JSON.parse(savedAudiences) : [];
    
    const audienceData = {
      id: audienceId || new Date().getTime().toString(),
      name: audienceName,
      dateCreated: new Date().toISOString(),
      coreTopics,
      supportiveTopics
    };
    
    // If editing, update existing audience, otherwise add new one
    if (audienceId) {
      const index = audiences.findIndex((a: any) => a.id === audienceId);
      if (index !== -1) {
        audiences[index] = audienceData;
      } else {
        audiences.push(audienceData);
      }
    } else {
      audiences.push(audienceData);
    }
    
    localStorage.setItem('savedAudiences', JSON.stringify(audiences));
    navigate('/');
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <input
                type="text"
                value={audienceName}
                onChange={(e) => setAudienceName(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
              />
              <p className="text-gray-500 mt-1">Drag and drop topics to build your audience</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveAudience}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Audience
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <SearchBar setSearchQuery={setSearchQuery} />
              <SearchResults 
                searchQuery={searchQuery} 
                coreTopics={coreTopics} 
                supportiveTopics={supportiveTopics} 
              />
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <DropZone 
                  id="coreTopics" 
                  title="Core Topics" 
                  topics={coreTopics} 
                  removeTopic={removeFromCoreTopics} 
                />
                <DropZone 
                  id="supportiveTopics" 
                  title="Supportive Topics" 
                  topics={supportiveTopics} 
                  removeTopic={removeFromSupportiveTopics} 
                />
              </div>
              
              <TopicOutputGenerator 
                coreTopics={coreTopics} 
                supportiveTopics={supportiveTopics} 
              />
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
