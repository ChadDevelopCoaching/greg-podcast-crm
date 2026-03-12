import { useState, useEffect } from "react";

const GREG_BIO = {
  name: "Greg",
  title: "Construction Business Coach",
  location: "Australia / UK",
  expertise: [
    "Scaling small construction businesses",
    "Strategic business methodologies for construction SMEs",
    "Business stabilisation and growth frameworks",
    "AI & automation in construction",
    "Innovation in the construction industry",
  ],
  socialProof:
    "Greg brings decades of hands-on construction experience combined with modern business coaching methodology. He has helped numerous small construction business owners stabilise, systematise, and scale their operations across Australia and the UK.",
  podcastTopics: [
    "How small construction businesses can scale without chaos",
    "The systems and strategies that stabilise a growing construction company",
    "AI and automation: the future of construction business management",
    "Why most construction businesses stall at the same revenue ceiling — and how to break through",
    "Building a construction business that works without you",
  ],
  ownPodcast: true,
  ownPodcastDescription:
    "Greg hosts his own podcast focused on construction business growth, where he regularly features industry experts, innovators, and entrepreneurs.",
};

const INITIAL_PODCASTS = [
  { id: 1, name: "The Construction Leading Edge", host: "Nathan Donato", email: "nathan@constructionleadingedge.com", region: "Australia", niche: "Construction", audience: "15,000+", status: "Not Contacted", notes: "", isHighValue: true, dateContacted: null, followUpDate: null },
  { id: 2, name: "SME Business Matters", host: "James Hargreaves", email: "james@smebusinessmatters.co.uk", region: "UK", niche: "SME / Business", audience: "8,000+", status: "Not Contacted", notes: "", isHighValue: false, dateContacted: null, followUpDate: null },
  { id: 3, name: "Scale Up With Nick Bradley", host: "Nick Bradley", email: "podcast@nickbradley.co.uk", region: "UK", niche: "Scaling / Business", audience: "22,000+", status: "Not Contacted", notes: "", isHighValue: true, dateContacted: null, followUpDate: null },
];

const STATUS_CONFIG = {
  "Not Contacted": { color: "#64748b", bg: "#1e293b", dot: "#64748b" },
  "Email Sent":    { color: "#f59e0b", bg: "#292215", dot: "#f59e0b" },
  "Followed Up":   { color: "#3b82f6", bg: "#172033", dot: "#3b82f6" },
  "Replied":       { color: "#a78bfa", bg: "#1e1535", dot: "#a78bfa" },
  "Booked":        { color: "#22c55e", bg: "#0f2a1a", dot: "#22c55e" },
  "Declined":      { color: "#ef4444", bg: "#2a1212", dot: "#ef4444" },
};

const REGIONS  = ["All", "Australia", "UK", "USA", "Canada", "Global"];
const NICHES   = ["All", "Construction", "SME / Business", "Scaling / Business", "AI & Innovation", "General Business"];
const STATUSES = Object.keys(STATUS_CONFIG);

