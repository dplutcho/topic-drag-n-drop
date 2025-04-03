import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import DropZone from "./DropZone";
import TopicOutputGenerator from "./TopicOutputGenerator";
import TagInput from "./TagInput";
import { useMarketTopics } from "@/hooks/useMarketTopics";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { topicsData } from "@/data/topicsData";

const MarketTopicSelector = () => {
  const {
    filteredTopics,
    coreTopics,
    supportiveTopics,
    handleSearch,
    handleDragEnd,
    handleChildSelectionChange,
    getCurrentAudienceState,
    setCoreTopics,
    setSupportiveTopics,
    setFilteredTopics,
  } = useMarketTopics();

  // Initialize with empty filtered topics
  useEffect(() => {
    if (setFilteredTopics) {
      setFilteredTopics([]);
    }
  }, [setFilteredTopics]);

  const [currentTags, setCurrentTags] = useState([]); // Added state for tags
  const [homePageUrl, setHomePageUrl] = useState(""); // Added state for homepage URL

  // Pre-fill segment name, tags, and homepage URL when editing
  useEffect(() => {
    // Extract audience ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const audienceId = params.get("id");

    if (audienceId) {
      // Load saved audience data
      const savedAudiences = localStorage.getItem("audiences");
      if (savedAudiences) {
        const audiences = JSON.parse(savedAudiences);
        const audience = audiences.find(
          (a: any) => a.id.toString() === audienceId,
        );

        if (audience) {
          // Pre-fill the segment name input
          const segmentNameInput = document.getElementById(
            "segmentNameInput",
          ) as HTMLInputElement;
          if (segmentNameInput) {
            segmentNameInput.value = audience.name;
          }

          // Pre-fill the tags if they exist
          if (audience.tags && Array.isArray(audience.tags)) {
            setCurrentTags(audience.tags);
          }

          // Pre-fill the homepage URL if it exists
          if (audience.homePageUrl) {
            setHomePageUrl(audience.homePageUrl);
          }
        }
      }
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-6 w-6 mr-2" />
          Back to Audience Listing
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Audience Builder</h1>

      <div className="mb-6 flex gap-4 justify-end items-center">
        <div className="w-64">
          <Input
            id="segmentNameInput"
            placeholder="Segment name"
            className="h-12"
          />
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6"
          onClick={() => {
            const segmentNameInput = document.getElementById(
              "segmentNameInput",
            ) as HTMLInputElement;
            if (segmentNameInput && segmentNameInput.value) {
              // Get existing audiences from localStorage
              const existingAudiences = localStorage.getItem("audiences");
              const audiences = existingAudiences
                ? JSON.parse(existingAudiences)
                : [];

              // Extract audience ID from URL parameters to check if we're editing
              const params = new URLSearchParams(window.location.search);
              const audienceId = params.get("id");

              if (audienceId) {
                // Editing an existing audience
                const updatedAudiences = audiences.map((audience: any) => {
                  if (audience.id.toString() === audienceId) {
                    return {
                      ...audience,
                      name: segmentNameInput.value,
                      updated: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                      data: getCurrentAudienceState(),
                      tags: currentTags, // Include tags in updated audience
                      homePageUrl: homePageUrl, // Include homepage URL
                    };
                  }
                  return audience;
                });
                localStorage.setItem(
                  "audiences",
                  JSON.stringify(updatedAudiences),
                );
                alert(
                  `Segment "${segmentNameInput.value}" updated successfully`,
                );
              } else {
                // Creating a new audience
                const newAudience = {
                  id: Date.now(),
                  name: segmentNameInput.value,
                  updated: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                  data: getCurrentAudienceState(),
                  tags: currentTags, // Include tags in new audience
                  homePageUrl: homePageUrl, // Include homepage URL
                };

                // Add new audience and save to localStorage
                const updatedAudiences = [...audiences, newAudience];
                localStorage.setItem(
                  "audiences",
                  JSON.stringify(updatedAudiences),
                );
                alert(`Segment "${segmentNameInput.value}" saved successfully`);
              }

              // Don't clear input when editing
              if (!audienceId) {
                segmentNameInput.value = "";
              }
            } else {
              alert("Please enter a segment name");
            }
          }}
        >
          Save
        </Button>
      </div>

      <div className="mb-4 border rounded-lg p-4 bg-gray-50">
        <div className="mb-3 flex justify-start">
          <h2 className="text-md font-semibold">Define your market</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Input
              id="homePageUrl"
              type="url"
              placeholder="Enter your home page URL"
              className="h-12"
              value={homePageUrl}
              onChange={(e) => setHomePageUrl(e.target.value)}
            />
          </div>
          <div>
            <TagInput initialTags={currentTags} onTagsChange={setCurrentTags} />
          </div>
          <div className="flex justify-start">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={() => {
                // Find Blockchain and Fintech topics from the data
                const blockchainTopic = topicsData.find(
                  (topic) => topic.name === "Blockchain",
                );
                const fintechTopic = topicsData.find(
                  (topic) => topic.name === "Fintech",
                );

                // Create a new array with the core topics
                const newCoreTopics = [];

                // Add Blockchain if found and not already in core topics
                if (
                  blockchainTopic &&
                  !coreTopics.some((topic) => topic.name === "Blockchain")
                ) {
                  newCoreTopics.push(
                    JSON.parse(JSON.stringify(blockchainTopic)),
                  );
                }

                // Add Fintech if found and not already in core topics
                if (
                  fintechTopic &&
                  !coreTopics.some((topic) => topic.name === "Fintech")
                ) {
                  newCoreTopics.push(JSON.parse(JSON.stringify(fintechTopic)));
                }

                // Update the core topics array
                if (newCoreTopics.length > 0) {
                  setCoreTopics([...coreTopics, ...newCoreTopics]);
                }
              }}
            >
              ID iTT topics
            </Button>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DropZone
              id="coreTopics"
              title="Core Audience"
              topics={coreTopics}
              className="bg-blue-50 border border-blue-100"
              tooltipText="Topics that are the core of your solution, tool, offering e.g. 'FinTech Platform' or 'Bitcoin'. The Core Topics define the market/audience and determine the Intent used to identify that audience."
              onChildSelectionChange={(topicId, childId, selected) =>
                handleChildSelectionChange(topicId, childId, selected, true)
              }
            />
          </div>

          <div className="lg:col-span-1">
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <strong>Topic Relevancy:</strong> Topics in <span className="text-red-700 font-medium">red</span> (from "APIs and microservices" onwards) are below the similarity threshold and have lower relevance to core fintech activities.
            </div>
            <SearchResults topics={filteredTopics} />
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border p-4 bg-green-50 border-green-100 mb-4">
              <div className="mb-3 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Publish Segment</h3>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-md shadow-sm border border-gray-200">
                <div className="flex-grow">
                  <Input
                    placeholder="ClientTax segment name"
                    className="h-10"
                  />
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Push
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-indigo-50 border-indigo-100">
              <div className="mb-3 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Request Missing Topic</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-white rounded-md shadow-sm border border-gray-200">
                  <div className="flex-grow">
                    <Input
                      placeholder="Enter missing topic name"
                      className="h-10"
                      required
                    />
                  </div>
                </div>
                <div className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                  <textarea
                    placeholder="Describe this topic (required)"
                    className="w-full min-h-20 p-2 text-sm border rounded border-input resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default MarketTopicSelector;