import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ImLab } from "react-icons/im";
import { LuCookie } from "react-icons/lu";
import { LuTestTubeDiagonal } from "react-icons/lu";
import { FaBrain } from "react-icons/fa";
import "../Demo.css";

const API = "http://localhost:8000";

const S = {
  page: {
    minHeight: "100vh", background: "#fff",
    fontFamily: "'Segoe UI', sans-serif", color: "#111",
    display: "flex", flexDirection: "column",
  },
  header: {
    background: "#00579d",
    color: "#fff",
    padding: "0 40px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  logo: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: "#fff",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "25px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "transparent",
    border: "1.5px solid rgb(255, 255, 255)",
    color: "#fff",
    padding: "7px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    transition: "border-color 0.2s, background 0.2s",
  },

  benefitsRow: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginBottom: 32,
    flexWrap: "wrap",
  },
  benefitCard: {
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },
  benefitTitle: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "#111",
    margin: 0,
  },
  benefitDesc: {
    fontSize: "0.82rem",
    color: "#666",
    margin: 0,
    lineHeight: 1.5,
  },

  main: {
    flex: 1, padding: "40px 60px",
    maxWidth: 1100, margin: "0 auto", width: "100%",
  },

  modeRow: { display: "flex", gap: 16, justifyContent: "center", marginBottom: 28, marginTop: 8 },
  modeBtn: (active) => ({
    background: active ? "#00406f" : "#00579d",
    color: "#fff",
    border: "none",
    padding: "13px 32px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "1rem",
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: "0.05em",
    cursor: "pointer",
    flex: 1,
    maxWidth: 280,
    transition: "background .2s, transform .15s, box-shadow .2s",
    transform: active ? "scale(1.04)" : "scale(1)",
    boxShadow: active
      ? "0 6px 20px rgba(0,87,157,0.45)"
      : "0 2px 8px rgba(0,87,157,0.2)",
  }),

  viewBox: {
    background: "transparent",
    border: "1.5px solid #111",
    borderRadius: 8,
    minHeight: 360,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", position: "relative",
    overflow: "visible", marginBottom: 28,
  },
  viewPlaceholder: {
    color: "#fff", fontWeight: 700, fontSize: "1rem",
    textAlign: "center", lineHeight: 2.2, padding: 24,
  },
  annotatedImg: {
    width: "100%", maxHeight: 440,
    objectFit: "contain", display: "block", borderRadius: 6,
  },
  liveVideo: { width: "100%", maxHeight: 440, objectFit: "contain", borderRadius: 6 },

  progressBar: (pct) => ({
    position: "absolute", bottom: 0, left: 0,
    height: 5, width: `${pct}%`,
    background: "#fff", transition: "width 0.1s linear",
  }),
  badge: {
    position: "absolute", top: 10, right: 10,
    background: "rgba(0,0,0,0.55)", color: "#fff",
    fontSize: "0.75rem", fontWeight: 700,
    padding: "4px 10px", borderRadius: 20,
  },

  resultsRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: 12,
  },
  resultsTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#00579d",
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: "0.03em",
  },
  novaBtn: {
    background: "#00579d",
    color: "#fff",
    border: "none",
    padding: "13px 32px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "1rem",
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: "0.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,87,157,0.2)",
    transition: "background .2s, box-shadow .2s",
  },
  resultsBox: {
    background: "transparent",
    border: "1.5px solid #111",
    borderRadius: 8,
    padding: "28px 36px",
    color: "#111",
    fontWeight: 600,
    fontSize: "1.05rem",
    lineHeight: 2.4,
    textAlign: "center",
  },
  spinner: {
    width: 44, height: 44,
    border: "5px solid rgba(255,255,255,.3)",
    borderTop: "5px solid #fff", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
  },
};

