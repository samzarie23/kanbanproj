import React, { useState } from "react";
import { useDrag } from "react-dnd";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  due_date: string;
  columnId: number; 
  status: string;
}

const Task: React.FC<TaskProps> = ({ id, title, description, due_date, columnId, status }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const due_dateObj = new Date(due_date);
  const formattedDueDate =
    due_dateObj instanceof Date && !isNaN(due_dateObj.getTime())
      ? due_dateObj.toLocaleDateString()
      : "No Due Date";
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const downloadDoc = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      //Get document ID
      const docIdResponse = await fetch(`http://localhost:3000/api/get-doc-id?taskId=${id}`, {
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
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      setLoadingComments(true);
      const response = await fetch(`http://localhost:3000/api/get-task-comments?taskId=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      setComments(data.comments.recordset || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    fetchComments();
  };
  const borderColor =
  status === "Awaiting Approval"
    ? "#FFD700" //Yellow
    : status === "Approved"
    ? "#28a745" //Green
    : "#000000"; //Default black
  return (
    <div
      ref={drag}
      style={{
        backgroundColor: "#CFCFCF",
        padding: "7px",
        margin: "5px 0",
        border: `2px solid ${borderColor}`,
        borderRadius: "4px",
        textAlign: "center",
        fontSize: "1.2vw",
        fontWeight: "bold",
        fontFamily: "Helvetica, Arial, sans-serif",
        cursor: "move",
        maxWidth: isHovered ? "100%" : "100%",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        boxShadow: isHovered ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        opacity: isDragging ? 0.5 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>{title}</div>
      {isHovered && (
        <div style={{ marginTop: "10px", fontSize: "1vw" }}>
          <div style={{ textAlign: "left", fontSize: ".75vw" }}>
            Description: {description}
          </div>
          <div
            style={{ textAlign: "left", fontSize: ".75vw", marginTop: "10px" }}
          >
            Due Date: {formattedDueDate}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "5px",
                marginTop: "10px",
                maxHeight: "100px",
                overflowY: "auto",
                fontSize: ".65vw",
                textAlign: "left",
              }}
            >
              <strong>Comments:</strong>
              {loadingComments ? (
                <div>Loading...</div>
              ) : comments.length === 0 ? (
                <div>No comments</div>
              ) : (
                <ul style={{ paddingLeft: "15px", margin: 0 }}>
                  {comments.map((comment, idx) => (
                    <li key={idx}>{comment.content}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              style={{
                backgroundColor: "white",
                color: "#black",
                padding: "0px 0px",
                height: "40px",
                border: "none",
                borderRadius: "4px",
                fontSize: ".5vw",
                fontWeight: "bold",
                cursor: "pointer",
                width: "40px",
              }}
              onClick={downloadDoc}
            >
              <img
                src="src\\assets\\images\\image 9.png"
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
