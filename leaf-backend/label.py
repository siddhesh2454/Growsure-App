from ultralytics import YOLO

# Load model
model = YOLO("model.pt")

# Print class names stored inside model
print(model.names)
