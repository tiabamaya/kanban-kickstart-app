
import React from "react";
import Task, { TaskProps } from "./Task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ColumnProps {
  title: string;
  tasks: TaskProps[];
  id: string;
  onAddTask: (columnId: string, taskTitle: string) => void;
}

const Column = ({ title, tasks, id, onAddTask }: ColumnProps) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(id, newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-accent");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-accent");
  };

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-3 border-b bg-muted/50">
          <h2 className="font-semibold">{title}</h2>
          <div className="text-xs text-muted-foreground mt-1">{tasks.length} tasks</div>
        </div>
        <div 
          className="p-3 min-h-40 transition-colors"
          data-column-id={id}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDragLeave}
        >
          {tasks.map((task) => (
            <Task key={task.id} id={task.id} title={task.title} description={task.description} />
          ))}
          
          {isAdding ? (
            <div className="mt-3">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTask}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="w-full mt-2 justify-start text-muted-foreground" 
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;
