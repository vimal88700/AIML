import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import EntryPortal from "./components/EntryPortal";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  const [isEntryGranted, setIsEntryGranted] = useState(false);

  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><AnimatePresence mode="wait" initial>{isEntryGranted ? <motion.div key="archive" className="app-shell" initial={{ opacity: 0, y: 12, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}><Switch><Route path="/" component={Home}/><Route path="/owner" component={Admin}/><Route path="/404" component={NotFound}/><Route component={NotFound}/></Switch></motion.div> : <EntryPortal key="entry" onInitialize={() => setIsEntryGranted(true)} />}</AnimatePresence></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
export default App;
