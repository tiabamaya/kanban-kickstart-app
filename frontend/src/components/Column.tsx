import React, { useState } from "react";
import Task, { TaskProps, Priority } from "./Task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskProps[];
  onAddTask: (columnId: string, taskTitle: string, priority?: Priority) => void;
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  onPreviewTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column = ({ id, title, tasks, onAddTask, onMoveTask, onPreviewTask, onDeleteTask }: ColumnProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("low");

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") return;

    onAddTask(id, newTaskTitle, priority);

    setNewTaskTitle("");
    setPriority("low");
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onMoveTask(taskId, id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePreviewTask = (taskId: string) => {
    onPreviewTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
  };

  return (
    <div 
      className="border rounded-md w-64 p-3 bg-white dark:bg-gray-900" 
      data-column-id={id}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="font-bold text-lg mb-3">{title}</h2>

      <div className="mb-4 space-y-2">
        <Input
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="critical">Critical</option>
        </select>
        <Button size="sm" className="w-full mt-2" onClick={handleAddTask}>
          Add Task
        </Button>
      </div>

      <div>
        {tasks.map((task) => (
          <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task.id)}>
            <Task
              {...task}
              onPreview={() => handlePreviewTask(task.id)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
