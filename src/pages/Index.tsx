
import MarketTopicSelector from "@/components/MarketTopicSelector";
import RequestTopicForm from "@/components/RequestTopicForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <MarketTopicSelector />
      <div className="container mx-auto pb-8">
        <RequestTopicForm />
      </div>
    </div>
  );
};

export default Index;
