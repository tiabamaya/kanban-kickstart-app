
import KanbanBoard from "@/components/KanbanBoard";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
