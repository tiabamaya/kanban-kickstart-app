
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Grab, Calendar, Clock, AlertTriangle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type Priority = "low" | "medium" | "critical";

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
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

const Task = ({ id, title, description, dueDate, priority }: TaskProps) => {
  const isOverdue = dueDate && new Date() > dueDate;
  
  return (
    <Card 
      className={cn(
        "mb-3 cursor-grab active:cursor-grabbing",
        isOverdue && "border-red-200 bg-red-50 dark:bg-red-950/10"
      )}
      draggable="true"
      data-task-id={id}
    >
      <CardContent className="p-3 flex items-center gap-2">
        <Grab className="text-muted-foreground flex-shrink-0" />
        <div className="w-full">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm">{title}</h3>
            {priority && (
              <Flag className={cn("h-4 w-4", getPriorityColor(priority))} />
            )}
          </div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          {dueDate && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className={cn(isOverdue ? "text-red-500 font-medium" : "text-muted-foreground")}>
                {format(dueDate, "MMM d, yyyy")}
                {isOverdue && (
                  <span className="ml-1 inline-flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Overdue
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Task;