export default function Demo() {
  const navigate = useNavigate();

  const [mode,      setMode]      = useState("idle");
  const [status,    setStatus]    = useState("idle");
  const [resultImg, setResultImg] = useState(null);
  const [progress,  setProgress]  = useState(0);
  const [frameInfo, setFrameInfo] = useState("");
  const [errorMsg,  setErrorMsg]  = useState("");

  const [counts, setCounts] = useState({ boa: 0, ruim: 0, lote: "—" });
  const accBoas     = useRef(0);
  const accDefeitos = useRef(0);

  const fileInputRef   = useRef(null);
  const hiddenVideoRef = useRef(null);
  const canvasRef      = useRef(null);
  const liveVideoRef   = useRef(null);
  const streamRef      = useRef(null);
  const intervalRef    = useRef(null);
  const playingRef     = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => cleanup();
  }, []);

  const cleanup = () => {
    playingRef.current = false;
    clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleNova = () => {
    cleanup();
    setMode("idle"); setStatus("idle");
    setResultImg(null); setProgress(0); setFrameInfo("");
    setCounts({ boa: 0, ruim: 0, lote: "—" });
    accBoas.current = 0; accDefeitos.current = 0;
    setErrorMsg("");
  };

  const handleModeFile = () => {
    cleanup();
    setMode("file"); setStatus("idle");
    setResultImg(null); setProgress(0);
    setCounts({ boa: 0, ruim: 0, lote: "—" });
    accBoas.current = 0; accDefeitos.current = 0;
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const isVideo = file.type.startsWith("video/");
    if (isVideo) processVideo(file);
    else processImage(file);
  };

  const processImage = async (file) => {
    setStatus("loading"); setResultImg(null);
    accBoas.current = 0; accDefeitos.current = 0;
    const form = new FormData();
    form.append("file", file);
    try {
      const res  = await fetch(`${API}/analisar`, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setResultImg(`data:image/jpeg;base64,${data.imagem_anotada}`);
      setCounts({ boa: data.boas, ruim: data.defeitos, lote: data.lote });
      setStatus("done");
    } catch (err) {
      setStatus("error"); setErrorMsg(err.message);
    }
  };

  const processVideo = (file) => {
    setStatus("playing"); setResultImg(null);
    setProgress(0); setFrameInfo("");
    accBoas.current = 0; accDefeitos.current = 0;
    setCounts({ boa: 0, ruim: 0, lote: "—" });
    const url   = URL.createObjectURL(file);
    const video = hiddenVideoRef.current;
    video.src   = url;
    video.load();
    video.onloadedmetadata = () => {
      playingRef.current = true;
      runVideoLoop(video, url);
    };
  };

  const runVideoLoop = async (video, url) => {
    const canvas     = canvasRef.current;
    const ctx        = canvas.getContext("2d");
    const duration   = video.duration;
    const FPS_SEND   = 2;
    const interval   = 1 / FPS_SEND;
    let   currentTime = 0;
    let   frameNum    = 0;
    const totalFrames = Math.floor(duration * FPS_SEND);

    const sendFrame = () => new Promise((resolve) => {
      video.currentTime = currentTime;
      video.onseeked = () => {
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(async (blob) => {
          if (!blob) { resolve(); return; }
          const form = new FormData();
          form.append("file", blob, "frame.jpg");
          try {
            const res  = await fetch(`${API}/analisar`, { method: "POST", body: form });
            if (res.ok) {
              const data = await res.json();
              accBoas.current     += data.boas;
              accDefeitos.current += data.defeitos;
              const total   = accBoas.current + accDefeitos.current;
              const loteAcc = total === 0 ? "—"
                : accDefeitos.current / total >= 0.3 ? "Ruim" : "Bom";
              setResultImg(`data:image/jpeg;base64,${data.imagem_anotada}`);
              setCounts({ boa: accBoas.current, ruim: accDefeitos.current, lote: loteAcc });
            }
          } catch { /* ignora */ }
          resolve();
        }, "image/jpeg", 0.75);
      };
    });

    while (playingRef.current && currentTime <= duration) {
      frameNum++;
      const pct = Math.min(100, Math.round((currentTime / duration) * 100));
      setProgress(pct);
      setFrameInfo(`${frameNum} / ${totalFrames}`);
      await sendFrame();
      currentTime += interval;
    }

    URL.revokeObjectURL(url);
    if (playingRef.current) {
      setStatus("done");
      setProgress(100);
      setFrameInfo("Concluído");
    }
  };

  const handleModeCamera = async () => {
    cleanup();
    setMode("camera"); setStatus("loading");
    setResultImg(null); setProgress(0);
    setCounts({ boa: 0, ruim: 0, lote: "—" });
    accBoas.current = 0; accDefeitos.current = 0;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      liveVideoRef.current.srcObject = stream;
      liveVideoRef.current.play();
      setStatus("camera");
      intervalRef.current = setInterval(captureAndSend, 800);
    } catch {
      setStatus("error"); setErrorMsg("Não foi possível acessar a câmera.");
    }
  };

  const captureAndSend = useCallback(async () => {
    const video  = liveVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const form = new FormData();
      form.append("file", blob, "frame.jpg");
      try {
        const res  = await fetch(`${API}/analisar`, { method: "POST", body: form });
        if (!res.ok) return;
        const data = await res.json();
        accBoas.current     += data.boas;
        accDefeitos.current += data.defeitos;
        const total   = accBoas.current + accDefeitos.current;
        const loteAcc = total === 0 ? "—"
          : accDefeitos.current / total >= 0.3 ? "Ruim" : "Bom";
        setResultImg(`data:image/jpeg;base64,${data.imagem_anotada}`);
        setCounts({ boa: accBoas.current, ruim: accDefeitos.current, lote: loteAcc });
      } catch { /* silencioso */ }
    }, "image/jpeg", 0.75);
  }, []);

  
  const renderView = () => {
    if (mode === "camera") {
      return (
        <div style={S.viewBox} className="demo-view-box">
          {resultImg
            ? <img src={resultImg} alt="frame anotado" style={S.annotatedImg} />
            : <video ref={liveVideoRef} style={S.liveVideo} autoPlay muted playsInline />
          }
          {status === "loading" && (
            <div style={{ position: "absolute" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={S.spinner} />
            </div>
          )}
        </div>
      );
    }

    if (resultImg && (status === "playing" || status === "done")) {
      return (
        <div style={S.viewBox} className="demo-view-box">
          <img src={resultImg} alt="Análise" style={S.annotatedImg} />
          {status === "playing" && (
            <>
              <div style={S.progressBar(progress)} />
              <div style={S.badge}>{frameInfo && `Frame ${frameInfo}`}</div>
            </>
          )}
          {status === "done" && (
            <div style={S.badge}> Análise concluída</div>
          )}
        </div>
      );
    }

    if (status === "loading") {
      return (
        <div style={S.viewBox} className="demo-view-box">
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={S.spinner} />
          <p style={{ color: "#111", fontWeight: 700 }}>Analisando...</p>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div style={S.viewBox} className="demo-view-box">
          <p style={{ color: "#c00", fontWeight: 700, padding: 20 }}>⚠️ {errorMsg}</p>
        </div>
      );
    }

    return <div style={S.viewBox} className="demo-view-box" />;
  };

  
  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

     
      <header style={S.header} className="demo-header">
        <button
          style={S.backBtn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
            e.currentTarget.style.background  = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            e.currentTarget.style.background  = "transparent";
          }}
          onClick={() => { cleanup(); navigate("/"); }}
        >
          Voltar
        </button>

        <span style={S.logo} className="demo-logo">GuavaVision.AI</span>

        <div style={{ width: 90 }} />
      </header>

      
      <input ref={fileInputRef} type="file" accept="image/*,video/*"
        style={{ display: "none" }} onChange={handleFileChange} />
      <video ref={hiddenVideoRef} style={{ display: "none" }} muted />
      <canvas ref={canvasRef}    style={{ display: "none" }} />
      <video ref={liveVideoRef}  style={{ display: "none" }} autoPlay muted playsInline />

      
      <main style={S.main} className="demo-main">

        
        <div style={S.benefitsRow} className="demo-benefits-row">
          {[
            {
              icon: <LuCookie />,
              color: "#e8f5e9", iconColor: "#964B00",
              title: "Algoritmo",
              desc: "Algoritmo proposto para trabalhar na classificação de goiabas em esteiras de seleção",
            },
            {
              icon: <LuTestTubeDiagonal />,
              color: "#e3f2fd", iconColor: "#1565c0",
              title: "Ambiente de demonstração",
              desc: "Execução simulada do algoritmo, ilustrando seu funcionamento",
            },
            {
              icon:  <FaBrain />,
              color: "#fce4ec", iconColor: "#c62828",
              title: "Execução do modelo",
              desc: "Exemplo do YOLO em funcionamento na detecção de goiabas",
            },
            
            {
              icon: <ImLab />,
              color: "#fff8e1", iconColor: "#f57f17",
              title: "Estudo experimental",
              desc: "Sistema em fase de estudo, sujeito a erros e variações nas detecções",
            },
          ].map((b, i) => (
            <div key={i} style={S.benefitCard} className="demo-benefit-card">
              <div style={{ ...S.benefitIcon, background: b.color, color: b.iconColor }}>
                {b.icon}
              </div>
              <p style={S.benefitTitle}>{b.title}</p>
              <p style={S.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>

        
        <p
          className="demo-mode-label"
          style={{
            textAlign: "center",
            color: "#00579d",
            fontWeight: 700,
            fontSize: "1.8rem",
            marginBottom: 16,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "0.03em",
          }}
        >
          Selecione a forma de análise:
        </p>

        
        <div style={S.modeRow} className="demo-mode-row">
          <button style={S.modeBtn(mode === "file")} onClick={handleModeFile}>
            Enviar imagem ou vídeo
          </button>
          <button style={S.modeBtn(mode === "camera")} onClick={handleModeCamera}>
            Usar câmera ao vivo
          </button>
        </div>

        
        {renderView()}

        
        <div style={S.resultsRow} className="demo-results-row">
          <span style={S.resultsTitle}>Resultados</span>
          <button style={S.novaBtn} onClick={handleNova}>Nova análise</button>
        </div>

        <div style={S.resultsBox} className="demo-results-box">
          <div>Quantidade de goiabas boas: <strong>{counts.boa}</strong></div>
          <div>Quantidade de goiabas com defeito: <strong>{counts.ruim}</strong></div>
          <div>Classificação do lote: <strong>{counts.lote}</strong></div>
        </div>

      </main>

      
      <footer className="footer">
        <div className="footer-left">
          <span className="footer-logo">GuavaVision.AI</span>
        </div>
        <div className="footer-right">
          <div className="footer-icons">
            <a href="https://github.com/BiancaCancian" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/biancacancian" target="_blank" rel="noopener noreferrer" className="footer-icon">
              <FaLinkedin />
            </a>
          </div>
          <span className="footer-copy">©2026 Bianca Cancian. TCC Ciência da Computação.</span>
        </div>
      </footer>
    </div>
  );
}