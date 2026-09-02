import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const logoUrl = "/manus-storage/ajk-college-logo-crisp_c9153161.png";

export default function EntryPortal({ onInitialize }: { onInitialize: () => void }) {
  const [bootPhase, setBootPhase] = useState(0);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBootPhase(1), 850),
      window.setTimeout(() => setBootPhase(2), 2050),
      window.setTimeout(() => setBootPhase(3), 3150),
      window.setTimeout(() => setBootPhase(4), 4000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const enterArchive = () => {
    if (bootPhase < 4 || launching) return;
    setLaunching(true);
    window.setTimeout(onInitialize, 900);
  };

  return <motion.main className="entry-portal gold-interface" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }} aria-label="AJK golden archive interface">
    <div className="gold-vignette" aria-hidden="true" />
    <div className="gold-scanlines" aria-hidden="true" />
    <motion.div className="gold-target-stage" initial={{ opacity: 0, scale: .8, x: "-50%", y: "-50%" }} animate={{ opacity: bootPhase >= 1 ? 1 : 0, scale: bootPhase >= 1 ? 1 : .8, x: "-50%", y: "-50%" }} transition={{ type: "spring", stiffness: 80, damping: 16 }} aria-hidden="true">
      <motion.svg className="gold-ring gold-ring-outer" viewBox="0 0 700 700" animate={{ rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}><circle cx="350" cy="350" r="324"/><circle cx="350" cy="350" r="298" strokeDasharray="2 22"/><path d="M350 4v48M350 648v48M4 350h48M648 350h48"/></motion.svg>
      <motion.svg className="gold-ring gold-ring-mid" viewBox="0 0 560 560" animate={{ rotate: -360 }} transition={{ duration: 17, repeat: Infinity, ease: "linear" }}><circle cx="280" cy="280" r="254"/><circle cx="280" cy="280" r="216" strokeDasharray="96 12 3 14"/><path d="M280 18v38M280 504v38M18 280h38M504 280h38"/></motion.svg>
      <motion.svg className="gold-ring gold-ring-inner" viewBox="0 0 420 420" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}><circle cx="210" cy="210" r="174"/><circle cx="210" cy="210" r="140" strokeDasharray="1 10"/><path d="M210 16v42M210 362v42M16 210h42M362 210h42"/></motion.svg>
      <motion.div className="gold-pulse-core" animate={{ scale: [1, 1.06, 1], opacity: [.58, .95, .58] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}><span/><i/></motion.div>
    </motion.div>

    <div className="gold-corner-label gold-corner-tl" aria-hidden="true">INITIALIZING_SYSTEM<span>///</span></div>
    <div className="gold-corner-label gold-corner-tr" aria-hidden="true">SCANNING_DATABASE<span>00{bootPhase}</span></div>
    <div className="gold-corner-label gold-corner-bl" aria-hidden="true">AJK::ARCHIVE<span>SECURE</span></div>
    <div className="gold-corner-label gold-corner-br" aria-hidden="true">LINK_STATUS<span>{bootPhase >= 4 ? "STANDBY" : "BOOTING"}</span></div>

    <motion.div className="gold-logo-core" initial={{ opacity: 0, scale: .82, x: "-50%", y: "-50%", filter: "blur(10px)" }} animate={{ opacity: bootPhase >= 2 ? 1 : 0, scale: bootPhase >= 2 ? 1 : .82, x: "-50%", y: "-50%", filter: bootPhase >= 2 ? "blur(0px)" : "blur(10px)" }} transition={{ type: "spring", stiffness: 95, damping: 15 }}>
      <img src={logoUrl} alt="AJK College of Arts and Science Autonomous" />
    </motion.div>

    <motion.div className="gold-boot-readout" initial={{ opacity: 0 }} animate={{ opacity: bootPhase >= 4 ? .72 : 1 }} transition={{ duration: .5 }} aria-live="polite">{bootPhase < 1 ? "" : bootPhase < 2 ? "TARGET_LOCK" : bootPhase < 3 ? "SCANNING_DATABASE..." : bootPhase < 4 ? "CALIBRATING_RING_ARRAY" : "STANDBY // ARCHIVE_READY"}</motion.div>

    <motion.button type="button" className={`gold-access-reticle ${bootPhase >= 4 ? "is-ready" : ""} ${launching ? "is-launching" : ""}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: bootPhase >= 4 ? 1 : 0, y: bootPhase >= 4 ? 0 : 16 }} transition={{ type: "spring", stiffness: 150, damping: 13 }} whileHover={{ scale: 1.06 }} whileTap={{ scale: .88 }} onClick={enterArchive} disabled={bootPhase < 4} aria-label="Access archive">
      <b className="gold-reticle-corner gold-rt-tl"/><b className="gold-reticle-corner gold-rt-tr"/><b className="gold-reticle-corner gold-rt-bl"/><b className="gold-reticle-corner gold-rt-br"/><span className="gold-reticle-center"/><span className="gold-access-label">[ ACCESS ARCHIVE ]</span><ArrowUpRight size={14}/>
    </motion.button>

    {launching && <motion.div className="golden-flash" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 1], scale: [0, 1, 18] }} transition={{ duration: .9, times: [0, .3, 1], ease: "easeIn" }} aria-hidden="true" />}
  </motion.main>;
}
