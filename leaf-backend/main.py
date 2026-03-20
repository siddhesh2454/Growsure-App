import io
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from google.cloud import firestore
from google.oauth2 import service_account
from PIL import Image
import numpy as np

# Initialize FastAPI
app = FastAPI()

# Allow frontend (React Native / Web) to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
model = YOLO("model.pt")

# Firestore setup
credentials = service_account.Credentials.from_service_account_file(
    "serviceAccountKey.json"
)
db = firestore.Client(credentials=credentials, project=credentials.project_id)

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Read uploaded file
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    # Run YOLO prediction
    results = model(image)

    detected_diseases = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0].item())
            disease_name = model.names[cls_id]

            # Fetch causes, solution, reference from Firestore
            doc_ref = db.collection("diseases").document(disease_name)
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                causes = data.get("causes", "Not available")
                solution = data.get("solution", "Not available")
                reference = data.get("reference", "Not available")
            else:
                causes = "Not available"
                solution = "Not available"
                reference = "Not available"

            detected_diseases.append({
                "disease": disease_name,
                "causes": causes,
                "solution": solution,
                "reference": reference
            })

    # ✅ Generate annotated image
    annotated_img = results[0].plot()  # numpy array
    annotated_img_pil = Image.fromarray(np.uint8(annotated_img))
    annotated_path = "annotated_output.jpeg"
    annotated_img_pil.save(annotated_path)

    # Convert annotated image to base64
    with open(annotated_path, "rb") as f:
        encoded_image = base64.b64encode(f.read()).decode("utf-8")

    return {
        "detected_diseases": detected_diseases,
        "annotated_image_base64": encoded_image
    }

# ✅ Run on LAN + Localhost
# Command to start: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
