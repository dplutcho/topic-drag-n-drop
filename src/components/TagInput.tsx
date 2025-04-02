import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";

interface TagInputProps {
  initialTags?: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ initialTags = [], onTagsChange }) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  // Use useCallback to prevent recreating this function on every render
  const updateParentTags = useCallback((newTags: string[]) => {
    onTagsChange(newTags);
  }, [onTagsChange]);

  useEffect(() => {
    // Update the parent component when tags change
    updateParentTags(tags);
  }, [tags, updateParentTags]);

  // Only update internal state when initialTags changes and is different
  useEffect(() => {
    if (JSON.stringify(initialTags) !== JSON.stringify(tags)) {
      setTags(initialTags);
    }
  }, [initialTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    
  };

  // Badge color variations
  const getBadgeColor = (index: number) => {
    const colors = [
      'bg-blue-600 hover:bg-blue-700',
      'bg-orange-500 hover:bg-orange-600',
      'bg-teal-600 hover:bg-teal-700',
      'bg-red-500 hover:bg-red-600',
      'bg-purple-600 hover:bg-purple-700',
      'bg-green-600 hover:bg-green-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border rounded-lg bg-background">
      <span className="text-sm font-medium text-muted-foreground mr-1">Keywords</span>
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          className={`${getBadgeColor(index)} text-white cursor-default px-3 py-1 text-sm font-medium`}
        >
          {tag}
          <button 
            onClick={() => removeTag(tag)} 
            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add tag..."
        className="flex-1 min-w-[120px] h-8 text-sm border-none focus-visible:ring-0 pl-2 bg-transparent"
      />
    </div>
  );
};

export default TagInput;