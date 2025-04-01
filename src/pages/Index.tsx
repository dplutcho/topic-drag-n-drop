
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Type definition for audience
interface Audience {
  id: string;
  name: string;
  dateCreated: string;
  description?: string;
}

export default function Index() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  
  // Load saved audiences from localStorage on component mount
  useEffect(() => {
    const savedAudiences = localStorage.getItem('savedAudiences');
    if (savedAudiences) {
      setAudiences(JSON.parse(savedAudiences));
    } else {
      // Add some example audiences if none exist
      const exampleAudiences = [
        {
          id: '1',
          name: 'Technology Enthusiasts',
          dateCreated: new Date().toISOString(),
          description: 'People interested in the latest tech trends and innovations'
        },
        {
          id: '2',
          name: 'Finance Professionals',
          dateCreated: new Date().toISOString(),
          description: 'Banking and finance industry experts and enthusiasts'
        }
      ];
      setAudiences(exampleAudiences);
      localStorage.setItem('savedAudiences', JSON.stringify(exampleAudiences));
    }
  }, []);

  // Delete an audience
  const handleDelete = (id: string) => {
    const updatedAudiences = audiences.filter(audience => audience.id !== id);
    setAudiences(updatedAudiences);
    localStorage.setItem('savedAudiences', JSON.stringify(updatedAudiences));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Audience Builder</h1>
        <Link to="/builder">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} /> Create New Audience
          </Button>
        </Link>
      </div>

      {audiences.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No audiences created yet</h2>
          <p className="text-gray-500 mb-6">Create your first audience to get started</p>
          <Link to="/builder">
            <Button>Create Audience</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <Card key={audience.id}>
              <CardHeader>
                <CardTitle>{audience.name}</CardTitle>
                <CardDescription>
                  Created: {new Date(audience.dateCreated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {audience.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the 
                        audience "{audience.name}" and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(audience.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Link to={`/builder?id=${audience.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
