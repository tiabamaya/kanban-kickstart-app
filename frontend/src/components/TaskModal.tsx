import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { TaskProps } from './Task'; // Adjust the path if necessary


interface TaskModalProps {
  task: TaskProps | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: TaskProps) => void;
  onRefresh: () => Promise<void>;
}

const TaskModal = ({ task, isOpen, onClose, onSave }: TaskModalProps) => {
  const [editedTask, setEditedTask] = useState<TaskProps | null>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!editedTask) return null;

const handleSave = async () => {
  if (!editedTask) return;

  const dueDateString = editedTask.dueDate
    ? new Date(editedTask.dueDate).toISOString().split("T")[0]
    : null;

  const updatedTask = {
    ...editedTask,
    due_date: dueDateString
  };

  try {
    await onSave(updatedTask);
    onClose();
  } catch (error) {
    console.error("Failed to save task", error);
  }
};



  const handleChange = (field: keyof TaskProps, value: any) => {
    setEditedTask((prev) => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        {/* Editable Fields */}
        <div className="space-y-3">
          <Input
            value={editedTask.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Task Title"
          />
          <Textarea
            value={editedTask.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Task Description"
          />
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <Input
              type="date"
              value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
              onChange={(e) => handleChange("dueDate", new Date(e.target.value))}
            />
          </div>
          <Select
            value={editedTask.priority || "none"}
            onValueChange={(value) => handleChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
