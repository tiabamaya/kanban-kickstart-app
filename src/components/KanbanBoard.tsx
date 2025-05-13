
import React, { useState } from "react";
import Column from "./Column";
import { TaskProps } from "./Task";
import { toast } from "@/hooks/use-toast";

interface ColumnData {
  id: string;
  title: string;
  tasks: TaskProps[];
}

const initialColumns: ColumnData[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "task-1", title: "Research competitors", description: "Look at similar products in the market" },
      { id: "task-2", title: "Design wireframes", description: "Create initial mockups for the app" }
    ]
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      { id: "task-3", title: "Develop landing page", description: "Implement the homepage UI" }
    ]
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: "task-4", title: "Setup project", description: "Initialize repository and configuration" }
    ]
  }
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    const taskId = (e.target as HTMLElement).closest('[data-task-id]')?.getAttribute('data-task-id') || null;
    setDraggedTaskId(taskId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const columnElement = (e.target as HTMLElement).closest('[data-column-id]');
    const columnId = columnElement?.getAttribute('data-column-id') || null;
    
    if (draggedTaskId && columnId) {
      // Find the task and move it to the new column
      const updatedColumns = columns.map(column => {
        // First, find and remove the task from its current column
        const taskToMove = column.tasks.find(task => task.id === draggedTaskId);
        if (taskToMove) {
          return {
            ...column,
            tasks: column.tasks.filter(task => task.id !== draggedTaskId)
          };
        }
        return column;
      });
      
      // Then add it to the target column
      const targetColumnIndex = updatedColumns.findIndex(col => col.id === columnId);
      const sourceColumnTitle = columns.find(col => 
        col.tasks.some(task => task.id === draggedTaskId)
      )?.title;
      const taskToMove = columns
        .flatMap(col => col.tasks)
        .find(task => task.id === draggedTaskId);
      
      if (targetColumnIndex !== -1 && taskToMove) {
        updatedColumns[targetColumnIndex] = {
          ...updatedColumns[targetColumnIndex],
          tasks: [...updatedColumns[targetColumnIndex].tasks, taskToMove]
        };
        
        setColumns(updatedColumns);
        
        // Show toast notification
        toast({
          title: "Task moved",
          description: `"${taskToMove.title}" moved to ${updatedColumns[targetColumnIndex].title}`,
          duration: 2000,
        });
      }
    }
    
    // Reset the dragged task
    setDraggedTaskId(null);
    
    // Remove highlight from the column
    const columnElements = document.querySelectorAll('[data-column-id]');
    columnElements.forEach(col => col.classList.remove('bg-accent'));
  };

  const handleAddTask = (columnId: string, taskTitle: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: TaskProps = {
      id: newTaskId,
      title: taskTitle,
    };
    
    setColumns(prevColumns => prevColumns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    }));
    
    toast({
      title: "Task created",
      description: `"${taskTitle}" added to ${columns.find(col => col.id === columnId)?.title}`,
      duration: 2000,
    });
  };

  return (
    <div 
      className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-2rem)]"
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // Needed to allow dropping
    >
      {columns.map((column) => (
        <Column 
          key={column.id} 
          id={column.id} 
          title={column.title} 
          tasks={column.tasks} 
          onAddTask={handleAddTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
