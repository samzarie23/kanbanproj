import React, { useState, useEffect } from "react";
import Landing_Header from "../../components/Global/Landing_Header";
import Dashboard_Bar from "../../components/Global/Dashboard_Bar";
import { useNavigate } from "react-router-dom";
import "./Admin_Landing.css";

const Admin_Landing: React.FC = () => {
  const [tasks, setTasks] = useState({
    toDo: [],
    inProgress: [],
    awaitingApproval: [],
    approved: [],
  });
  const [employees, setEmployees] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [taskToRemove, setTaskToRemove] = useState<any>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedApprovalTask, setSelectedApprovalTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();

  const openApprovalModal = (task: any) => {
    setSelectedApprovalTask(task);
    setIsApprovalModalOpen(true);
    fetchComments(task.task_id);
  };
  const handleApprove = async () => {
      const token = localStorage.getItem("token");

    if (!token || !selectedApprovalTask) return;

    try {
      const response = await fetch("http://localhost:3000/api/approve-task", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId: selectedApprovalTask.task_id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve task: ${errorText}`);
      }

      setIsApprovalModalOpen(false);
      setSelectedApprovalTask(null);
      fetchTasks(); 
    } catch (error) {
      console.error("Error approving task:", error);
      alert("Failed to approve task.");
    }
  };

  const fetchComments = async (taskId: number) => {
    console.log("Fetching comments for task ID:",taskId);
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/get-task-comments?taskId=${taskId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
        const data = await response.json();
        console.log("Response data:", data);

        if (response.ok && data.comments) {
          const commentArray = data.comments.recordset || []; 
          setComments(commentArray);
        } else {
          console.error('No comments available or failed response:', data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
  };
  
  const handleReject = async () => {
    await updateTaskStatus("In Progress");
  };
  
  const updateTaskStatus = async (newStatus: string) => {
    const token = localStorage.getItem("token");
  
    if (!token || !selectedApprovalTask) return;
  
    try {
      const response = await fetch("http://localhost:3000/api/update-task-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: selectedApprovalTask.task_id,
          newStatus,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update task status to "${newStatus}"`);
      }
  
      setIsApprovalModalOpen(false);
      setSelectedApprovalTask(null);
      fetchTasks(); 
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status.");
    }
  };
  

  //Fetch employees
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3000/api/users/search", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch employees");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.users && Array.isArray(data.users)) {
            setEmployees(data.users);
          } else {
            console.error("Unexpected response format:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  //Fetch tasks 
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/admin-tasks", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        if (data && data.tasks) {
          const tasksByStatus = {
            toDo: [],
            inProgress: [],
            awaitingApproval: [],
            approved: [],
          };
          data.tasks.forEach((task: any) => {
            if (task.status === "To Do") {
              tasksByStatus.toDo.push(task);
            } else if (task.status === "In Progress") {
              tasksByStatus.inProgress.push(task);
            } else if (task.status === "Awaiting Approval") {
              tasksByStatus.awaitingApproval.push(task);
            } else if (task.status ==="Approved") {
              tasksByStatus.approved.push(task);
            }
          });
          setTasks(tasksByStatus);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  };

  //Run fetchTasks
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter((employee: any) =>
        employee.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [searchQuery, employees]);

  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");

    return `${month}/${day}/${year}`;
  };
  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedApprovalTask) return;
  
    try {
      await fetch("http://localhost:3000/api/add-comment", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: selectedApprovalTask.task_id,
          content: newComment.trim(),
        }),
      });
  
      setNewComment("");
      fetchComments(selectedApprovalTask.task_id);
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    }
  };

  // Add new task
  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      if (!selectedEmployee) {
        console.error("No employee selected. Please assign an employee to the task.");
        return;
      }
  
      
      let formattedDeadline = "";
      if (newTaskDeadline) {
        const dateObj = new Date(newTaskDeadline);
        dateObj.setDate(dateObj.getDate() + 2);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); 
        const day = String(dateObj.getDate()).padStart(2, "0");
  
        formattedDeadline = `${year}-${month}-${day}`; 
      }
  
      const taskData = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: "To Do",
        due_date: formattedDeadline,
        assignedUsers: [selectedEmployee],
      };
  
      setSelectedEmployee(null); 
  
      try {
        
        const response = await fetch("http://localhost:3000/api/create-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add task: ${errorText}`);
        }
  
        
        const data = await response.json();
        const createdTask = data.task; 
  
        console.log(`Task created:`, createdTask);
  
        
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("taskId", createdTask.toString()); //Link the file to the created task
  
          const fileResponse = await fetch("http://localhost:3000/api/upload-document", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            body: formData,
          });
  
          if (!fileResponse.ok) {
            const errorText = await fileResponse.text();
            throw new Error(`Failed to upload file: ${errorText}`);
          }
          const fileResponseData = await fileResponse.json();
          console.log("File uploaded successfully", fileResponseData);
        }
  
        
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          updatedTasks.toDo.push(createdTask); 
          return updatedTasks;
        });
  
        
        setNewTaskTitle("");
        setSearchQuery("");
        setNewTaskPriority("Medium");
        setNewTaskDeadline("");
        setNewTaskDescription("");
        setFile(null);
        setIsTaskModalOpen(false);
  
        console.log(`Task "${newTaskTitle}" has been successfully assigned to employee ID: ${selectedEmployee}`);
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
        alert(`Error adding task: ${error.message}`);
      }
    } else {
      alert("Please provide a task title.");
    }
  };
  const downloadDoc = async (taskId: string) => {
    console.log("Task ID: ", taskId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      //Get document ID
      const docIdResponse = await fetch(`http://localhost:3000/api/get-doc-id?taskId=${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!docIdResponse.ok) {
        throw new Error("Failed to fetch document ID");
      }

      const docIdData = await docIdResponse.json();
      const documentId = docIdData?.documentId;

      if (!documentId) {
        throw new Error("No document ID found for this task");
      }

      //Download document
      const downloadResponse = await fetch(`http://localhost:3000/api/download-document?documentId=${documentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!downloadResponse.ok) {
        throw new Error("Failed to download document");
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const contentDisposition = downloadResponse.headers.get("Content-Disposition");
      const match = contentDisposition?.match(/filename="?(.+)"?/);
      const filename = match?.[1] || "downloaded_file";

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  
  
  

  //Handle removing a task
  const handleRemoveTask = (taskId: number, category: string) => {
    setTaskToRemove({ taskId, category });
    console.log(taskId);
    setIsRemoveModalOpen(true);
  };
  
  const confirmRemoveTask = async () => {
    if (taskToRemove) {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/api/delete-task", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId: taskToRemove.taskId }), 
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete task: ${errorText}`);
        }
  
        
        fetchTasks();
  
        setIsRemoveModalOpen(false); 
        setTaskToRemove(null);
  
      } catch (error) {
        console.error("Error removing task:", error);
        alert(`Error removing task: ${error.message}`);
      }
    }
  };

  const cancelRemoveTask = () => {
    setIsRemoveModalOpen(false); 
    setTaskToRemove(null); 
  };

  
  const navigateToDashboard = () => {
    navigate("/Admin-Board");
  };

  return (
    <div>
      <Landing_Header />
      <Dashboard_Bar
        title="Dashboard"
        showButton={true}
        buttonLabel="My Board"
        onButtonClick={navigateToDashboard}
      />
      <div className="admin-container">
        <div className="kanban-board">
          {Object.keys(tasks).map((category) => (
            <div key={category} className="kanban-column">
              <h3>{category.replace(/([A-Z])/g, " $1")}</h3>
              {tasks[category].map((task) => {
                const formattedDate = task.due_date ? formatDate(new Date(task.due_date)) : "No deadline";

                return (
                  <div key={task.task_id} className="kanban-task">
                    <h4>{task.title}</h4>
                    <p>Assigned to: {task.username || "Unassigned"}</p>
                    <p>Description: {task.description}</p>
                    <p>Deadline: {formattedDate}</p> 
                    {task.file && (
                      <p>
                        <a href={task.file} target="_blank" rel="noopener noreferrer">
                          Download File
                        </a>
                      </p>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                      {category === "awaitingApproval" && (
                        <button onClick={() => openApprovalModal(task)}>
                          Review Completion
                        </button>
                    )}
                    <button onClick={() => handleRemoveTask(task.task_id, category)}>
                      Remove Task
                    </button>
                  </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="admin-tools">
          <div className="tasks-section">
            <h3>Tasks</h3>
            <button onClick={() => setIsTaskModalOpen(true)}>+ Add Task</button>
          </div>
        </div>
      </div>

      {isTaskModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <input
              type="date"
              value={newTaskDeadline}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
            />

            <div className="employee-dropdown-container">
              <input
                type="text"
                className="employee-dropdown"
                placeholder="Search Employee"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!!selectedEmployee}
              />

              {selectedEmployee === null && filteredEmployees.length > 0 && (
                <div className="employee-dropdown-results">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.user_id}
                      onClick={() => {
                        setSelectedEmployee(employee.user_id);
                        setSearchQuery(employee.username);
                        setFilteredEmployees([]);
                      }}
                      className={selectedEmployee === employee.user_id ? "selected" : ""}
                    >
                      {employee.username}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files ? e.target.files[0] : null);
              }}
            />
            <button onClick={handleAddTask} style={{marginTop: "10px"}}>Add Task</button>
            <button onClick={() => setIsTaskModalOpen(false)} style={{marginTop: "5px"}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Remove task confirmation modal */}
      {isRemoveModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to remove this task?</h3>
            <button onClick={confirmRemoveTask}>Yes, Remove</button>
            <button onClick={cancelRemoveTask} style={{marginTop: "10px"}}>Cancel</button>
          </div>
        </div>
      )}
      {isApprovalModalOpen && selectedApprovalTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Task Review</h3>
            <p><strong>Title:</strong> {selectedApprovalTask.title}</p>
            <p><strong>Description:</strong> {selectedApprovalTask.description}</p>
            <p><strong>Assigned To:</strong> {selectedApprovalTask.username}</p>
            <p><strong>Deadline:</strong> {formatDate(new Date(selectedApprovalTask.due_date))}</p>
            <h4>Comments</h4>
            <ul>
              {comments.length === 0 ? (
                <li>No comments yet.</li>
              ) : (
                comments.map((comment, idx) => (
                  <li key={idx}>{comment.content}</li>
                ))
              )}
            </ul>

            <textarea
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleAddComment}>Add Comment</button>
              <button onClick={()=> downloadDoc(selectedApprovalTask.task_id)} style={{marginTop: "10px"}}>Download File</button>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button onClick={handleApprove} style={{ flex: 1 }}>✅ Approve</button>
                <button onClick={handleReject} style={{ flex: 1 }}>❌ Reject</button>
              </div>
              <button onClick={() => setIsApprovalModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Landing;
