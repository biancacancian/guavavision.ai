import React, { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PiVideoCamera } from "react-icons/pi";
import { GiFruitBowl } from "react-icons/gi";
import { LiaIndustrySolid } from "react-icons/lia";
import { GrTest } from "react-icons/gr";
import "../App.css";

import heroImg from "../assets/images/folhas.png";
import loteBom from "../assets/images/esteirab.png";
import loteRuim from "../assets/images/esteirar.png";
import defeito from "../assets/images/4.png";
import padrao from "../assets/images/5.png";
import iconecorreto from "../assets/images/correto.webp";
import heroGif from "../assets/images/dete.png";

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("show");
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="fade" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const refs = useRef({
    hero: null,
    titulo: null,
    caso: null,
    desafio: null,
    solucao: null,
    grid: null,
    resultado: null,
  });

  const sections = useMemo(() => Object.values(refs), []);
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= sections.length) return;
      sections[index].current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrent(index);
    },
    [sections]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.findIndex((r) => r.current === entry.target);
            if (idx !== -1) setCurrent(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((r) => { if (r.current) obs.observe(r.current); });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div>
      <header ref={refs.hero} className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-left">
          <h1 className="hero-title">GuavaVision.AI</h1>
          <p className="hero-sub">Para eliminar variações<br />que comprometem sua qualidade.</p>
          <p className="hero-desc">
            Sistema inteligente de inspeção visual de goiabas por visão computacional,
            capaz de identificar defeitos e auxiliar na classificação em tempo real.
          </p>
        </div>
        <div className="hero-right">
          <img src={heroGif} alt="detecção em tempo real" className="hero-gif" />
        </div>
      </header>

      <section ref={refs.titulo} className="section">
        <div className="container center">
          <FadeIn>
            <h2>Automação da Classificação de Goiabas com IA</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="titulo-icons">
              <div className="icon-card">
                <div className="icon-wrap icon-blue"><LiaIndustrySolid /></div>
                <p className="icon-title">Esteira Inteligente</p>
                <p className="icon-desc">Automação da triagem de goiabas em tempo real na linha de produção</p>
              </div>
              <div className="icon-card">
                <div className="icon-wrap icon-blue"><PiVideoCamera /></div>
                <p className="icon-title">Detecção de Defeitos</p>
                <p className="icon-desc">Identificação automática de manchas, danos e podridão com IA</p>
              </div>
              <div className="icon-card">
                <div className="icon-wrap icon-blue"><GiFruitBowl /></div>
                <p className="icon-title">Redução de Perdas</p>
                <p className="icon-desc">Diminuição do desperdício e melhoria na qualidade dos frutos</p>
              </div>
              <div className="icon-card">
                <div className="icon-wrap icon-blue"><GrTest /></div>
                <p className="icon-title">Controle de Qualidade</p>
                <p className="icon-desc">Classificação precisa e padronizada, reduzindo erros da seleção manual</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section section-blue">
        <div className="container">
          <div className="cards-row">
            <FadeIn>
              <div className="text-card">
                <h3 className="red">Caso</h3>
                <p><b>Produção relevante e processo crítico</b></p>
                <p>A goiaba tem forte presença no agronegócio brasileiro, porém sua classificação ainda depende majoritariamente de inspeção manual.</p>
                <ul>
                  <li>+500 mil toneladas produzidas por ano</li>
                  <li>Alta importância econômica e industrial</li>
                  <li>Processo de seleção ainda manual</li>
                </ul>
              </div>
            </FadeIn>

            <div className="card-divider" />

            <FadeIn delay={150}>
              <div className="text-card">
                <h3 className="red">Desafio</h3>
                <p><b>Erro humano gera perda e custo</b></p>
                <p>A inspeção manual é limitada pela percepção humana, impactando diretamente a eficiência e a qualidade do processo.</p>
                <ul>
                  <li>Processo subjetivo e inconsistente</li>
                  <li>Até 30% de perdas na cadeia produtiva</li>
                  <li>Retrabalho e desperdício operacional</li>
                </ul>
              </div>
            </FadeIn>

            <div className="card-divider" />

            <FadeIn delay={300}>
              <div className="text-card">
                <h3 className="red">Solução</h3>
                <p><b>Detecção automatizada de defeitos com IA</b></p>
                <p>O GuavaVision.AI automatiza a inspeção utilizando visão computacional para identificar goiabas com defeitos em tempo real.</p>
                <ul>
                  <li>Classificação: boa vs ruim</li>
                  <li>Redução de erros humanos</li>
                  <li>Maior eficiência na triagem</li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section ref={refs.grid} className="section">
        <div className="container center">
          <FadeIn>
            <h3>Detecção de defeitos em goiabas</h3>
          </FadeIn>
          <div className="grid">
            <FadeIn delay={0}>
              <div><img src={loteBom} alt="lote bom" /><p>Lote ruim</p></div>
            </FadeIn>
            <FadeIn delay={150}>
              <div><img src={loteRuim} alt="lote ruim" /><p>Lote bom</p></div>
            </FadeIn>
            <FadeIn delay={300}>
              <div><img src={defeito} alt="defeito" /><p>Defeito identificado</p></div>
            </FadeIn>
            <FadeIn delay={450}>
              <div><img src={padrao} alt="padrao" /><p>Padrão adequado</p></div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section ref={refs.resultado} className="section">
        <div className="container">
          <div className="resultados-center">
            <FadeIn><h3 className="red">Resultado</h3></FadeIn>
            <FadeIn delay={100}>
              <div className="item">
                <img src={iconecorreto} alt="ok" />
                <p>Padronização na classificação das goiabas</p>
              </div>
            </FadeIn>
            <FadeIn delay={250}>
              <div className="item">
                <img src={iconecorreto} alt="ok" />
                <p>Redução de erros humanos na inspeção</p>
              </div>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="item">
                <img src={iconecorreto} alt="ok" />
                <p>Aumento da eficiência operacional</p>
              </div>
            </FadeIn>
            <FadeIn delay={550}>
              <div className="item">
                <img src={iconecorreto} alt="ok" />
                <p>Melhoria na qualidade final do produto</p>
              </div>
            </FadeIn>
            <FadeIn delay={700}>
              <div className="center" style={{ marginTop: "40px" }}>
                <button className="btn" onClick={() => navigate("/demo")}>
                  Iniciar demonstração
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

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

export default Home;