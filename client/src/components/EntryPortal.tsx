import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const logoUrl = "/manus-storage/ajk-college-logo-final_2aecd7dd.png";
const hexChars = "0123456789ABCDEF";

function randomHex(length: number) {
  return Array.from({ length }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join("");
}

function DataStream({ side, seed }: { side: "left" | "right"; seed: number }) {
  const rows = useMemo(() => Array.from({ length: 15 }, (_, index) => `${randomHex(4)}  /  ${String((seed + index * 17) % 9999).padStart(4, "0")}  /  ${randomHex(2)}`), [seed]);
  return <div className={`hud-data-stream hud-data-${side}`} aria-hidden="true">{rows.map((row, index) => <span key={`${seed}-${index}`}>{row}</span>)}</div>;
}

export default function EntryPortal({ onInitialize }: { onInitialize: () => void }) {
  const [bootStep, setBootStep] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [streamSeed, setStreamSeed] = useState(7);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBootStep(1), 700),
      window.setTimeout(() => setBootStep(2), 1500),
      window.setTimeout(() => setBootStep(3), 2300),
      window.setTimeout(() => setBootStep(4), 3100),
    ];
    const interval = window.setInterval(() => setStreamSeed((value) => value + 1), 180);
    return () => { timers.forEach(window.clearTimeout); window.clearInterval(interval); };
  }, []);

  const initialize = () => {
    if (bootStep < 4 || launching) return;
    setLaunching(true);
    window.setTimeout(onInitialize, 920);
  };

  return <motion.main className="entry-portal interface-only" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.12, filter: "blur(20px)" }} transition={{ duration: .45 }} onClick={initialize} aria-label="AJK identity archive interface">
    <div className="hud-vignette" aria-hidden="true" />
    <div className="hud-scanline" aria-hidden="true" />
    <DataStream side="left" seed={streamSeed} />
    <DataStream side="right" seed={streamSeed + 31} />
    <div className="hud-coordinates hud-coordinates-top" aria-hidden="true">X: {String(streamSeed * 13).padStart(4, "0")} / Y: {String(streamSeed * 7).padStart(4, "0")} / Z: 00{streamSeed % 9}</div>
    <div className="hud-coordinates hud-coordinates-bottom" aria-hidden="true">SIG // {randomHex(8)} // {bootStep >= 4 ? "READY" : "BOOT"}</div>

    <motion.div className="hud-core" initial={{ opacity: 0, scale: .78, x: "-50%", y: "-50%" }} animate={{ opacity: bootStep >= 1 ? 1 : 0, scale: bootStep >= 1 ? 1 : .78, x: "-50%", y: "-50%" }} transition={{ type: "spring", stiffness: 90, damping: 15 }}>
      <motion.svg className="hud-orbit hud-orbit-outer" viewBox="0 0 700 700" animate={{ rotate: 360, scale: [1, 1.012, 1] }} transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 1.3, repeat: Infinity, ease: "easeInOut" } }}><circle cx="350" cy="350" r="326"/><circle cx="350" cy="350" r="300" strokeDasharray="2 22"/><path d="M350 5v52M350 643v52M5 350h52M643 350h52"/><path d="M104 104l37 37M559 559l37 37M596 104l-37 37M141 559l-37 37"/></motion.svg>
      <motion.svg className="hud-orbit hud-orbit-mid" viewBox="0 0 560 560" animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}><circle cx="280" cy="280" r="252"/><circle cx="280" cy="280" r="214" strokeDasharray="100 12 3 14"/><path d="M280 20v35M280 505v35M20 280h35M505 280h35"/></motion.svg>
      <motion.svg className="hud-orbit hud-orbit-inner" viewBox="0 0 410 410" animate={{ rotate: 360, scale: [1, 1.035, 1] }} transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: .86, repeat: Infinity, ease: "easeInOut" } }}><circle cx="205" cy="205" r="177"/><circle cx="205" cy="205" r="144" strokeDasharray="1 10"/><path d="M205 18v44M205 348v44M18 205h44M348 205h44"/></motion.svg>
      <div className="hud-target-core"><span/><span/><i/></div>
    </motion.div>

    <motion.div className="hud-logo-core" initial={{ opacity: 0, scale: .6, x: "-50%", y: "-50%", filter: "blur(12px)" }} animate={{ opacity: bootStep >= 3 ? 1 : 0, scale: bootStep >= 3 ? 1 : .6, x: "-50%", y: "-50%", filter: bootStep >= 3 ? "blur(0px)" : "blur(12px)" }} transition={{ type: "spring", stiffness: 100, damping: 14 }}>
      <img src={logoUrl} alt="AJK College of Arts and Science Autonomous" />
      <span className="hud-logo-glitch" aria-hidden="true">AJK</span>
    </motion.div>

    <motion.button type="button" className={`hud-reticle ${bootStep >= 4 ? "hud-reticle-ready" : ""} ${launching ? "hud-reticle-launching" : ""}`} initial={{ opacity: 0, scale: .7 }} animate={{ opacity: bootStep >= 4 ? 1 : 0, scale: bootStep >= 4 ? 1 : .7 }} transition={{ type: "spring", stiffness: 160, damping: 12 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: .88 }} onClick={(event) => { event.stopPropagation(); initialize(); }} aria-label={bootStep >= 4 ? "Enter identity archive" : "Booting archive"} disabled={bootStep < 4}>
      <b className="reticle-corner reticle-tl"/><b className="reticle-corner reticle-tr"/><b className="reticle-corner reticle-bl"/><b className="reticle-corner reticle-br"/><span className="reticle-dot"/>
    </motion.button>

    <AnimatePresence mode="wait"><motion.div key={bootStep} className="hud-boot-state" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .18 }}>{bootStep < 1 ? "//" : bootStep < 2 ? "INIT::HUD" : bootStep < 3 ? "DECRYPTING" : bootStep < 4 ? "CALIBRATING" : "ARCHIVE_READY"}</motion.div></AnimatePresence>
    {launching && <motion.div className="hud-black-hole" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 1], scale: [0, 1, 14] }} transition={{ duration: .95, times: [0, .28, 1], ease: "easeIn" }} aria-hidden="true" />}
  </motion.main>;
}
