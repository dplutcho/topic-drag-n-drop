
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import { DragDropContext } from "react-beautiful-dnd";
import { Toaster } from "@/components/ui/toaster";
import MarketTopicSelector from "./components/MarketTopicSelector";
import NotFound from "./pages/NotFound";
import "./App.css";

const Dashboard = () => {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <MarketTopicSelector />
    </DragDropContext>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
