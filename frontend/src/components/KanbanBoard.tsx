import React, { useState, useEffect } from "react";
import axios from "axios";
import Column from "./Column";
import { TaskProps, Priority } from "./Task";
import TaskModal from "./TaskModal";
import { toast } from "@/hooks/use-toast";
import TaskStatistics from "./TaskStatistics";
import PriorityDistribution from "./PriorityDistribution";
import { Button } from "@/components/ui/button";
import { getPrioritySuggestion } from "@/helpers/getPrioritySuggestion";
import { useNavigate } from "react-router-dom";

interface ColumnData {
  id: string;
  title: string;
  position: number;
  tasks: TaskProps[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

 const fetchColumns = async () => {
  try {
    const response = await axios.get<ColumnData[]>("/api/columns/", {
       headers: { 'Cache-Control': 'no-cache' }
    });
    setColumns(response.data);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
     fetchColumns();
    fetchCurrentUser();
  }, []);

const handleLogout = async () => {
  try {
    await axios.post("/auth/logout/", {}, { withCredentials: true });
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");  // ✅ Correct usage of React Router's navigate
  } catch (error) {
    console.error(error);
  }
};


  

const handleAddTask = async (columnId: string, taskTitle: string) => {
    try {
      const aiPriority = await getPrioritySuggestion(taskTitle);
      console.log(`AI Suggested Priority: ${aiPriority}`);

      await axios.post("/api/tasks/", {
        column: columnId,
        title: taskTitle,
        description: "",
        priority: aiPriority,
      });

      toast({ title: "Task Created", description: `${taskTitle} added.` });
      fetchColumns();
    } catch (err) {
      console.error(err);
    }
  };



  const handleMoveTask = async (taskId: string, targetColumnId: string) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/`, { column: targetColumnId });
      fetchColumns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}/`);
      fetchColumns();
    } catch (err) {
      console.error(err);
    }
  };

const handleUpdateTask = async (updatedTask: TaskProps) => {
  try {
    await axios.patch(`/api/tasks/${updatedTask.id}/`, {
      title: updatedTask.title,
      description: updatedTask.description,
      due_date: updatedTask.dueDate
        ? new Date(updatedTask.dueDate).toISOString().split("T")[0]
        : null,
      priority: updatedTask.priority,
      column: updatedTask.column
    });
     fetchColumns();
    toast({ title: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    toast({ title: "Failed to update task", variant: "destructive" });
  }
};

  const handlePreviewTask = (taskId: string) => {
    const task = columns.flatMap(col => col.tasks).find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get<{ username: string }>("/auth/user/", { withCredentials: true });
      setCurrentUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getColumnStats = () => {
  return columns.map(column => ({
    name: column.title,
    count: column.tasks.length
  }));
};

const getPriorityStats = () => {
    const counts = { critical: 0, medium: 0, low: 0, none: 0 };
    columns.forEach(col =>
      col.tasks.forEach(task =>
        task.priority ? counts[task.priority]++ : counts.none++
      )
    );

    return [
      { name: "Critical", count: counts.critical },
      { name: "Medium", count: counts.medium },
      { name: "Low", count: counts.low },
      { name: "None", count: counts.none }
    ];
  };
  

  return (

    <div className="flex flex-col gap-6 px-4 w-full">
      <div className="flex justify-between items-center py-4">
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TaskStatistics data={getColumnStats()} />
      <PriorityDistribution data={getPriorityStats()} />
    </div>
      <div className="flex gap-4 min-h-[calc(100vh-20rem)]">
        {columns.map((column) => (
  <Column
    key={column.id}
    id={column.id}
    title={column.title}
    tasks={column.tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,  // ✅ map here
      priority: task.priority,
      column: task.column
    }))}
    onAddTask={handleAddTask}
    onMoveTask={handleMoveTask}
    onPreviewTask={handlePreviewTask}
    onDeleteTask={handleDeleteTask}
  />
))}

<Button
  onClick={async () => {
    try {
      const suggestion = await getPrioritySuggestion("Fix critical bug");
      console.log("AI Suggested Priority:", suggestion);
      toast({ title: `AI Suggested Priority: ${suggestion}` });
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    }
  }}
>
  Test AI Suggestion
</Button>

      </div>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateTask}
        onRefresh={fetchColumns} // Add this line
      />
    </div>
  );
};

export default KanbanBoard;
