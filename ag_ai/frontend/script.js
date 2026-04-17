const backend = "http://127.0.0.1:8000"; // change if deployed

// Upload file to backend
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    alert("Please select a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    console.log("Uploading file to:", `${backend}/upload/`);
    const res = await fetch(`${backend}/upload/`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    alert(data.message || "File uploaded successfully");
  } catch (err) {
    console.error("Upload error:", err);
    alert("Error uploading file. Check if backend is running.");
  }
}

// Generate workflow image
async function generateWorkflow() {
  try {
    console.log("Requesting workflow from:", `${backend}/workflow/`);
    const res = await fetch(`${backend}/workflow/`, { method: "POST" });

    if (!res.ok) throw new Error(`Workflow generation failed: ${res.status} ${res.statusText}`);

    // Backend returns PNG, so handle as blob
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const workflowDiv = document.getElementById("workflow");
    workflowDiv.innerHTML = `
      <h3>Generated Workflow</h3>
      <img src="${url}" alt="Workflow Diagram"
           style="width:80%;border:2px solid #e60012;border-radius:8px;">
    `;
  } catch (err) {
    console.error("Workflow error:", err);
    alert("Error generating workflow. Check if backend is running.");
  }
}
