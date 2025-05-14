
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Grab, Calendar, Clock, AlertTriangle, Flag, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type Priority = "low" | "medium" | "critical";

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  column: string;
  onPreview?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const getPriorityColor = (priority?: Priority) => {
  switch (priority) {
    case "critical":
      return "text-red-500";
    case "medium":
      return "text-amber-500";
    case "low":
      return "text-green-500";
    default:
      return "text-muted-foreground";
  }
};

const priorityColors: Record<string, string> = {
  critical: "#ef4444",  // Tailwind red-500
  medium: "#facc15",    // Tailwind yellow-400
  low: "#22c55e",       // Tailwind green-500
  none: "#9ca3af",      // Tailwind gray-400
};

const Task = ({ id, title, description, dueDate, priority, onPreview, onDelete  }: TaskProps) => {
  const isOverdue = dueDate && new Date() > dueDate;
  
return (
    <div
      className="flex flex-col gap-2 p-4 bg-white shadow-sm rounded-lg border hover:shadow-md relative"
      draggable
      data-task-id={id}
    >
      {/* Header: Drag Icon + Title + Priority */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Grab size={14} className="text-gray-400 cursor-grab" />
          <h3 className="font-semibold text-sm truncate">{title}</h3>
        </div>
        <span title={`Priority: ${priority}`}>
  <Flag
    size={14}
    stroke={priorityColors[priority]} // ✅ Stroke only color
  />
</span>

      </div>

      {/* Description (2 lines max) */}
      {description && (
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Calendar size={12} />
        {dueDate ? (
          <span className={isOverdue ? "text-red-500" : ""}>
            {new Date(dueDate).toLocaleDateString()}
          </span>
        ) : (
          <span>No due date</span>
        )}
      </div>

      {/* Action Icons */}
      <div className="flex justify-end gap-3 mt-2 text-gray-500">
        <button
          onClick={() => onPreview?.(id)}
          className="hover:text-blue-500"
          title="Preview"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className="hover:text-red-500"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Task;