const RESEARCH_CATEGORIES = [
  // Construction
  { id: "con_au",     label: "Construction 🇦🇺",       region: "Australia", niche: "Construction",       query: "best construction industry podcasts Australia 2024 2025 business owners trades builders" },
  { id: "con_uk",     label: "Construction 🇬🇧",       region: "UK",        niche: "Construction",       query: "best construction industry podcasts UK 2024 2025 business trades builders contractors" },
  { id: "con_us",     label: "Construction 🇺🇸",       region: "USA",       niche: "Construction",       query: "best construction industry podcasts USA America 2024 2025 business contractors builders" },
  { id: "con_ca",     label: "Construction 🇨🇦",       region: "Canada",    niche: "Construction",       query: "best construction industry podcasts Canada 2024 2025 business builders contractors" },
  // SME / Business
  { id: "sme_au",     label: "SME Business 🇦🇺",       region: "Australia", niche: "SME / Business",     query: "top small business SME entrepreneur podcasts Australia 2024 2025" },
  { id: "sme_uk",     label: "SME Business 🇬🇧",       region: "UK",        niche: "SME / Business",     query: "top small business SME entrepreneur podcasts UK 2024 2025" },
  { id: "sme_us",     label: "SME Business 🇺🇸",       region: "USA",       niche: "SME / Business",     query: "top small business entrepreneur podcasts USA America 2024 2025 global audience" },
  { id: "sme_ca",     label: "SME Business 🇨🇦",       region: "Canada",    niche: "SME / Business",     query: "top small business entrepreneur podcasts Canada 2024 2025" },
  // Scaling / Growth
  { id: "scale_au",   label: "Scaling / Growth 🇦🇺",   region: "Australia", niche: "Scaling / Business", query: "business growth scaling podcasts Australia founders entrepreneurs 2024 2025" },
  { id: "scale_uk",   label: "Scaling / Growth 🇬🇧",   region: "UK",        niche: "Scaling / Business", query: "business growth scaling podcasts UK founders entrepreneurs 2024 2025" },
  { id: "scale_us",   label: "Scaling / Growth 🇺🇸",   region: "USA",       niche: "Scaling / Business", query: "top business growth scaling podcasts USA global audience founders entrepreneurs 2024 2025" },
  { id: "scale_gl",   label: "Scaling / Growth 🌍",    region: "Global",    niche: "Scaling / Business", query: "top global business growth scaling podcasts international audience 2024 2025" },
  // AI & Innovation
  { id: "ai_au",      label: "AI & Innovation 🇦🇺",    region: "Australia", niche: "AI & Innovation",    query: "AI technology innovation business podcasts Australia 2024 2025 automation" },
  { id: "ai_uk",      label: "AI & Innovation 🇬🇧",    region: "UK",        niche: "AI & Innovation",    query: "AI technology innovation business podcasts UK 2024 2025 automation" },
  { id: "ai_us",      label: "AI & Innovation 🇺🇸",    region: "USA",       niche: "AI & Innovation",    query: "top AI technology innovation business podcasts USA global 2024 2025 automation" },
  { id: "ai_gl",      label: "AI & Innovation 🌍",     region: "Global",    niche: "AI & Innovation",    query: "top global AI innovation business podcasts international 2024 2025" },
  // Trades / Contractors
  { id: "trades_us",  label: "Trades & Contractors 🇺🇸", region: "USA",     niche: "Construction",       query: "trades contractor electrician plumber builder entrepreneur podcasts USA 2024 2025" },
  { id: "trades_gl",  label: "Trades & Contractors 🌍", region: "Global",   niche: "Construction",       query: "trades contractor construction entrepreneur podcasts global international 2024 2025" },
];

const inputStyle = { width: "100%", padding: "10px 14px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Not Contacted"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", border: `1px solid ${cfg.color}30` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />{status}
    </span>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}>
        {children}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 44, height: 44, border: "3px solid #1e293b", borderTop: "3px solid #f59e0b", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
    </>
  );
}

