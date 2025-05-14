
import React, { useState, useEffect } from "react";
import Column from "./Column";
import { TaskProps, Priority } from "./Task";
import { toast } from "@/hooks/use-toast";
import TaskStatistics from "./TaskStatistics";
import PriorityDistribution from "./PriorityDistribution";

interface ColumnData {
  id: string;
  title: string;
  tasks: TaskProps[];
}

const initialColumns: ColumnData[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: []
  },
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { 
        id: "task-1", 
        title: "Research competitors", 
        description: "Look at similar products in the market",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        priority: "medium" as Priority
      },
      { 
        id: "task-2", 
        title: "Design wireframes", 
        description: "Create initial mockups for the app",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        priority: "critical" as Priority
      }
    ]
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      { 
        id: "task-3", 
        title: "Develop landing page", 
        description: "Implement the homepage UI",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        priority: "critical" as Priority
      }
    ]
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { 
        id: "task-4", 
        title: "Setup project", 
        description: "Initialize repository and configuration",
        dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
        priority: "low" as Priority
      }
    ]
  }
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  // Check for overdue tasks and move them to backlog
  useEffect(() => {
    const moveOverdueTasks = () => {
      const now = new Date();
      let tasksMovedToBacklog = false;
      
      const updatedColumns = columns.map(column => {
        if (column.id === "backlog") return column;
        
        const overdueTasks = column.tasks.filter(task => 
          task.dueDate && new Date(task.dueDate) < now && column.id !== "done"
        );
        
        if (overdueTasks.length > 0) {
          tasksMovedToBacklog = true;
          return {
            ...column,
            tasks: column.tasks.filter(task => 
              !task.dueDate || new Date(task.dueDate) >= now || column.id === "done"
            )
          };
        }
        
        return column;
      });
      
      if (tasksMovedToBacklog) {
        // Find all overdue tasks from non-backlog, non-done columns
        const allOverdueTasks = columns
          .filter(column => column.id !== "backlog" && column.id !== "done")
          .flatMap(column => column.tasks.filter(task => 
            task.dueDate && new Date(task.dueDate) < now
          ));
          
        // Add them to backlog
        const backlogIndex = updatedColumns.findIndex(col => col.id === "backlog");
        if (backlogIndex !== -1 && allOverdueTasks.length > 0) {
          updatedColumns[backlogIndex] = {
            ...updatedColumns[backlogIndex],
            tasks: [...updatedColumns[backlogIndex].tasks, ...allOverdueTasks]
          };
          
          setColumns(updatedColumns);
          
          // Show toast notification
          if (allOverdueTasks.length === 1) {
            toast({
              title: "Task moved to Backlog",
              description: `"${allOverdueTasks[0].title}" is overdue and has been moved to Backlog`,
              duration: 3000,
            });
          } else {
            toast({
              title: "Tasks moved to Backlog",
              description: `${allOverdueTasks.length} overdue tasks have been moved to Backlog`,
              duration: 3000,
            });
          }
        }
      }
    };
    
    moveOverdueTasks();
    
    // Check every hour for overdue tasks
    const interval = setInterval(moveOverdueTasks, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [columns]);
  
  // Calculate statistics
  const getColumnStats = () => {
    return columns.map(column => ({
      name: column.title,
      count: column.tasks.length
    }));
  };
  
  const getPriorityStats = () => {
    const counts = {
      critical: 0,
      medium: 0,
      low: 0,
      none: 0
    };
    
    columns.forEach(column => {
      column.tasks.forEach(task => {
        if (task.priority) {
          counts[task.priority]++;
        } else {
          counts.none++;
        }
      });
    });
    
    return [
      { name: "Critical", count: counts.critical },
      { name: "Medium", count: counts.medium },
      { name: "Low", count: counts.low },
      { name: "None", count: counts.none }
    ];
  };

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

  const handleAddTask = (columnId: string, taskTitle: string, dueDate?: Date, priority?: Priority) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: TaskProps = {
      id: newTaskId,
      title: taskTitle,
      dueDate,
      priority
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
    <div className="flex flex-col gap-6 px-4 w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TaskStatistics data={getColumnStats()} />
    <PriorityDistribution data={getPriorityStats()} />
  </div>

  {/* Wrap this in a centered container */}
  <div className="w-full flex justify-center">
    <div
      className="w-fit"
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex gap-4 min-h-[calc(100vh-20rem)]">
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
    </div>
  </div>
</div>

  );
};

export default KanbanBoard;
