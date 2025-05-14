import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TaskProps, Priority } from "@/components/Task";

export interface ColumnData {
  id: string;
  title: string;
  tasks: TaskProps[];
  position: number;
}

export const useKanbanColumns = () => {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColumns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ColumnData[]>("http://localhost:8000/api/columns/");
      const mappedData = response.data.map((col: any) => ({
        id: col.id,
        title: col.title,
        position: col.position,
        tasks: col.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          priority: task.priority as Priority
        }))
      }));
      setColumns(mappedData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Kanban data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  return { columns, loading, error, refresh: fetchColumns };
};
