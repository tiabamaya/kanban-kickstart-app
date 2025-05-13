
import KanbanBoard from "@/components/KanbanBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Drag and drop tasks between columns</p>
      </header>
      <main>
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
