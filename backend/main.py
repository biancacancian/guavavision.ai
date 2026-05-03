import base64
import cv2
import numpy as np
import tempfile
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
model = YOLO(MODEL_PATH)

app = FastAPI(title="GuavaVision API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print(" Modelo carregado. Classes:", model.names)


@app.post("/analisar")
async def analisar(file: UploadFile = File(...)):
    
    contents = await file.read()
    nparr    = np.frombuffer(contents, np.uint8)
    img      = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return JSONResponse(status_code=400, content={"erro": "Frame inválido"})

    results   = model(img, conf=0.01, verbose=False)
    result    = results[0]
    annotated = result.plot()

    boas     = 0
    defeitos = 0

    if result.boxes is not None:
        for box in result.boxes:
            cls_id   = int(box.cls[0])
            cls_name = model.names.get(cls_id, "").lower()
            if "ruim" in cls_name or "defeito" in cls_name or "bad" in cls_name or "defect" in cls_name:
                defeitos += 1
            else:
                boas += 1

    total = boas + defeitos
    if total == 0:
        lote = "—"
    elif defeitos / total >= 0.3:
        lote = "Ruim"
    else:
        lote = "Bom"

    _, buffer = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 80])
    img_b64   = base64.b64encode(buffer).decode("utf-8")

    return {"imagem_anotada": img_b64, "boas": boas, "defeitos": defeitos, "lote": lote}


@app.get("/")
def root():
    return {"status": "GuavaVision API online"}