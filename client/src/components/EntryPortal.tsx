import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Radio, ScanLine } from "lucide-react";

const logoUrl = "/manus-storage/ajk-college-logo-final_2aecd7dd.png";
const binaryLeft = "01001101 01100001 01110010 01101011 01100101 01110010 00110001";
const binaryRight = "11001001 00110110 10101010 01100001 01011110 11100010 00110101";

export default function EntryPortal({ onInitialize }: { onInitialize: () => void }) {
  const [bootStep, setBootStep] = useState(0);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBootStep(1), 650),
      window.setTimeout(() => setBootStep(2), 1500),
      window.setTimeout(() => setBootStep(3), 2350),
      window.setTimeout(() => setBootStep(4), 3300),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const initialize = () => {
    if (launching || bootStep < 4) return;
    setLaunching(true);
    window.setTimeout(onInitialize, 900);
  };

  return (
    <motion.main className="entry-portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08, filter: "blur(18px)" }} transition={{ duration: .5 }} aria-label="AJK College identity archive boot portal">
      <div className="portal-hud-noise" aria-hidden="true" />
      <div className="portal-binary portal-binary-left" aria-hidden="true">{binaryLeft}<br/>{binaryRight}<br/>{binaryLeft}</div>
      <div className="portal-binary portal-binary-right" aria-hidden="true">{binaryRight}<br/>{binaryLeft}<br/>{binaryRight}</div>
      <div className="portal-scan-bar" aria-hidden="true" />
      <div className="portal-hud-stage" aria-hidden="true">
        <motion.svg className="hud-ring hud-ring-outer" viewBox="0 0 600 600" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: bootStep >= 1 ? .68 : 0, scale: bootStep >= 1 ? 1 : .72, rotate: 360 }} transition={{ opacity: { duration: .5 }, scale: { duration: 1.2 }, rotate: { duration: 28, repeat: Infinity, ease: "linear" } }}>
          <circle cx="300" cy="300" r="268"/><circle cx="300" cy="300" r="238" strokeDasharray="2 18"/><path d="M300 18v42M300 540v42M18 300h42M540 300h42"/>
        </motion.svg>
        <motion.svg className="hud-ring hud-ring-mid" viewBox="0 0 520 520" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: bootStep >= 1 ? .82 : 0, scale: bootStep >= 1 ? 1 : .8, rotate: -360 }} transition={{ opacity: { duration: .6, delay: .15 }, scale: { duration: 1.3 }, rotate: { duration: 19, repeat: Infinity, ease: "linear" } }}>
          <circle cx="260" cy="260" r="218"/><circle cx="260" cy="260" r="184" strokeDasharray="90 12 3 12"/><path d="M260 22v28M260 470v28M22 260h28M470 260h28"/>
        </motion.svg>
        <motion.svg className="hud-ring hud-ring-inner" viewBox="0 0 420 420" initial={{ opacity: 0, scale: .5 }} animate={{ opacity: bootStep >= 1 ? .9 : 0, scale: bootStep >= 1 ? 1 : .5, rotate: 360 }} transition={{ opacity: { duration: .7, delay: .25 }, scale: { duration: 1.5 }, rotate: { duration: 11, repeat: Infinity, ease: "linear" } }}>
          <circle cx="210" cy="210" r="165"/><circle cx="210" cy="210" r="132" strokeDasharray="1 10"/><path d="M210 28v52M210 340v52M28 210h52M340 210h52"/>
        </motion.svg>
        <motion.div className="hud-target" animate={bootStep >= 1 ? { scale: [1, 1.08, 1], opacity: [0.55, 1, .55] } : { opacity: 0 }} transition={{ duration: 2.8, repeat: Infinity }} />
      </div>

      <motion.div className="portal-shell" animate={launching ? { scale: 1.08, opacity: 0, filter: "blur(10px)" } : {}} transition={{ duration: .8 }}>
        <div className="portal-topline"><span><Radio size={13}/> SECURE ARCHIVE LINK</span><span>AJK // 2025—26</span></div>
        <div className="portal-brand-lockup">
          <motion.div className={`portal-logo-frame ${bootStep >= 3 ? "logo-live" : ""}`} initial={{ opacity: 0, filter: "brightness(0)" }} animate={{ opacity: bootStep >= 3 ? 1 : 0, filter: bootStep >= 3 ? "brightness(1)" : "brightness(0)" }} transition={{ duration: .75 }}>
            <img src={logoUrl} alt="AJK College of Arts and Science Autonomous" />
            <div className="portal-brand-fallback" aria-hidden="true"><strong>AJK</strong><span>COLLEGE OF ARTS AND SCIENCE</span><small>(AUTONOMOUS)</small></div>
            <span className="logo-glitch-layer" aria-hidden="true">AJK</span>
          </motion.div>
          <motion.div className="portal-kicker" initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 3 ? 1 : 0 }} transition={{ duration: .6 }}>AUTONOMOUS / ARTS + SCIENCE</motion.div>
        </div>
        <div className="portal-divider"><span/><span>{bootStep < 2 ? "INITIALIZING LINK" : bootStep < 3 ? "DECRYPTING ARCHIVE..." : "AUTHORIZATION GATE"}</span><span/></div>
        <section className="portal-copy">
          <motion.p className="portal-status" animate={{ opacity: bootStep >= 2 ? 1 : .38 }}><span className="status-dot"/> {bootStep < 2 ? "SYSTEM INITIALIZING" : bootStep < 3 ? "DECRYPTING ARCHIVE..." : bootStep < 4 ? "VERIFYING IDENTITY LAYER" : "SYSTEM STATUS: READY"}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: bootStep >= 3 ? 1 : 0, y: bootStep >= 3 ? 0 : 16 }} transition={{ duration: .65 }}>ACCESS IDENTITY<br/><em>ARCHIVE?</em></motion.h1>
          <motion.p className="portal-subcopy" initial={{ opacity: 0 }} animate={{ opacity: bootStep >= 3 ? 1 : 0 }}>A private digital yearbook for the people, ambitions, and signals that shaped this class.</motion.p>
        </section>
        <motion.button type="button" className={`initialize-button reticle-button ${launching ? "is-launching" : ""}`} onClick={initialize} initial={{ opacity: 0, y: 10 }} animate={{ opacity: bootStep >= 4 ? 1 : 0, y: bootStep >= 4 ? 0 : 10 }} transition={{ duration: .5 }} disabled={bootStep < 4}>
          <span className="reticle-corner reticle-tl"/><span className="reticle-corner reticle-tr"/><span className="reticle-corner reticle-bl"/><span className="reticle-corner reticle-br"/><span className="button-bracket">[</span><LockKeyhole size={15}/><span>{launching ? "OPENING ARCHIVE" : "LET'S GO"}</span><ArrowRight size={15}/><span className="button-bracket">]</span>
        </motion.button>
        <div className="portal-footer"><span><ScanLine size={13}/> ENCRYPTED TRANSMISSION</span><span>NO EXTERNAL TRACKING</span></div>
      </motion.div>
      {launching && <motion.div className="portal-flash" initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }} transition={{ duration: .9, times: [0, .28, 1] }} aria-hidden="true" />}
    </motion.main>
  );
}
