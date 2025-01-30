export const chatContainerStyle = {
  width: "100%",
  maxWidth: "400px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const messagesStyle = {
  maxHeight: "300px",
  overflowY: "auto",
  padding: "10px",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "5px",
};

export const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

export const buttonStyle = {
  padding: "10px 15px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

buttonStyle[":hover"] = {
  backgroundColor: "#0056b3",
};
