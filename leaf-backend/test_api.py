import requests
import base64

url = "http://127.0.0.1:8000/detect"
files = {"file": open("Guava.jpeg", "rb")}

response = requests.post(url, files=files).json()

print("Detected diseases:")
for d in response["detected_diseases"]:
    print(f"- {d['disease']}: {d['solution']}")

# Save annotated image locally from base64
if response["annotated_image_base64"]:
    img_data = base64.b64decode(response["annotated_image_base64"])
    with open("annotated_output.jpeg", "wb") as f:
        f.write(img_data)
    print("✅ Annotated image saved as annotated_output.jpeg")
else:
    print("⚠️ No base64 image returned!")
