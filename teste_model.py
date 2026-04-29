from ultralytics import YOLO


model = YOLO(r"C:\guava_yolo\runs\detect\train6\weights\best.pt")


results = model(
    r"C:\guava_yolo\images_teste\3.png",
    conf=0.01,
    save=True
)


for r in results:
    print("\n=== DETECÇÕES ===")
    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])

        class_name = model.names[cls_id]

        print(f"Classe: {class_name} | Confiança: {conf:.2f}")