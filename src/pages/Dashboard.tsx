import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MarketTopicSelector from "@/components/MarketTopicSelector";
import { useMarketTopics } from "@/hooks/useMarketTopics";
import { topicsData } from "@/data/topicsData";

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAudienceState } = useMarketTopics();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract audience ID from URL parameters
    const params = new URLSearchParams(location.search);
    const audienceId = params.get('id');

    if (audienceId) {
      // Load saved audience data
      const savedAudiences = localStorage.getItem('audiences');
      if (savedAudiences) {
        const audiences = JSON.parse(savedAudiences);
        const audience = audiences.find((a: any) => a.id.toString() === audienceId);

        if (audience && audience.data) {
          // Set the audience state with saved data
          setAudienceState(audience.data);
          setIsLoading(false);
          return;
        }
      }
    }

    // If no audience ID or no saved audience, initialize with Blockchain and Fintech
    const blockchainTopic = topicsData.find(topic => topic.name === "Blockchain");
    const fintechTopic = topicsData.find(topic => topic.name === "Fintech");
    
    const initialTopics = {
      coreTopics: [],
      supportiveTopics: []
    };
    
    if (blockchainTopic) {
      initialTopics.coreTopics.push(JSON.parse(JSON.stringify(blockchainTopic)));
    }
    
    if (fintechTopic) {
      initialTopics.coreTopics.push(JSON.parse(JSON.stringify(fintechTopic)));
    }
    
    setAudienceState(initialTopics);
    setIsLoading(false);
  }, [location, setAudienceState]);

  if (isLoading) {
    return <div className="text-center py-12">Loading audience data...</div>;
  }

  return (
    <div>
      <MarketTopicSelector />
    </div>
  );
}

export default Dashboard;