function EmailModal({ podcast, emailType, onClose }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail]     = useState(null);
  const [error, setError]     = useState(null);
  const [copied, setCopied]   = useState(false);
  useEffect(() => { gen(); }, []);

  async function gen() {
    setLoading(true); setError(null);
    try {
      const isF = emailType === "followup";
      const prompt = isF
        ? `Write a warm professional follow-up email from a podcast booking assistant on behalf of ${GREG_BIO.name}, a ${GREG_BIO.title} based in ${GREG_BIO.location}. Follow-up to ${podcast.host}, host of "${podcast.name}" (${podcast.niche}, ${podcast.region}). We emailed ~1 week ago about Greg being a guest. No reply. Brief, friendly, non-pushy. Reference Greg's expertise: ${GREG_BIO.expertise.slice(0,3).join(", ")}. Format: Subject line first, then body. Under 120 words.`
        : `Write a personalised professional podcast guest pitch email on behalf of ${GREG_BIO.name}, a ${GREG_BIO.title} based in ${GREG_BIO.location}. To ${podcast.host}, host of "${podcast.name}" — ${podcast.niche} podcast, ${podcast.region}, ~${podcast.audience} listeners. Include: warm specific opening referencing their niche; who Greg is (${GREG_BIO.socialProof}); 2-3 topic ideas from: ${GREG_BIO.podcastTopics.join(" | ")}; brief social proof; ${podcast.isHighValue ? `reciprocal offer: invite ${podcast.host} to Greg's podcast (${GREG_BIO.ownPodcastDescription});` : ""} clear low-friction CTA. Tone: confident, warm, peer-to-peer. Format: Subject first, then body. ~200 words.`;
      const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      setEmail(data.content?.map(b=>b.text||"").join("\n")||"");
    } catch { setError("Failed to generate. Please try again."); }
    setLoading(false);
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 32 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:11, color:"#f59e0b", fontWeight:700, letterSpacing:"0.15em", marginBottom:4 }}>{emailType==="followup"?"FOLLOW-UP EMAIL":"OUTREACH EMAIL"}</div>
            <h2 style={{ margin:0, fontSize:20, color:"#f1f5f9" }}>{podcast.name}</h2>
            <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>to {podcast.host}</div>
          </div>
          <button onClick={onClose} style={{ background:"#1e293b", border:"none", color:"#64748b", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:18 }}>×</button>
        </div>
        {loading && <div style={{textAlign:"center",padding:"48px 0"}}><Spinner /><div style={{color:"#64748b",fontSize:14}}>Crafting your email…</div></div>}
        {error   && <div style={{background:"#2a1212",border:"1px solid #ef444440",borderRadius:10,padding:16,color:"#ef4444",fontSize:14}}>{error}</div>}
        {email && !loading && (
          <>
            <div style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:12,padding:24,fontFamily:"Georgia,serif",fontSize:14.5,lineHeight:1.75,color:"#cbd5e1",whiteSpace:"pre-wrap",marginBottom:20}}>{email}</div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>{navigator.clipboard.writeText(email);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{flex:1,padding:"12px 20px",borderRadius:10,background:copied?"#22c55e20":"#f59e0b",color:copied?"#22c55e":"#0f172a",border:copied?"1px solid #22c55e40":"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>{copied?"✓ Copied!":"Copy to Clipboard"}</button>
              <button onClick={gen} style={{padding:"12px 20px",borderRadius:10,background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",fontWeight:600,fontSize:14,cursor:"pointer"}}>Regenerate</button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function AddPodcastModal({ onSave, onClose, prefill }) {
  const [form, setForm] = useState({ name:prefill?.name||"", host:prefill?.host||"", email:prefill?.email||"", region:prefill?.region||"Australia", niche:prefill?.niche||"Construction", audience:prefill?.audience||"", isHighValue:false, notes:prefill?.notes||"" });
  const f = (label, key, type="text", opts=null) => (
    <div style={{marginBottom:16}}>
      <label style={{display:"block",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:"0.1em",marginBottom:6}}>{label}</label>
      {opts ? <select value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={inputStyle}>{opts.map(o=><option key={o}>{o}</option>)}</select>
             : <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={inputStyle}/>}
    </div>
  );
  return (
    <Modal onClose={onClose}>
      <div style={{padding:32}}>
        <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,letterSpacing:"0.15em",marginBottom:8}}>ADD PODCAST</div>
        <h2 style={{margin:"0 0 24px",color:"#f1f5f9",fontSize:20}}>New Outreach Target</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          <div style={{gridColumn:"1/-1"}}>{f("PODCAST NAME *","name")}</div>
          {f("HOST NAME *","host")} {f("EMAIL ADDRESS","email","email")}
          {f("REGION","region","text",["Australia","UK","USA","Canada","Global","Other"])} {f("NICHE","niche","text",NICHES.filter(n=>n!=="All"))}
          {f("AUDIENCE SIZE","audience")}
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <input type="checkbox" checked={form.isHighValue} onChange={e=>setForm({...form,isHighValue:e.target.checked})} style={{width:16,height:16,accentColor:"#f59e0b"}}/>
            <span style={{fontSize:13,color:"#94a3b8"}}>High-value — offer reciprocal guest appearance on Greg's show</span>
          </label>
        </div>
        {f("NOTES","notes")}
        <div style={{display:"flex",gap:12,marginTop:8}}>
          <button onClick={()=>{if(!form.name||!form.host)return;onSave({...form,id:Date.now(),status:"Not Contacted",dateContacted:null,followUpDate:null});onClose();}} style={{flex:1,padding:"12px 20px",borderRadius:10,background:"#f59e0b",color:"#0f172a",border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Add Podcast</button>
          <button onClick={onClose} style={{padding:"12px 20px",borderRadius:10,background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",fontWeight:600,fontSize:14,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

function DetailModal({ podcast, onUpdate, onClose }) {
  const [local, setLocal] = useState({...podcast});
  return (
    <Modal onClose={onClose}>
      <div style={{padding:32}}>
        <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,letterSpacing:"0.15em",marginBottom:8}}>PODCAST DETAILS</div>
        <h2 style={{margin:"0 0 4px",color:"#f1f5f9",fontSize:22}}>{podcast.name}</h2>
        <div style={{color:"#64748b",fontSize:13,marginBottom:24}}>hosted by {podcast.host}</div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:"0.1em",marginBottom:6}}>STATUS</label>
          <select value={local.status} onChange={e=>setLocal({...local,status:e.target.value})} style={inputStyle}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          {[["DATE CONTACTED","dateContacted"],["FOLLOW-UP DATE","followUpDate"]].map(([lbl,key])=>(
            <div key={key} style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:"0.1em",marginBottom:6}}>{lbl}</label>
              <input type="date" value={local[key]||""} onChange={e=>setLocal({...local,[key]:e.target.value})} style={inputStyle}/>
            </div>
          ))}
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:"0.1em",marginBottom:6}}>NOTES</label>
          <textarea value={local.notes} onChange={e=>setLocal({...local,notes:e.target.value})} rows={4} style={{...inputStyle,resize:"vertical",fontFamily:"inherit"}}/>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{onUpdate(local);onClose();}} style={{flex:1,padding:"12px 20px",borderRadius:10,background:"#f59e0b",color:"#0f172a",border:"none",fontWeight:700,fontSize:14,cursor:"pointer"}}>Save Changes</button>
          <button onClick={onClose} style={{padding:"12px 20px",borderRadius:10,background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",fontWeight:600,fontSize:14,cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

function ResearchPanel({ existingPodcasts, onAddPodcast }) {
  const [selected, setSelected]         = useState(null);
  const [cache, setCache]               = useState({});
  const [loading, setLoading]           = useState(false);
  const [customQ, setCustomQ]           = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [customResults, setCustomResults] = useState(null);
  const [addTarget, setAddTarget]       = useState(null);

  const existingNames = existingPodcasts.map(p => p.name.toLowerCase());

  async function fetchCategory(cat) {
    if (cache[cat.id]) { setSelected(cat); return; }
    setSelected(cat); setLoading(true);
    try {
      const prompt = `You are a podcast research assistant. Use web search to find 8 real, currently active podcasts matching: "${cat.query}".

For EACH podcast found, you MUST do additional web searches to find contact details. Search for:
- The podcast's official website and look for a "Contact", "Guest", or "Appear on the show" page
- A direct guest submission email (e.g. podcast@..., guest@..., hello@..., bookings@...)
- The host's email address or LinkedIn profile
- Any guest pitch form URL

Return ONLY a JSON array (no markdown, no preamble) where each object has:
name, host, region ("${cat.region}"), niche ("${cat.niche}"), audience (estimated or "Unknown"), description (1-2 sentences on why it suits a construction business coach guest), email (best email found, or "" if none found), contactUrl (guest pitch page or contact page URL, or ""), contactHint (short plain-English note on how to reach them — e.g. "Guest form on website", "Email found: x@y.com", "LinkedIn DM only", or "No contact found"), isActive (bool — still publishing 2024/2025), fitScore (1-10 fit for Greg: construction coach, AI in construction, scaling SMEs, AU/UK focus).`;

      const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, tools:[{type:"web_search_20250305",name:"web_search"}], messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("\n")||"[]";
      const arr  = JSON.parse((text.replace(/```json|```/g,"").trim().match(/\[[\s\S]*\]/)||["[]"])[0]);
      setCache(prev => ({...prev, [cat.id]: arr}));
    } catch { setCache(prev => ({...prev, [cat.id]: []})); }
    setLoading(false);
  }

  async function runCustom() {
    if (!customQ.trim()) return;
    setCustomLoading(true); setCustomResults(null); setSelected(null);
    try {
      const prompt = `Podcast research assistant. Use web search. Find 8 real active podcasts matching: "${customQ}". Context: guest is a construction business coach (based in AU/UK but open to global podcasts — USA, Canada, UK, Australia etc.) who speaks on AI in construction, scaling SMEs, and construction business growth.

For EACH podcast found, do additional web searches to find contact details:
- The podcast's official website contact or guest page
- A direct guest submission email (e.g. podcast@..., guest@..., hello@..., bookings@...)
- The host's email address or LinkedIn profile
- Any guest pitch form URL

Return ONLY a JSON array (no markdown) with: name, host, region (country or "Global"), niche, audience, description, email (best email found or ""), contactUrl (guest page URL or ""), contactHint (plain-English note: e.g. "Email found: x@y.com", "Guest form on website", "LinkedIn DM only", or "No contact found"), isActive, fitScore (1-10).`;
      const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, tools:[{type:"web_search_20250305",name:"web_search"}], messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("\n")||"[]";
      const arr  = JSON.parse((text.replace(/```json|```/g,"").trim().match(/\[[\s\S]*\]/)||["[]"])[0]);
      setCustomResults(arr);
    } catch { setCustomResults([]); }
    setCustomLoading(false);
  }

  const displayList = customResults || (selected && cache[selected.id]);
  const isLoading   = loading || customLoading;

  return (
    <div>
      {/* Custom search */}
      <div style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:14,padding:24,marginBottom:28}}>
        <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,letterSpacing:"0.15em",marginBottom:6}}>CUSTOM SEARCH</div>
        <p style={{fontSize:13,color:"#64748b",margin:"0 0 14px"}}>Describe what you're looking for and AI will search the web live for matching podcasts.</p>
        <div style={{display:"flex",gap:10}}>
          <input value={customQ} onChange={e=>setCustomQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runCustom()} placeholder='e.g. "tradesperson entrepreneur podcasts Australia" or "UK construction tech shows 2025"' style={{...inputStyle,flex:1}}/>
          <button onClick={runCustom} disabled={customLoading} style={{padding:"10px 22px",borderRadius:8,background:"#f59e0b",color:"#0f172a",border:"none",fontWeight:700,fontSize:13,cursor:customLoading?"wait":"pointer",whiteSpace:"nowrap"}}>
            {customLoading ? "Searching…" : "🔍 Search"}
          </button>
          {customResults && <button onClick={()=>{setCustomResults(null);setCustomQ("");}} style={{padding:"10px 14px",borderRadius:8,background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",fontWeight:600,fontSize:13,cursor:"pointer"}}>✕</button>}
        </div>
      </div>

      {/* Category browser */}
      {!customResults && (
        <>
          <div style={{fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:"0.12em",marginBottom:12}}>BROWSE BY CATEGORY — click to search</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
            {RESEARCH_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={()=>fetchCategory(cat)} style={{
                padding:"8px 16px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", border:"1px solid",
                background: selected?.id===cat.id ? "#f59e0b" : "transparent",
                color: selected?.id===cat.id ? "#0f172a" : "#64748b",
                borderColor: selected?.id===cat.id ? "#f59e0b" : "#1e293b",
              }}>{cat.label}{cache[cat.id] ? ` (${cache[cat.id].length})` : ""}</button>
            ))}
          </div>
        </>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{textAlign:"center",padding:"64px 0"}}>
          <Spinner/>
          <div style={{color:"#64748b",fontSize:15,marginTop:4}}>AI is searching the web for real podcasts…</div>
          <div style={{color:"#334155",fontSize:12,marginTop:8}}>This takes 15–30 seconds</div>
        </div>
      )}

      {/* Results */}
      {displayList && !isLoading && (
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:13,color:"#475569"}}>
              Found <strong style={{color:"#f1f5f9"}}>{displayList.length}</strong> podcasts
              {customResults ? <> for "<em>{customQ}</em>"</> : <> · {selected?.label}</>}
            </div>
            <div style={{fontSize:11,color:"#334155"}}>{displayList.filter(p=>existingNames.includes(p.name?.toLowerCase())).length} already in your CRM</div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[...displayList].sort((a,b)=>(b.fitScore||0)-(a.fitScore||0)).map((pod,i) => {
              const inCRM  = existingNames.includes(pod.name?.toLowerCase());
              const score  = pod.fitScore || 0;
              const sColor = score>=8?"#22c55e":score>=6?"#f59e0b":"#64748b";
              return (
                <div key={i} style={{background:"#0a1628",border:"1px solid #1e293b",borderLeft:`3px solid ${inCRM?"#334155":sColor}`,borderRadius:12,padding:20,opacity:inCRM?0.5:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                        <span style={{fontSize:16,fontWeight:700,color:"#f1f5f9"}}>{pod.name}</span>
                        {!pod.isActive && <span style={{fontSize:10,background:"#2a1212",color:"#ef4444",border:"1px solid #ef444430",borderRadius:4,padding:"1px 6px",fontWeight:700}}>INACTIVE?</span>}
                        {inCRM && <span style={{fontSize:10,background:"#1e293b",color:"#64748b",borderRadius:4,padding:"1px 6px",fontWeight:700}}>✓ IN CRM</span>}
                      </div>
                      <div style={{fontSize:13,color:"#64748b",marginBottom:8}}>
                        Hosted by <strong style={{color:"#94a3b8"}}>{pod.host}</strong>
                        <span style={{margin:"0 8px",color:"#1e293b"}}>·</span>
                        <span style={{color:pod.region==="Australia"?"#38bdf8":pod.region==="UK"?"#a78bfa":pod.region==="USA"?"#4ade80":pod.region==="Canada"?"#fb923c":"#94a3b8"}}>{pod.region}</span>
                        <span style={{margin:"0 8px",color:"#1e293b"}}>·</span>{pod.niche}
                        {pod.audience&&pod.audience!=="Unknown"&&<><span style={{margin:"0 8px",color:"#1e293b"}}>·</span>{pod.audience} listeners</>}
                      </div>
                      <p style={{margin:"0 0 10px",fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{pod.description}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {pod.email && (
                          <a href={`mailto:${pod.email}`} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:"#22c55e",background:"#0f2a1a",border:"1px solid #22c55e30",borderRadius:6,padding:"4px 10px",textDecoration:"none"}}>
                            ✉ {pod.email}
                          </a>
                        )}
                        {pod.contactUrl && (
                          <a href={pod.contactUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:"#38bdf8",background:"#0f2a3a",border:"1px solid #38bdf830",borderRadius:6,padding:"4px 10px",textDecoration:"none"}}>
                            🔗 Guest Page
                          </a>
                        )}
                        {!pod.email && !pod.contactUrl && pod.contactHint && (
                          <span style={{fontSize:12,color:"#475569",display:"inline-flex",alignItems:"center",gap:5}}>
                            📬 {pod.contactHint}
                          </span>
                        )}
                        {!pod.email && !pod.contactUrl && !pod.contactHint && (
                          <span style={{fontSize:12,color:"#334155",fontStyle:"italic"}}>No contact found</span>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,minWidth:84}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:28,fontWeight:800,color:sColor,lineHeight:1}}>{score}</div>
                        <div style={{fontSize:9,color:"#475569",fontWeight:700,letterSpacing:"0.1em"}}>FIT SCORE</div>
                      </div>
                      {!inCRM && <button onClick={()=>setAddTarget(pod)} style={{padding:"7px 14px",borderRadius:8,background:"#f59e0b",color:"#0f172a",border:"none",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add to CRM</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!displayList && !isLoading && (
        <div style={{textAlign:"center",padding:"64px 0"}}>
          <div style={{fontSize:40,marginBottom:16}}>🎙️</div>
          <div style={{fontSize:16,color:"#475569",marginBottom:8}}>Select a category above or run a custom search</div>
          <div style={{fontSize:13,color:"#334155"}}>AI will search the web and return real, ranked podcasts in 15–30 seconds</div>
        </div>
      )}

      {addTarget && (
        <AddPodcastModal
          prefill={{ name:addTarget.name, host:addTarget.host, email:addTarget.email||"", region:addTarget.region, niche:addTarget.niche, audience:addTarget.audience, notes:(addTarget.description||"")+(addTarget.contactUrl?`\nGuest page: ${addTarget.contactUrl}`:"") }}
          onSave={p=>{ onAddPodcast(p); setAddTarget(null); }}
          onClose={()=>setAddTarget(null)}
        />
      )}
    </div>
  );
}

const STORAGE_KEY = "greg-crm-podcasts";

async function loadPodcasts() {
  try {
    const result = await window.storage.get(STORAGE_KEY);
    return result ? JSON.parse(result.value) : INITIAL_PODCASTS;
  } catch {
    return INITIAL_PODCASTS;
  }
}

async function savePodcasts(podcasts) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(podcasts));
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const [podcasts, setPodcasts]         = useState(INITIAL_PODCASTS);
  const [storageReady, setStorageReady] = useState(false);
  const [saveStatus, setSaveStatus]     = useState(null); // "saving" | "saved" | "error"
  const [tab, setTab]                   = useState("crm");
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]             = useState("");
  const [emailModal, setEmailModal]     = useState(null);
  const [addModal, setAddModal]         = useState(false);
  const [detailModal, setDetailModal]   = useState(null);

  // Load from storage on mount
  useEffect(() => {
    loadPodcasts().then(data => {
      setPodcasts(data);
      setStorageReady(true);
    });
  }, []);

  // Save whenever podcasts change (after initial load)
  useEffect(() => {
    if (!storageReady) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      const ok = await savePodcasts(podcasts);
      setSaveStatus(ok ? "saved" : "error");
      setTimeout(() => setSaveStatus(null), 2000);
    }, 400);
    return () => clearTimeout(timer);
  }, [podcasts, storageReady]);

  const filtered = podcasts.filter(p => {
    if (filterRegion !== "All" && p.region !== filterRegion && p.region !== "Both") return false;
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.host.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = { total: podcasts.length, contacted: podcasts.filter(p=>p.status!=="Not Contacted").length, booked: podcasts.filter(p=>p.status==="Booked").length, replied: podcasts.filter(p=>p.status==="Replied").length };

  const pill = (active) => ({ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", border:"1px solid", background:active?"#f59e0b":"transparent", color:active?"#0f172a":"#64748b", borderColor:active?"#f59e0b":"#1e293b", transition:"all 0.15s" });

  return (
    <div style={{minHeight:"100vh",background:"#060d1a",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#f1f5f9"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:6px;background:#0a1628}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}`}</style>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0a1628 0%,#0f172a 100%)",borderBottom:"1px solid #1e293b",padding:"28px 40px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:11,color:"#f59e0b",fontWeight:700,letterSpacing:"0.2em",marginBottom:6}}>PODCAST OUTREACH CRM</div>
              <h1 style={{margin:0,fontSize:32,fontFamily:"'DM Serif Display',serif",fontWeight:400,color:"#f1f5f9",lineHeight:1.1}}>Greg's Booking Dashboard</h1>
              <p style={{margin:"6px 0 0",fontSize:14,color:"#475569"}}>Construction Coach · Australia & UK · AI in Construction</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              {saveStatus && (
                <div style={{fontSize:12,fontWeight:600,color:saveStatus==="saved"?"#22c55e":saveStatus==="error"?"#ef4444":"#64748b",display:"flex",alignItems:"center",gap:6}}>
                  {saveStatus==="saving" && <><span style={{width:8,height:8,borderRadius:"50%",background:"#64748b",display:"inline-block"}}/>Saving…</>}
                  {saveStatus==="saved"  && <><span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>Saved</>}
                  {saveStatus==="error"  && <><span style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",display:"inline-block"}}/>Save failed</>}
                </div>
              )}
              {tab==="crm" && <button onClick={()=>setAddModal(true)} style={{padding:"12px 24px",background:"#f59e0b",color:"#0f172a",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer"}}>+ Add Podcast</button>}
            </div>
          </div>
          <div style={{display:"flex",gap:20,marginTop:28}}>
            {[{label:"Total Targets",value:stats.total,color:"#64748b"},{label:"Contacted",value:stats.contacted,color:"#f59e0b"},{label:"Replied",value:stats.replied,color:"#a78bfa"},{label:"Booked",value:stats.booked,color:"#22c55e"}].map(s=>(
              <div key={s.label} style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:12,padding:"16px 24px",minWidth:120}}>
                <div style={{fontSize:28,fontWeight:700,color:s.color,lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:11,color:"#475569",marginTop:4,fontWeight:600,letterSpacing:"0.08em"}}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:"#0a1628",borderBottom:"1px solid #1e293b",padding:"0 40px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex"}}>
          {[{id:"crm",label:"📋  CRM & Outreach"},{id:"research",label:"🔍  Find Podcasts"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"16px 24px",background:"transparent",border:"none",borderBottom:tab===t.id?"2px solid #f59e0b":"2px solid transparent",color:tab===t.id?"#f59e0b":"#475569",fontWeight:700,fontSize:14,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit"}}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 40px"}}>

        {tab==="crm" && (
          <>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search podcasts or hosts…" style={{padding:"8px 16px",background:"#0a1628",border:"1px solid #1e293b",borderRadius:8,color:"#f1f5f9",fontSize:13,outline:"none",width:220}}/>
              <div style={{width:1,height:28,background:"#1e293b"}}/>
              {REGIONS.map(r=><button key={r} onClick={()=>setFilterRegion(r)} style={pill(filterRegion===r)}>{r}</button>)}
              <div style={{width:1,height:28,background:"#1e293b"}}/>
              {["All",...STATUSES].map(s=><button key={s} onClick={()=>setFilterStatus(s)} style={pill(filterStatus===s)}>{s}</button>)}
            </div>

            <div style={{background:"#0a1628",border:"1px solid #1e293b",borderRadius:16,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #1e293b"}}>
                    {["Podcast","Host","Region","Niche","Audience","Status","Actions"].map(h=>(
                      <th key={h} style={{padding:"14px 20px",textAlign:"left",fontSize:10,color:"#475569",fontWeight:700,letterSpacing:"0.12em"}}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0 && (
                    <tr><td colSpan={7} style={{padding:40,textAlign:"center",color:"#334155"}}>
                      No podcasts found. <button onClick={()=>setTab("research")} style={{background:"none",border:"none",color:"#f59e0b",cursor:"pointer",fontWeight:700,fontSize:14}}>Find some in the Research tab →</button>
                    </td></tr>
                  )}
                  {filtered.map((p,i)=>(
                    <tr key={p.id} style={{borderBottom:i<filtered.length-1?"1px solid #0f172a":"none"}}>
                      <td style={{padding:"16px 20px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:15,fontWeight:600,color:"#f1f5f9"}}>{p.name}</span>
                          {p.isHighValue&&<span style={{fontSize:9,background:"#f59e0b20",color:"#f59e0b",border:"1px solid #f59e0b40",borderRadius:4,padding:"1px 6px",fontWeight:700,letterSpacing:"0.1em"}}>★ HIGH VALUE</span>}
                        </div>
                        {p.notes&&<div style={{fontSize:11,color:"#475569",marginTop:3}}>{p.notes.slice(0,50)}{p.notes.length>50?"…":""}</div>}
                      </td>
                      <td style={{padding:"16px 20px",fontSize:13,color:"#94a3b8"}}>{p.host}</td>
                      <td style={{padding:"16px 20px"}}><span style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:p.region==="Australia"?"#0f2a3a":p.region==="UK"?"#1a1035":p.region==="USA"?"#0f2a1a":p.region==="Canada"?"#2a1a0f":"#1a1a2a",color:p.region==="Australia"?"#38bdf8":p.region==="UK"?"#a78bfa":p.region==="USA"?"#4ade80":p.region==="Canada"?"#fb923c":"#94a3b8",fontWeight:600}}>{p.region}</span></td>
                      <td style={{padding:"16px 20px",fontSize:13,color:"#64748b"}}>{p.niche}</td>
                      <td style={{padding:"16px 20px",fontSize:13,color:"#64748b"}}>{p.audience}</td>
                      <td style={{padding:"16px 20px"}}><StatusBadge status={p.status}/></td>
                      <td style={{padding:"16px 20px"}}>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>setEmailModal({podcast:p,type:"outreach"})} style={{padding:"6px 12px",borderRadius:7,fontSize:11,fontWeight:700,background:"#f59e0b",color:"#0f172a",border:"none",cursor:"pointer"}}>✉ Email</button>
                          <button onClick={()=>setEmailModal({podcast:p,type:"followup"})} style={{padding:"6px 12px",borderRadius:7,fontSize:11,fontWeight:700,background:"#172033",color:"#3b82f6",border:"1px solid #3b82f640",cursor:"pointer"}}>↻ Follow</button>
                          <button onClick={()=>setDetailModal(p)} style={{padding:"6px 12px",borderRadius:7,fontSize:11,fontWeight:700,background:"#1e293b",color:"#94a3b8",border:"1px solid #334155",cursor:"pointer"}}>⚙ Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{marginTop:16,fontSize:12,color:"#334155",textAlign:"center"}}>Showing {filtered.length} of {podcasts.length} podcasts</div>
          </>
        )}

        {tab==="research" && <ResearchPanel existingPodcasts={podcasts} onAddPodcast={p=>setPodcasts(prev=>[...prev,p])}/>}
      </div>

      {emailModal  && <EmailModal podcast={emailModal.podcast} emailType={emailModal.type} onClose={()=>setEmailModal(null)}/>}
      {addModal    && <AddPodcastModal onSave={p=>setPodcasts(prev=>[...prev,p])} onClose={()=>setAddModal(false)}/>}
      {detailModal && <DetailModal podcast={detailModal} onUpdate={u=>setPodcasts(prev=>prev.map(p=>p.id===u.id?u:p))} onClose={()=>setDetailModal(null)}/>}
    </div>
  );
}
