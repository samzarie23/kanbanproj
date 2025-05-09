import React from "react";
import Task from "./Task";
import { useDrop } from "react-dnd";

interface TaskType {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status:string;
}

interface ColumnProps {
  id: number;
  title: string;
  tasks: TaskType[];
  onTaskDrop: (taskId: string, columnId: number) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, onTaskDrop }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string; columnId: number }) => {
      if (item.columnId !== id) {
        console.log(`Task ${item.id} moved to column ${id}`);
        onTaskDrop(item.id, id);
        item.columnId = id;
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));
  return (
    <div
      ref={drop}
      style={{
        backgroundColor: "#EAEAEA",
        padding: "15px",
        border: "5px solid #D22030",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "240px",
        height: "800px",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          marginBottom: "10px",
          textAlign: "center",
          fontSize: "1.6vw",
          fontWeight: "bold",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {tasks.map((task, index) => (
          <Task
            key={index}
            id={task.task_id}
            columnId={id}
            title={task.title}
            description={task.description}
            due_date={task.due_date}
            status={task.status}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
