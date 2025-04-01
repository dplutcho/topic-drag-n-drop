import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";

// Sample audience data
// Initial audiences used as fallback if no saved data exists
const initialAudiences = [
  { id: 1, name: "SIEM security France", updated: "Apr 17, 2024" },
  { id: 2, name: "Next Gen router security", updated: "Apr 10, 2024" },
  { id: 3, name: "CIEM for NA executives", updated: "Apr 5, 2024" },
  { id: 4, name: "Data Loss Protection", updated: "Apr 1, 2024" },
];

export function Index() {
  const [audiences, setAudiences] = useState<any[]>([]);
  
  // Load audiences from localStorage on component mount
  useEffect(() => {
    const savedAudiences = localStorage.getItem('audiences');
    if (savedAudiences) {
      setAudiences(JSON.parse(savedAudiences));
    } else {
      setAudiences(initialAudiences);
    }
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this audience?")) {
      const updatedAudiences = audiences.filter((audience) => audience.id !== id);
      setAudiences(updatedAudiences);
      localStorage.setItem('audiences', JSON.stringify(updatedAudiences));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Palo Alto Networks</h1>
        <Link to="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create an audience
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/3">Name</TableHead>
              <TableHead className="w-1/3">Updated</TableHead>
              <TableHead className="w-32 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audiences.map((audience) => (
              <TableRow key={audience.id}>
                <TableCell className="font-medium">{audience.name}</TableCell>
                <TableCell>{audience.updated}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/dashboard?id=${audience.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(audience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Index;
