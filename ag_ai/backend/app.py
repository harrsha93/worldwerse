from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI()

# Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
WORKFLOW_IMG = "workflow.png"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return JSONResponse({"message": f"Uploaded {file.filename}"})
    except Exception as e:
        return JSONResponse({"message": f"Upload failed: {str(e)}"}, status_code=500)

@app.post("/workflow/")
async def generate_workflow():
    try:
        # For demo: return a static PNG. Replace with Graphviz/Mermaid generation.
        if not os.path.exists(WORKFLOW_IMG):
            # create a placeholder PNG if missing
            from PIL import Image, ImageDraw
            img = Image.new("RGB", (400, 200), color=(30, 30, 30))
            draw = ImageDraw.Draw(img)
            draw.text((50, 90), "Workflow Diagram", fill=(255, 0, 0))
            img.save(WORKFLOW_IMG)

        return FileResponse(WORKFLOW_IMG, media_type="image/png")
    except Exception as e:
        return JSONResponse({"message": f"Workflow generation failed: {str(e)}"}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
