from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="C:/guava_yolo/data.yaml",
    epochs=10,
    imgsz=416,   # leve pro seu PC
    batch=4,
    device="cpu",
    workers=0
)