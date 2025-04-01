
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext } from "react-beautiful-dnd";
import MarketTopicSelector from "@/components/MarketTopicSelector";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const audienceId = queryParams.get('id');

  useEffect(() => {
    if (audienceId) {
      // If we have an audience ID, we're in edit mode
      // Load the audience data from local storage
      const storedAudiences = JSON.parse(localStorage.getItem('audiences') || '[]');
      const audience = storedAudiences.find((a: any) => a.id === Number(audienceId));
      
      if (audience) {
        // Set the audience name in the input field
        const segmentNameInput = document.querySelector('input[placeholder="Segment name"]') as HTMLInputElement;
        if (segmentNameInput) {
          segmentNameInput.value = audience.name;
        }
        
        // You could also load topics if you stored them
        // This would require extending your audience data structure
      } else {
        // If audience not found, redirect back to the main page
        navigate('/');
      }
    }
  }, [audienceId, navigate]);

  return (
    <DragDropContext onDragEnd={() => {}}>
      <MarketTopicSelector />
    </DragDropContext>
  );
};

export default Dashboard;
