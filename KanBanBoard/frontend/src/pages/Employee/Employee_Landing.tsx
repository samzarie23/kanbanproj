import React, { useEffect, useState } from "react";
import Landing_Header from "../../components/Global/Landing_Header";
import Dashboard_Bar from "../../components/Global/Dashboard_Bar";
import Column from "../../components/Global/Columns";
import { jwtDecode } from "jwt-decode";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const token = localStorage.getItem("token");
let userId = null;

if (token) {
  const decodedToken = jwtDecode<{ id: string }>(token);
  userId = decodedToken.id;
}

const Employee_Landing: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [pendingColumnId, setPendingColumnId] = useState<number | null>(null);

  
  const fetchTasks = async () => {
    try {
      if (!token) {
        throw new Error("No JWT token found");
      }
  
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks, Status Code: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.tasks) {
        throw new Error("Tasks field is missing from the response.");
      }
  
      if (Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else if (typeof data.tasks === "object") {
        data.tasks = Object.values(data.tasks);
        setTasks(data.tasks);
      } else {
        throw new Error("Data format error: tasks should be an array or an object.");
      }
  
      setLoading(false);
    } catch (err: any) {
      console.error("Error:", err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const updateTaskStatus = async (taskId: string, columnId: number)=> {
    const statusMap = {
      1: "To Do",
      2: "In Progress",
      3: "Awaiting Approval"
    };
    const newStatus = statusMap[columnId];
    
    try {
      const response = await fetch('http://localhost:3000/api/update-task-status', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, newStatus}),
      });
      if (!response.ok) throw new Error('Failed to update task');

      await fetchTasks();
    } catch (error: any) {
      console.error(error);
      setError(`Error updating task: ${error.message}`);
    }
  };
  const addComment = async () => {
    try {
      if (comment.trim()) {
        const response = await fetch("http://localhost:3000/api/add-comment", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: selectedTaskId,
          content: comment,
          }),
        });
        if (!response.ok) throw new Error("Failed to add comment");
      }
      await updateTaskStatus(selectedTaskId!, pendingColumnId!);
      setShowModal(false);
      setComment("");
      setSelectedTaskId(null);
      setPendingColumnId(null);
    } catch (error: any) {
      console.error(error);
      setError(`Error adding comment or updating task: ${error.message}`);
    }
  };

  const handleCancelModal = async () => {
    setShowModal(false);
    setComment("");
    setSelectedTaskId(null);
    setPendingColumnId(null);
    await fetchTasks();
  };

  const handleTaskDrop = async (taskId: string, columnId: number)=> {
    if (columnId === 3) {
      setSelectedTaskId(taskId);
      setPendingColumnId(columnId);
      setShowModal(true);
    } else {
      await updateTaskStatus(taskId, columnId);  
    }
  };

  
  
  //Defines Columns
  const columns = [
    {
      id: 1,
      title: "To-Do",
      tasks: tasks.filter((task) => task.status === "To Do"),
    },
    {
      id: 2,
      title: "In Progress",
      tasks: tasks.filter((task) => task.status === "In Progress"),
    },
    {
      id: 3,
      title: "Completed",
      tasks: tasks.filter((task) => task.status === "Awaiting Approval" || task.status === "Approved"),
    },
  ];

  //error or loading message
  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
    <div>
      <Landing_Header />
      <Dashboard_Bar title="My Board" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {columns.map((column) => (
          <Column key={column.id} id={column.id} title={column.title} tasks={column.tasks} onTaskDrop={handleTaskDrop}/>
        ))}
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Submit Task for Review</h3>
            <label htmlFor="comment">Comments (optional):</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button
              style={{
                marginBottom: "10px",
                display: "block",
                backgroundColor: "#f0f0f0",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "#D22030",
              }}
              onClick={()=> alert("File Upload Logic")}
              >
                Upload File
              </button>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={handleCancelModal}>Cancel</button>
              <button
                onClick={addComment}>Confirm</button>
            </div>
          </div>
        </div>
      )

      }
      </div>
    </DndProvider>
  );
};

export default Employee_Landing;
