import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowRight, LockKeyhole, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

const fallback = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&q=80";

export default function Home() {
  const { data: members = [], isLoading, isError } = trpc.directory.list.useQuery();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState<"name" | "status">("name");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: gallery = [] } = trpc.directory.gallery.useQuery({ memberId: selectedId ?? 0 }, { enabled: selectedId !== null });
  const selected = members.find((member) => member.id === selectedId);
  const statuses = ["All", ...Array.from(new Set(members.map((member) => member.status)))];
  const visible = useMemo(() => members.filter((member) => {
    const matchesText = `${member.fullName} ${member.tagline ?? ""} ${member.hobbies ?? ""}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (status === "All" || member.status === status);
  }), [members, query, status]);
  const sortedVisible = [...visible].sort((a, b) => sort === "name" ? a.fullName.localeCompare(b.fullName) : a.status.localeCompare(b.status));

  return <LayoutGroup id="cybercore-archive"><main className="min-h-screen overflow-hidden bg-[#07100f] text-[#ecfdf5]">
    <div className="pointer-events-none fixed inset-0 opacity-60 cyber-grid" />
    <div className="pointer-events-none fixed inset-0 digital-rain" />
    <div className="pointer-events-none fixed inset-0 scanline-overlay" />
    <div className="pointer-events-none fixed -left-32 top-12 h-96 w-96 rounded-full bg-[#00ff9d]/10 blur-3xl" />
    <div className="pointer-events-none fixed -right-24 top-80 h-96 w-96 rounded-full bg-[#2385ff]/10 blur-3xl" />
    <header className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
      <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-[#00ff9d]/35 bg-[#00ff9d]/10 text-[#00ff9d]"><ShieldCheck size={19}/></div><div><p className="eyebrow">ARCHIVE // 01</p><p className="font-semibold tracking-tight">Class Network</p></div></div>
      <button onClick={() => { window.location.href = "/owner"; }} className="ghost-button"><LockKeyhole size={15}/> Owner access</button>
    </header>
    <section className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pt-20">
      <div className="max-w-3xl"><p className="eyebrow mb-4 flex items-center gap-2"><span className="status-dot"/> Signal established · {members.length} identities</p><h1 className="display-title">One shared story.<br/><span className="text-[#00ff9d]">29 unique signals.</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">A living digital yearbook for the people, ambitions, and small moments that made this class unforgettable.</p></div>
      <div className="mt-12 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="search-box"><Search size={18}/><input aria-label="Search class members" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search names, hobbies, or goals..." /></label><div className="filter-row">{statuses.map((item) => <button key={item} className={status === item ? "filter active" : "filter"} onClick={() => setStatus(item)}>{item}</button>)}<select aria-label="Sort members" className="filter sort-select" value={sort} onChange={(e) => setSort(e.target.value as "name" | "status")}><option value="name">A–Z</option><option value="status">Status</option></select></div></div>
      <div className="mt-10 flex items-end justify-between"><div><p className="eyebrow">Directory index</p><h2 className="section-title">The collective</h2></div><p className="text-sm text-white/45">{visible.length.toString().padStart(2, "0")} / {members.length.toString().padStart(2, "0")} visible</p></div>
      {isError ? <div className="empty-state mt-6">The archive could not be reached right now. Please try again shortly.</div> : isLoading ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((n) => <div className="skeleton h-64" key={n}/>)}</div> : visible.length === 0 ? <div className="empty-state mt-6">No signals match that search. Try another name or clear the filter.</div> : <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sortedVisible.map((member, index) => <motion.button key={member.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .04, .4) }} onClick={() => setSelectedId(member.id)} layoutId={`member-card-${member.id}`} className="member-card text-left"><div className="member-image-wrap"><motion.img layoutId={`member-image-${member.id}`} src={member.imageUrl || fallback} alt={member.fullName} className="member-image"/><span className="scan-line"/></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">{member.status}</p><motion.h3 layoutId={`member-name-${member.id}`} style={{ ["--reveal-index" as string]: index } as React.CSSProperties} className="terminal-name mt-1 text-xl font-semibold tracking-tight">{member.fullName}</motion.h3></div><ArrowRight size={18} className="mt-1 text-[#00ff9d]"/></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">{member.tagline || member.goal || "Profile awaiting transmission."}</p></div></motion.button>)}</div>}
    </section>
    <footer className="relative mx-auto flex max-w-7xl flex-col gap-2 px-5 py-10 text-xs text-white/35 sm:flex-row sm:justify-between sm:px-8"><span>CYBERCORE CLASS DIRECTORY · PRIVATE ARCHIVE</span><span>Built for the memories that stay.</span></footer>
    <AnimatePresence>{selected && <div className="modal-backdrop" onClick={() => setSelectedId(null)}><motion.article initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }} onClick={(e) => e.stopPropagation()} layoutId={`member-card-${selected.id}`} className="profile-modal"><button aria-label="Close profile" onClick={() => setSelectedId(null)} className="close-button"><X size={19}/></button><motion.img layoutId={`member-image-${selected.id}`} src={selected.imageUrl || fallback} alt={selected.fullName} className="profile-image"/><div className="p-6 sm:p-8"><p className="eyebrow">{selected.status} · ID-{String(selected.id).padStart(3, "0")}</p><motion.h2 layoutId={`member-name-${selected.id}`} className="mt-2 text-3xl font-semibold tracking-tight">{selected.fullName}</motion.h2><p className="mt-3 text-white/60">{selected.tagline || "A member of the collective."}</p><div className="profile-details"><div><p className="eyebrow">STATUS</p><p>{selected.status}</p></div><div><p className="eyebrow">IDENTITY</p><p>{selected.race || "Not published yet."}</p></div><div><p className="eyebrow">INTERESTS</p><p>{selected.hobbies || "Not published yet."}</p></div><div><p className="eyebrow">OBJECTIVE</p><p>{selected.goal || "Not published yet."}</p></div>{selected.hometown && <div><p className="eyebrow">ORIGIN</p><p>{selected.hometown}</p></div>}{selected.instagram && selected.instagramVisible === 1 && <div><p className="eyebrow">SOCIAL</p><p>{selected.instagram}</p></div>}{selected.phone && selected.phoneVisible === 1 && <div><p className="eyebrow">CONTACT</p><p>{selected.phone}</p></div>}</div>{gallery.length > 0 && <div className="vault-panel"><div className="mb-3 flex items-center justify-between"><p className="eyebrow">MEDIA VAULT</p><span className="text-xs text-white/40">{gallery.length} file{gallery.length === 1 ? "" : "s"}</span></div><div className="grid grid-cols-2 gap-2">{gallery.map((item) => item.mediaType === "video" ? <video key={item.id} src={item.imageUrl} controls className="h-28 w-full rounded-lg object-cover" /> : <img key={item.id} src={item.imageUrl} alt={item.altText || selected.fullName} className="h-28 w-full rounded-lg object-cover" />)}</div></div>}</div></motion.article></div>}</AnimatePresence>
  </main></LayoutGroup>;
}
