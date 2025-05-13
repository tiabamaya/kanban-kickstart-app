
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Grab } from "lucide-react";

export interface TaskProps {
  id: string;
  title: string;
  description?: string;
}

const Task = ({ id, title, description }: TaskProps) => {
  return (
    <Card 
      className="mb-3 cursor-grab active:cursor-grabbing"
      draggable="true"
      data-task-id={id}
    >
      <CardContent className="p-3 flex items-center gap-2">
        <Grab className="text-muted-foreground flex-shrink-0" />
        <div className="w-full">
          <h3 className="font-medium text-sm">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default Task;
