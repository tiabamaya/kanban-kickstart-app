
import React, { useState } from "react";
import Task, { TaskProps, Priority } from "./Task";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface ColumnProps {
  title: string;
  tasks: TaskProps[];
  id: string;
  onAddTask: (columnId: string, taskTitle: string, dueDate?: Date, priority?: Priority) => void;
}

const Column = ({ title, tasks, id, onAddTask }: ColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(undefined);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(id, newTaskTitle.trim(), newTaskDueDate, newTaskPriority);
      setNewTaskTitle("");
      setNewTaskDueDate(undefined);
      setNewTaskPriority(undefined);
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
            <Task 
              key={task.id} 
              id={task.id} 
              title={task.title} 
              description={task.description}
              dueDate={task.dueDate}
              priority={task.priority}
            />
          ))}
          
          {isAdding ? (
            <div className="mt-3 border p-3 rounded-lg bg-background">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="mb-3"
                autoFocus
              />
              
              <div className="flex flex-col gap-3 mb-3">
                <Label className="text-xs">Set priority:</Label>
                <RadioGroup 
                  value={newTaskPriority}
                  onValueChange={(value) => setNewTaskPriority(value as Priority)}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-xs text-green-500">Low</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-xs text-amber-500">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical" className="text-xs text-red-500">Critical</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="mb-3">
                <Label className="text-xs mb-1 block">Due date:</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left text-xs"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newTaskDueDate ? format(newTaskDueDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newTaskDueDate}
                      onSelect={(date) => {
                        setNewTaskDueDate(date);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddTask}>Add</Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewTaskTitle("");
                    setNewTaskDueDate(undefined);
                    setNewTaskPriority(undefined);
                  }}
                >
                  Cancel
                </Button>
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
