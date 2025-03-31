
import MarketTopicSelector from "@/components/MarketTopicSelector";
import RequestTopicForm from "@/components/RequestTopicForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <MarketTopicSelector />
      <div className="container mx-auto pb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3">
            <RequestTopicForm />
          </div>
          <div className="md:w-1/3">
            <div className="mt-4 bg-white p-3 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Publish Segment</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="segmentName" className="text-xs block mb-1">Segment name</label>
                  <input 
                    id="segmentName" 
                    type="text" 
                    className="w-full h-8 text-sm border border-gray-300 rounded-md px-2" 
                    placeholder="Enter segment name" 
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    className="text-xs h-7 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                  >
                    Publish segment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
