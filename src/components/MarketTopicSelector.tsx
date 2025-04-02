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

const MarketTopicSelector = () => {
  const {
    filteredTopics,
    coreTopics,
    supportiveTopics,
    handleSearch,
    handleDragEnd,
    handleChildSelectionChange,
    getCurrentAudienceState,
  } = useMarketTopics();

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

      <div className="mb-4">
        <Input
          id="homePageUrl"
          type="url"
          placeholder="Enter your home page URL"
          className="h-12 mb-4"
          value={homePageUrl}
          onChange={(e) => setHomePageUrl(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <TagInput initialTags={currentTags} onTagsChange={setCurrentTags} />{" "}
        {/* Update tags state with initialTags */}
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
            <SearchResults topics={filteredTopics} />
          </div>

          <div className="lg:col-span-1">
            <DropZone
              id="supportiveTopics"
              title="Publish Segment"
              topics={supportiveTopics}
              className="bg-green-50 border border-green-100"
              tooltipText="Topics that the prospects are also interested in but does NOT define your core solution or your core audience. These topics are always within the context of the core topics.e.g The prospect is reading about AI in FinTech."
              onChildSelectionChange={(topicId, childId, selected) =>
                handleChildSelectionChange(topicId, childId, selected, false)
              }
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default MarketTopicSelector;
