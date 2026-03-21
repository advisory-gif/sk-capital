import { useState, useEffect, createContext, useContext } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:       "#070d1a",
  surface:  "#0d1526",
  panel:    "#111e30",
  card:     "#162238",
  elevated: "#1e2e45",
  border:   "rgba(255,255,255,0.07)",
  gold:     "#e6c364",
  goldDim:  "#b09040",
  goldFaint:"rgba(230,195,100,0.07)",
  blue:     "#4e9eff",
  blueFaint:"rgba(78,158,255,0.08)",
  text:     "#e8f0ff",
  muted:    "rgba(232,240,255,0.45)",
  faint:    "rgba(232,240,255,0.08)",
  success:  "#34d399",
  warn:     "#fbbf24",
  danger:   "#f87171",
  radius:   "6px",
  shadow:   "0 24px 60px rgba(0,0,0,0.5)",
};

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ─── ANALYSIS ENGINE ──────────────────────────────────────────────────────────
function runAnalysis(data) {
  const rev = parseFloat(data.revenue) || 0;
  const fixed = parseFloat(data.fixedCosts) || 0;
  const variable = parseFloat(data.variableCosts) || 0;
  const payroll = parseFloat(data.payroll) || 0;
  const cash = parseFloat(data.cash) || 0;
  const cogs = parseFloat(data.cogs) || rev * 0.4;
  const debt = parseFloat(data.debt) || 0;

  const burnRate = fixed + variable + payroll;
  const grossProfit = rev - cogs;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const opEx = fixed + variable + payroll;
  const opProfit = rev - opEx;
  const opMargin = rev > 0 ? (opProfit / rev) * 100 : 0;
  const netBurn = Math.max(burnRate - rev, 0);
  const runway = netBurn > 0 ? cash / netBurn : cash > 0 ? 999 : 0;
  const fixedRatio = rev > 0 ? (fixed / rev) * 100 : 0;
  const payrollRatio = rev > 0 ? (payroll / rev) * 100 : 0;

  // Health score 0-100
  let health = 0;
  if (runway > 18) health += 25; else if (runway > 12) health += 18; else if (runway > 6) health += 10;
  if (grossMargin > 60) health += 25; else if (grossMargin > 40) health += 18; else if (grossMargin > 20) health += 10;
  if (opMargin > 0) health += 25; else if (opMargin > -10) health += 10;
  if (rev > burnRate) health += 25; else if (rev > burnRate * 0.8) health += 12;

  // Insights
  const insights = [];
  if (runway < 6 && runway > 0) insights.push({ type:"danger", icon:"⚠️", msg:`At current burn, you have only ${runway.toFixed(1)} months of runway. This is critical — fundraising or cutting costs should be top priority.` });
  else if (runway < 12 && runway > 0) insights.push({ type:"warn", icon:"🕐", msg:`You have approximately ${runway.toFixed(1)} months of runway. Consider extending it through revenue growth or cost optimisation.` });
  else if (runway >= 12 && runway < 999) insights.push({ type:"good", icon:"✅", msg:`Your runway of ${runway.toFixed(0)} months is healthy. Use this window to grow revenue and build towards profitability.` });
  else if (runway === 999) insights.push({ type:"good", icon:"✅", msg:`You are cash flow positive — your revenue exceeds your burn rate. Strong position.` });

  if (fixedRatio > 70) insights.push({ type:"warn", icon:"📊", msg:`Fixed costs consume ${fixedRatio.toFixed(0)}% of monthly revenue, leaving limited flexibility. Review recurring expenses for cuts.` });
  else if (fixedRatio > 50) insights.push({ type:"warn", icon:"📊", msg:`Fixed costs are ${fixedRatio.toFixed(0)}% of revenue. Watch this ratio — if revenue dips, margins will compress quickly.` });

  if (grossMargin < 30 && rev > 0) insights.push({ type:"warn", icon:"📉", msg:`Gross margin of ${grossMargin.toFixed(0)}% is thin. Focus on either raising prices or reducing cost of goods sold.` });
  else if (grossMargin > 60) insights.push({ type:"good", icon:"💪", msg:`Gross margin of ${grossMargin.toFixed(0)}% is strong. This gives you room to invest in growth.` });

  if (payrollRatio > 50 && payroll > 0) insights.push({ type:"warn", icon:"👥", msg:`Payroll is ${payrollRatio.toFixed(0)}% of revenue. Ensure headcount growth is tied to revenue milestones.` });

  if (opMargin > 15) insights.push({ type:"good", icon:"🚀", msg:`Operating margin of ${opMargin.toFixed(0)}% is excellent. You are building a sustainably profitable business.` });
  else if (opMargin < 0 && rev > 0) insights.push({ type:"warn", icon:"📋", msg:`You are currently operating at a loss (${opMargin.toFixed(0)}% margin). Map a clear path to breakeven.` });

  if (debt > cash * 0.5 && debt > 0) insights.push({ type:"warn", icon:"🏦", msg:`Debt obligations are significant relative to cash. Ensure debt service is factored into your runway.` });

  return { burnRate, grossProfit, grossMargin, opMargin, opProfit, netBurn, runway, health, fixedRatio, payrollRatio, insights, rev, cash };
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", disabled, full, small, style={} }) {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
    fontFamily:"inherit", fontWeight:600, cursor: disabled ? "not-allowed" : "pointer",
    border:"none", borderRadius:T.radius, transition:"all 0.18s", opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto",
    padding: small ? "8px 16px" : "12px 24px",
    fontSize: small ? 13 : 14,
    ...style,
  };
  const variants = {
    primary:   { background:T.gold, color:"#1a1200" },
    secondary: { background:T.elevated, color:T.text, border:`1px solid ${T.border}` },
    ghost:     { background:"transparent", color:T.muted },
    danger:    { background:"rgba(248,113,113,0.12)", color:T.danger, border:`1px solid rgba(248,113,113,0.25)` },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity="0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}>
      {children}
    </button>
  );
}

function Input({ label, type="text", value, onChange, placeholder, icon, hint, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:12, fontWeight:600, color:T.muted, letterSpacing:0.5 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
          fontSize:16, color:T.muted, pointerEvents:"none" }}>{icon}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width:"100%", background:T.card, border:`1px solid ${error ? T.danger : focused ? T.gold : T.border}`,
            borderRadius:T.radius, padding: icon ? "11px 14px 11px 40px" : "11px 14px",
            color:T.text, fontSize:14, outline:"none", fontFamily:"inherit",
            transition:"border 0.18s", boxSizing:"border-box",
          }}/>
      </div>
      {hint && !error && <span style={{ fontSize:11, color:T.muted }}>{hint}</span>}
      {error && <span style={{ fontSize:11, color:T.danger }}>{error}</span>}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:12, fontWeight:600, color:T.muted, letterSpacing:0.5 }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        background:T.card, border:`1px solid ${T.border}`, borderRadius:T.radius,
        padding:"11px 14px", color:T.text, fontSize:14, outline:"none",
        fontFamily:"inherit", cursor:"pointer",
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:T.panel, border:`1px solid ${T.border}`,
    borderRadius:T.radius, ...style }}>{children}</div>;
}

function InsightCard({ insight }) {
  const bg = { good:T.success, warn:T.warn, danger:T.danger };
  const color = bg[insight.type] || T.muted;
  return (
    <div style={{ background:`${color}08`, border:`1px solid ${color}25`,
      borderRadius:T.radius, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
      <span style={{ fontSize:18, flexShrink:0 }}>{insight.icon}</span>
      <p style={{ fontSize:13, color:T.text, lineHeight:1.6, margin:0 }}>{insight.msg}</p>
    </div>
  );
}

function HealthRing({ score }) {
  const color = score >= 70 ? T.success : score >= 40 ? T.warn : T.danger;
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position:"relative", width:96, height:96 }}>
      <svg width={96} height={96} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={48} cy={48} r={r} fill="none" stroke={T.faint} strokeWidth={7}/>
        <circle cx={48} cy={48} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"Manrope,sans-serif", fontWeight:800,
          fontSize:22, color, lineHeight:1 }}>{score}</span>
        <span style={{ fontSize:9, color:T.muted, textTransform:"uppercase", letterSpacing:1 }}>health</span>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────
function AuthShell({ children }) {
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex",
      alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      {/* Background glow */}
      <div style={{ position:"absolute", top:-200, left:"50%", transform:"translateX(-50%)",
        width:600, height:600, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(230,195,100,0.06) 0%, transparent 70%)",
        pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-100, right:-100,
        width:400, height:400, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(78,158,255,0.05) 0%, transparent 70%)",
        pointerEvents:"none" }}/>
      <div style={{ width:"100%", maxWidth:440, position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontFamily:"Manrope,sans-serif", fontWeight:900, fontSize:26, color:T.gold, letterSpacing:-0.5 }}>
            SK Capital
          </div>
          <div style={{ color:T.muted, fontSize:12, marginTop:4, letterSpacing:1 }}>
            CFO Intelligence Platform
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function SignIn({ setPage }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1000));
    login({ email, name: email.split("@")[0], plan:"free", onboarded:false });
    setLoading(false);
  };

  return (
    <AuthShell>
      <Card style={{ padding:36 }}>
        <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:22,
          marginBottom:6, color:T.text }}>Welcome back</h2>
        <p style={{ color:T.muted, fontSize:13, marginBottom:28 }}>Sign in to your SK Capital account</p>

        {error && <div style={{ background:"rgba(248,113,113,0.1)", border:`1px solid rgba(248,113,113,0.2)`,
          borderRadius:T.radius, padding:"10px 14px", fontSize:13, color:T.danger, marginBottom:16 }}>{error}</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Input label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="you@company.com" icon="✉️"/>
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••" icon="🔒"/>
          <div style={{ textAlign:"right" }}>
            <button onClick={() => setPage("forgot")} style={{ background:"none", border:"none",
              color:T.gold, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
              Forgot password?
            </button>
          </div>
          <Btn onClick={submit} full disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Btn>
        </div>

        <div style={{ margin:"24px 0", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1, height:1, background:T.border }}/>
          <span style={{ color:T.muted, fontSize:12 }}>or continue with</span>
          <div style={{ flex:1, height:1, background:T.border }}/>
        </div>

        <Btn variant="secondary" full onClick={() => { login({ email:"demo@skcapital.com", name:"Demo User", plan:"pro", onboarded:true }); }}>
          <span>🔍</span> Continue with Google
        </Btn>

        <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:T.muted }}>
          No account?{" "}
          <button onClick={() => setPage("signup")} style={{ background:"none", border:"none",
            color:T.gold, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
            Create one free
          </button>
        </p>
      </Card>
    </AuthShell>
  );
}

function SignUp({ setPage }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const f = (k, v) => setForm(p => ({ ...p, [k]:v }));

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login({ email:form.email, name:form.name, plan:"free", onboarded:false });
  };

  return (
    <AuthShell>
      <Card style={{ padding:36 }}>
        <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:22,
          marginBottom:6, color:T.text }}>Create your account</h2>
        <p style={{ color:T.muted, fontSize:13, marginBottom:28 }}>
          Get CFO-level insight in minutes. Free to start.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Full name" value={form.name} onChange={e=>f("name",e.target.value)}
            placeholder="Jane Smith" icon="👤" error={errors.name}/>
          <Input label="Work email" type="email" value={form.email} onChange={e=>f("email",e.target.value)}
            placeholder="jane@company.com" icon="✉️" error={errors.email}/>
          <Input label="Password" type="password" value={form.password} onChange={e=>f("password",e.target.value)}
            placeholder="Min. 8 characters" icon="🔒" error={errors.password}
            hint="Use at least 8 characters with a mix of letters and numbers"/>
          <Input label="Confirm password" type="password" value={form.confirm} onChange={e=>f("confirm",e.target.value)}
            placeholder="••••••••" icon="🔒" error={errors.confirm}/>
          <Btn onClick={submit} full disabled={loading}>
            {loading ? "Creating account…" : "Create Free Account →"}
          </Btn>
        </div>
        <p style={{ textAlign:"center", marginTop:20, fontSize:11, color:T.muted, lineHeight:1.6 }}>
          By signing up you agree to our{" "}
          <span style={{ color:T.gold }}>Terms of Service</span> and{" "}
          <span style={{ color:T.gold }}>Privacy Policy</span>.
        </p>
        <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:T.muted }}>
          Already have an account?{" "}
          <button onClick={() => setPage("signin")} style={{ background:"none", border:"none",
            color:T.gold, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
            Sign in
          </button>
        </p>
      </Card>
    </AuthShell>
  );
}

function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell>
      <Card style={{ padding:36 }}>
        {!sent ? <>
          <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:22, marginBottom:6, color:T.text }}>
            Reset password
          </h2>
          <p style={{ color:T.muted, fontSize:13, marginBottom:28 }}>
            We'll send a reset link to your email address.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Input label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="you@company.com" icon="✉️"/>
            <Btn onClick={() => setSent(true)} full>Send Reset Link</Btn>
          </div>
        </> : <>
          <div style={{ textAlign:"center", padding:"16px 0" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>📬</div>
            <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, marginBottom:8, color:T.text }}>
              Check your inbox
            </h2>
            <p style={{ color:T.muted, fontSize:13, lineHeight:1.6 }}>
              We sent a reset link to <strong style={{ color:T.text }}>{email}</strong>
            </p>
          </div>
        </>}
        <p style={{ textAlign:"center", marginTop:24, fontSize:13, color:T.muted }}>
          <button onClick={() => setPage("signin")} style={{ background:"none", border:"none",
            color:T.gold, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
            ← Back to sign in
          </button>
        </p>
      </Card>
    </AuthShell>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const STEPS = ["Role", "Details", "Data", "Done"];

function OnboardingProgress({ step }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:36 }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:28, height:28, borderRadius:"50%",
              background: i < step ? T.gold : i === step ? T.gold : T.card,
              border: `2px solid ${i <= step ? T.gold : T.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:700, color: i <= step ? "#1a1200" : T.muted,
              transition:"all 0.3s" }}>
              {i < step ? "✓" : i+1}
            </div>
            <span style={{ fontSize:10, color: i === step ? T.gold : T.muted,
              fontWeight: i === step ? 700 : 400, whiteSpace:"nowrap" }}>{s}</span>
          </div>
          {i < STEPS.length-1 && (
            <div style={{ flex:1, height:2, background: i < step ? T.gold : T.border,
              margin:"0 8px", marginBottom:18, transition:"background 0.3s" }}/>
          )}
        </div>
      ))}
    </div>
  );
}

function Onboarding({ completeOnboarding }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [bizData, setBizData] = useState({
    bizName:"", industry:"saas", model:"subscription",
    revenue:"", fixedCosts:"", variableCosts:"",
    cash:"", debt:"", payroll:"", teamSize:"", cogs:""
  });
  const [fundData, setFundData] = useState({ fundName:"", vintage:"2024", currency:"USD", targetSize:"" });
  const biz = (k,v) => setBizData(p => ({ ...p, [k]:v }));
  const fund = (k,v) => setFundData(p => ({ ...p, [k]:v }));

  const roleCards = [
    { id:"business", icon:"🏢", title:"Business Owner / Founder", desc:"Analyse your business financials. Get CFO-level insights on runway, burn, margins and health." },
    { id:"fund",     icon:"📈", title:"Fund Manager / GP",         desc:"Manage your PE/VC fund, portfolio companies, LP relationships and deal pipeline." },
    { id:"both",     icon:"⚡", title:"Both",                      desc:"You wear both hats — run your business and manage investment activities in one platform." },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth: step === 2 ? 640 : 520 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Manrope,sans-serif", fontWeight:900, fontSize:22, color:T.gold }}>SK Capital</div>
          <div style={{ color:T.muted, fontSize:12, marginTop:3 }}>
            Welcome, {user.name.split(" ")[0]} — let's get you set up
          </div>
        </div>

        <OnboardingProgress step={step}/>

        <Card style={{ padding:32 }}>
          {/* STEP 0 — Role */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, marginBottom:8, color:T.text }}>
                What best describes you?
              </h2>
              <p style={{ color:T.muted, fontSize:13, marginBottom:24 }}>
                This helps us personalise your experience. You can change this later.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {roleCards.map(r => (
                  <div key={r.id} onClick={() => setRole(r.id)} style={{
                    padding:"16px 18px", borderRadius:T.radius, cursor:"pointer",
                    border:`2px solid ${role===r.id ? T.gold : T.border}`,
                    background: role===r.id ? T.goldFaint : T.card,
                    transition:"all 0.18s", display:"flex", alignItems:"center", gap:14,
                  }}>
                    <span style={{ fontSize:24 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color: role===r.id ? T.gold : T.text }}>{r.title}</div>
                      <div style={{ fontSize:12, color:T.muted, marginTop:3, lineHeight:1.5 }}>{r.desc}</div>
                    </div>
                    {role===r.id && <span style={{ marginLeft:"auto", color:T.gold, fontSize:18 }}>✓</span>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:24 }}>
                <Btn onClick={() => role && setStep(1)} full disabled={!role}>
                  Continue →
                </Btn>
              </div>
            </div>
          )}

          {/* STEP 1 — Details */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, marginBottom:8, color:T.text }}>
                {role === "fund" ? "Tell us about your fund" : "Tell us about your business"}
              </h2>
              <p style={{ color:T.muted, fontSize:13, marginBottom:24 }}>Basic details to personalise your dashboard.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {(role === "business" || role === "both") && <>
                  <Input label="Business name" value={bizData.bizName}
                    onChange={e=>biz("bizName",e.target.value)} placeholder="Acme Inc." icon="🏢"/>
                  <Select label="Industry" value={bizData.industry} onChange={e=>biz("industry",e.target.value)}
                    options={[
                      {value:"saas",label:"SaaS / Software"},{value:"service",label:"Professional Services"},
                      {value:"ecommerce",label:"E-commerce / D2C"},{value:"agency",label:"Agency"},
                      {value:"healthcare",label:"Healthcare"},{value:"fintech",label:"Fintech"},
                      {value:"other",label:"Other"},
                    ]}/>
                  <Select label="Business model" value={bizData.model} onChange={e=>biz("model",e.target.value)}
                    options={[
                      {value:"subscription",label:"Subscription / Recurring"},
                      {value:"transactional",label:"Transactional"},
                      {value:"project",label:"Project-based"},
                      {value:"marketplace",label:"Marketplace"},
                    ]}/>
                </>}
                {(role === "fund" || role === "both") && <>
                  <Input label="Fund name" value={fundData.fundName}
                    onChange={e=>fund("fundName",e.target.value)} placeholder="SK Capital Fund I" icon="📈"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <Select label="Vintage year" value={fundData.vintage} onChange={e=>fund("vintage",e.target.value)}
                      options={[2020,2021,2022,2023,2024,2025,2026].map(y=>({value:String(y),label:String(y)}))}/>
                    <Select label="Currency" value={fundData.currency} onChange={e=>fund("currency",e.target.value)}
                      options={["USD","EUR","GBP","SGD","INR"].map(c=>({value:c,label:c}))}/>
                  </div>
                  <Input label="Target fund size" value={fundData.targetSize}
                    onChange={e=>fund("targetSize",e.target.value)} placeholder="e.g. 100000000" icon="💰"
                    hint="Enter amount in numbers (e.g. 100000000 = $100M)"/>
                </>}
              </div>
              <div style={{ display:"flex", gap:10, marginTop:24 }}>
                <Btn variant="secondary" onClick={() => setStep(0)}>← Back</Btn>
                <Btn onClick={() => setStep(2)} full>Continue →</Btn>
              </div>
            </div>
          )}

          {/* STEP 2 — Financial Data */}
          {step === 2 && (role === "business" || role === "both") && (
            <div>
              <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, marginBottom:8, color:T.text }}>
                Enter your financial data
              </h2>
              <p style={{ color:T.muted, fontSize:13, marginBottom:24 }}>
                All figures are monthly unless noted. This data never leaves your account.
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Input label="Monthly Revenue ($)" value={bizData.revenue}
                  onChange={e=>biz("revenue",e.target.value)} placeholder="50000" icon="💰"/>
                <Input label="Cash in Bank ($)" value={bizData.cash}
                  onChange={e=>biz("cash",e.target.value)} placeholder="200000" icon="🏦"/>
                <Input label="Fixed Costs / mo ($)" value={bizData.fixedCosts}
                  onChange={e=>biz("fixedCosts",e.target.value)} placeholder="15000" icon="📌"
                  hint="Rent, software, insurance"/>
                <Input label="Variable Costs / mo ($)" value={bizData.variableCosts}
                  onChange={e=>biz("variableCosts",e.target.value)} placeholder="8000" icon="📦"
                  hint="Marketing, contractors"/>
                <Input label="Monthly Payroll ($)" value={bizData.payroll}
                  onChange={e=>biz("payroll",e.target.value)} placeholder="20000" icon="👥"/>
                <Input label="Cost of Goods Sold ($)" value={bizData.cogs}
                  onChange={e=>biz("cogs",e.target.value)} placeholder="10000" icon="🏭"
                  hint="Leave blank to auto-estimate"/>
                <Input label="Debt Obligations ($)" value={bizData.debt}
                  onChange={e=>biz("debt",e.target.value)} placeholder="0" icon="🏛️"
                  hint="Total outstanding (optional)"/>
                <Input label="Team size" value={bizData.teamSize}
                  onChange={e=>biz("teamSize",e.target.value)} placeholder="8" icon="🙋"
                  hint="Number of employees"/>
              </div>
              <div style={{ marginTop:16, padding:12, background:T.goldFaint,
                border:`1px solid rgba(230,195,100,0.15)`, borderRadius:T.radius }}>
                <p style={{ fontSize:12, color:T.muted, margin:0 }}>
                  💡 <strong style={{ color:T.text }}>Tip:</strong> Even rough estimates will generate useful insights.
                  You can refine your data at any time from the dashboard.
                </p>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
                <Btn onClick={() => setStep(3)} full>Run Analysis →</Btn>
              </div>
            </div>
          )}

          {step === 2 && role === "fund" && (
            <div>
              <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, marginBottom:8 }}>
                Fund setup complete
              </h2>
              <p style={{ color:T.muted, fontSize:13, marginBottom:24 }}>
                Your fund dashboard is ready. You can add portfolio companies and LPs from the dashboard.
              </p>
              <Btn onClick={() => setStep(3)} full>Go to Fund Dashboard →</Btn>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div style={{ textAlign:"center", padding:"8px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
              <h2 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:22,
                marginBottom:8, color:T.text }}>You're all set!</h2>
              <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, marginBottom:28 }}>
                {role === "fund"
                  ? "Your fund management dashboard is ready."
                  : `We've analysed your data for ${bizData.bizName || "your business"}. Your financial insights are ready.`}
              </p>
              {(role === "business" || role === "both") && bizData.revenue && (
                <div style={{ background:T.card, borderRadius:T.radius, padding:16, marginBottom:24, textAlign:"left" }}>
                  {(() => {
                    const a = runAnalysis(bizData);
                    return (
                      <div style={{ display:"flex", justifyContent:"space-around" }}>
                        {[
                          { l:"Runway", v: a.runway === 999 ? "∞" : `${a.runway.toFixed(1)}mo` },
                          { l:"Gross Margin", v:`${a.grossMargin.toFixed(0)}%` },
                          { l:"Health Score", v:a.health },
                        ].map(k => (
                          <div key={k.l} style={{ textAlign:"center" }}>
                            <div style={{ color:T.gold, fontFamily:"Manrope,sans-serif",
                              fontWeight:800, fontSize:22 }}>{k.v}</div>
                            <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>{k.l}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              <Btn onClick={() => completeOnboarding({ role, bizData, fundData })} full>
                Open My Dashboard →
              </Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── DASHBOARDS ───────────────────────────────────────────────────────────────
const NAV_CFO  = ["Overview","Analysis","Scenarios","Reports","Settings"];
const NAV_FUND = ["Fund Overview","Portfolio","Investors","Deal Pipeline","Reports","Settings"];

function AppShell({ nav, activePage, setActivePage, children, userName, plan }) {
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <aside style={{ width:240, background:T.surface, borderRight:`1px solid ${T.border}`,
        display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, height:"100vh" }}>
        <div style={{ padding:"28px 22px 0" }}>
          <div style={{ fontFamily:"Manrope,sans-serif", fontWeight:900, fontSize:20,
            color:T.gold, letterSpacing:-0.5, marginBottom:32 }}>SK Capital</div>
          <nav style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {nav.map(item => {
              const active = activePage === item;
              return (
                <button key={item} onClick={() => setActivePage(item)} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                  background: active ? T.goldFaint : "transparent",
                  borderLeft:`2px solid ${active ? T.gold : "transparent"}`,
                  color: active ? T.gold : T.muted,
                  fontFamily:"inherit", fontSize:13, fontWeight: active ? 600 : 400,
                  cursor:"pointer", border:"none",
                  borderLeft:`2px solid ${active ? T.gold : "transparent"}`,
                  borderRadius:0, textAlign:"left", transition:"all 0.15s",
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color=T.text; e.currentTarget.style.background=T.card; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color=T.muted; e.currentTarget.style.background="transparent"; }}}
                >{item}</button>
              );
            })}
          </nav>
        </div>
        <div style={{ marginTop:"auto", padding:"20px 22px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:T.elevated,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, fontSize:12, color:T.gold }}>
              {userName[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{userName}</div>
              <div style={{ fontSize:10, color:T.muted, textTransform:"capitalize" }}>{plan} plan</div>
            </div>
          </div>
          {plan === "free" && (
            <div style={{ background:T.goldFaint, border:`1px solid rgba(230,195,100,0.2)`,
              borderRadius:T.radius, padding:"10px 12px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.gold, marginBottom:3 }}>Upgrade to Pro</div>
              <div style={{ fontSize:10, color:T.muted, marginBottom:8 }}>Scenario planning, forecasting & more</div>
              <Btn small full>Upgrade $49/mo</Btn>
            </div>
          )}
        </div>
      </aside>
      <main style={{ marginLeft:240, flex:1 }}>{children}</main>
    </div>
  );
}

function PremiumGate({ feature }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      minHeight:300, gap:16, textAlign:"center", padding:40 }}>
      <div style={{ fontSize:40 }}>🔒</div>
      <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, color:T.text }}>{feature}</h3>
      <p style={{ color:T.muted, fontSize:14, maxWidth:360, lineHeight:1.6 }}>
        This feature is available on the Pro plan. Unlock scenario planning, forecasting, advanced reports and more.
      </p>
      <Btn>Upgrade to Pro — $49/mo</Btn>
    </div>
  );
}

function CFODashboard({ bizData, role, setRole }) {
  const { user } = useAuth();
  const [page, setPage] = useState("Overview");
  const analysis = runAnalysis(bizData);

  const KPI = [
    { label:"Monthly Revenue",   val:`$${Number(bizData.revenue||0).toLocaleString()}`,  sub:"Current month" },
    { label:"Burn Rate",         val:`$${analysis.burnRate.toLocaleString()}`,            sub:"Per month" },
    { label:"Runway",            val: analysis.runway===999?"Profitable":`${analysis.runway.toFixed(1)} mo`, sub:"At current burn" },
    { label:"Gross Margin",      val:`${analysis.grossMargin.toFixed(1)}%`,               sub:"Revenue − COGS" },
    { label:"Operating Margin",  val:`${analysis.opMargin.toFixed(1)}%`,                  sub:"Net of all OpEx" },
  ];

  return (
    <AppShell nav={role==="both"?[...NAV_CFO,"─","Fund Overview","Portfolio","Deal Pipeline"]:NAV_CFO}
      activePage={page} setActivePage={(p) => {
        if (["Fund Overview","Portfolio","Deal Pipeline"].includes(p)) setRole("fund_active");
        else setPage(p);
      }}
      userName={user.name} plan={user.plan}>
      <header style={{ padding:"22px 32px", borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h1 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, color:T.text }}>
            {page}
          </h1>
          <p style={{ color:T.muted, fontSize:11, marginTop:3, textTransform:"uppercase", letterSpacing:1.5 }}>
            {bizData.bizName || "Your Business"} • {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
          </p>
        </div>
        <HealthRing score={analysis.health}/>
      </header>

      <div style={{ padding:"24px 32px 60px" }}>
        {page === "Overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
              {KPI.map(k => (
                <Card key={k.label} style={{ padding:"16px 18px" }}>
                  <div style={{ color:T.muted, fontSize:9, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:2 }}>{k.label}</div>
                  <div style={{ color:T.gold, fontFamily:"Manrope,sans-serif",
                    fontWeight:800, fontSize:22, margin:"6px 0 4px" }}>{k.val}</div>
                  <div style={{ color:T.muted, fontSize:10 }}>{k.sub}</div>
                </Card>
              ))}
            </div>

            {/* Insights */}
            <div>
              <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15,
                marginBottom:12, color:T.text }}>
                📋 CFO Insights
              </h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {analysis.insights.length > 0
                  ? analysis.insights.map((ins,i) => <InsightCard key={i} insight={ins}/>)
                  : <Card style={{ padding:24 }}>
                      <p style={{ color:T.muted, fontSize:13, textAlign:"center" }}>
                        Enter financial data to generate insights.
                      </p>
                    </Card>
                }
              </div>
            </div>

            {/* Cost Breakdown */}
            {analysis.burnRate > 0 && (
              <Card style={{ padding:22 }}>
                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15,
                  marginBottom:16, color:T.text }}>Cost Structure</h3>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                  {[
                    { l:"Fixed Costs",    v:bizData.fixedCosts,    pct: analysis.burnRate>0?(bizData.fixedCosts/analysis.burnRate*100):0 },
                    { l:"Variable Costs", v:bizData.variableCosts, pct: analysis.burnRate>0?(bizData.variableCosts/analysis.burnRate*100):0 },
                    { l:"Payroll",        v:bizData.payroll,       pct: analysis.burnRate>0?(bizData.payroll/analysis.burnRate*100):0 },
                  ].map(k => (
                    <div key={k.l} style={{ background:T.card, borderRadius:T.radius, padding:"14px 16px" }}>
                      <div style={{ color:T.muted, fontSize:10, fontWeight:700,
                        textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>{k.l}</div>
                      <div style={{ fontWeight:700, fontSize:18, color:T.text,
                        fontFamily:"Manrope,sans-serif" }}>${Number(k.v||0).toLocaleString()}</div>
                      <div style={{ height:3, background:T.faint, borderRadius:2, marginTop:8 }}>
                        <div style={{ width:`${k.pct}%`, height:"100%", background:T.gold,
                          borderRadius:2, transition:"width 0.6s" }}/>
                      </div>
                      <div style={{ color:T.muted, fontSize:10, marginTop:4 }}>
                        {k.pct.toFixed(0)}% of total burn
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {page === "Analysis" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { label:"Gross Profit",       val:`$${analysis.grossProfit.toLocaleString()}`, sub:`${analysis.grossMargin.toFixed(1)}% margin` },
                { label:"Operating Profit",   val:`$${analysis.opProfit.toLocaleString()}`,    sub:`${analysis.opMargin.toFixed(1)}% margin` },
                { label:"Net Burn / Month",   val:`$${analysis.netBurn.toLocaleString()}`,     sub: analysis.netBurn===0?"Cash flow positive":"Monthly cash consumed" },
                { label:"Fixed Cost Ratio",   val:`${analysis.fixedRatio.toFixed(0)}%`,        sub:"Of monthly revenue" },
              ].map(k => (
                <Card key={k.label} style={{ padding:"18px 20px" }}>
                  <div style={{ color:T.muted, fontSize:10, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:2 }}>{k.label}</div>
                  <div style={{ color:T.gold, fontFamily:"Manrope,sans-serif",
                    fontWeight:800, fontSize:28, margin:"8px 0 4px" }}>{k.val}</div>
                  <div style={{ color:T.muted, fontSize:11 }}>{k.sub}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding:22 }}>
              <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15,
                marginBottom:16 }}>All Insights</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {analysis.insights.map((ins,i) => <InsightCard key={i} insight={ins}/>)}
              </div>
            </Card>
          </div>
        )}

        {page === "Scenarios"  && <PremiumGate feature="Scenario Planner"/>}
        {page === "Reports"    && <PremiumGate feature="Premium Reports"/>}
        {page === "Settings"   && (
          <Card style={{ padding:28, maxWidth:440 }}>
            <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:16, marginBottom:20 }}>Account Settings</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Input label="Business name" value={bizData.bizName || ""} onChange={()=>{}} placeholder="Your business"/>
              <Input label="Email" value={user.email} onChange={()=>{}} placeholder=""/>
              <div style={{ marginTop:8 }}>
                <Btn>Save Changes</Btn>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

// ─── FUND DASHBOARD (simplified from previous build) ─────────────────────────
const PORTFOLIO_DATA = [
  { name:"Acme Tech",    invested:120, current:340, moic:2.83, status:"Active", sector:"SaaS" },
  { name:"Global Health",invested:85,  current:110, moic:1.29, status:"Active", sector:"Healthcare" },
  { name:"NovaPay",      invested:95,  current:280, moic:2.95, status:"Active", sector:"Fintech" },
  { name:"DataStream",   invested:40,  current:38,  moic:0.95, status:"Watch",  sector:"SaaS" },
];

function FundDashboardPage({ fundData, role, setRole }) {
  const { user } = useAuth();
  const [page, setPage] = useState("Fund Overview");

  const nav = role==="both"
    ? [...NAV_FUND,"─","CFO Overview","CFO Analysis"]
    : NAV_FUND;

  return (
    <AppShell nav={nav} activePage={page}
      setActivePage={(p) => {
        if (["CFO Overview","CFO Analysis"].includes(p)) setRole("cfo_active");
        else setPage(p);
      }}
      userName={user.name} plan={user.plan}>
      <header style={{ padding:"22px 32px", borderBottom:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h1 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, color:T.text }}>{page}</h1>
          <p style={{ color:T.muted, fontSize:11, marginTop:3, textTransform:"uppercase", letterSpacing:1.5 }}>
            {fundData.fundName || "My Fund"} • Mar 2026
          </p>
        </div>
        <div style={{ background:T.goldFaint, border:`1px solid rgba(230,195,100,0.2)`,
          borderRadius:T.radius, padding:"8px 14px", fontSize:12, color:T.gold, fontWeight:600 }}>
          Enterprise Plan
        </div>
      </header>
      <div style={{ padding:"24px 32px 60px" }}>
        {page === "Fund Overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
              {[
                {l:"Total AUM",v:"$4.2B"},{l:"Net IRR",v:"24.2%"},
                {l:"MOIC",v:"2.8x"},{l:"DPI",v:"1.2x"},{l:"TVPI",v:"2.1x"}
              ].map(k => (
                <Card key={k.l} style={{ padding:"16px 18px" }}>
                  <div style={{ color:T.muted, fontSize:9, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:2 }}>{k.l}</div>
                  <div style={{ color:T.gold, fontFamily:"Manrope,sans-serif",
                    fontWeight:800, fontSize:26, marginTop:6 }}>{k.v}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding:22, overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontFamily:"Manrope,sans-serif", fontWeight:700, fontSize:15 }}>Portfolio Companies</h3>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:T.surface }}>
                    {["Company","Sector","Invested","Value","MOIC","Status"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:9,
                        fontWeight:700, textTransform:"uppercase", letterSpacing:2, color:T.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PORTFOLIO_DATA.map(co => (
                    <tr key={co.name} style={{ borderTop:`1px solid ${T.faint}` }}
                      onMouseEnter={e=>e.currentTarget.style.background=T.elevated}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"13px 16px", fontWeight:600, fontSize:13 }}>{co.name}</td>
                      <td style={{ padding:"13px 16px", fontSize:12, color:T.muted }}>{co.sector}</td>
                      <td style={{ padding:"13px 16px", fontSize:12 }}>${co.invested}M</td>
                      <td style={{ padding:"13px 16px", fontWeight:700 }}>${co.current}M</td>
                      <td style={{ padding:"13px 16px", fontWeight:700,
                        color:co.moic>=2?T.gold:co.moic<1?T.danger:T.text }}>
                        {co.moic.toFixed(2)}x
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:co.status==="Active"?T.success:T.warn }}>
                          ● {co.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {page !== "Fund Overview" && <PremiumGate feature={page}/>}
      </div>
    </AppShell>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("signin");
  const [onboardingData, setOnboardingData] = useState(null);
  const [activeRole, setActiveRole] = useState(null); // "cfo_active" | "fund_active"

  const login = (u) => setUser(u);
  const logout = () => { setUser(null); setOnboardingData(null); setActiveRole(null); };

  const completeOnboarding = (data) => {
    setOnboardingData(data);
    setUser(u => ({ ...u, onboarded:true }));
    setActiveRole(data.role === "fund" ? "fund_active" : "cfo_active");
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        button, input, select { font-family: inherit; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#1e2e45; border-radius:4px; }
      `}</style>

      <AuthCtx.Provider value={{ user, login, logout }}>
        {!user && authPage === "signin"   && <SignIn setPage={setAuthPage}/>}
        {!user && authPage === "signup"   && <SignUp setPage={setAuthPage}/>}
        {!user && authPage === "forgot"   && <ForgotPassword setPage={setAuthPage}/>}
        {user  && !user.onboarded         && <Onboarding completeOnboarding={completeOnboarding}/>}
        {user  && user.onboarded && onboardingData && (
          <>
            {(activeRole === "cfo_active" || onboardingData.role === "business") && (
              <CFODashboard
                bizData={onboardingData.bizData}
                role={onboardingData.role}
                setRole={setActiveRole}
              />
            )}
            {(activeRole === "fund_active" || onboardingData.role === "fund") && activeRole !== "cfo_active" && (
              <FundDashboardPage
                fundData={onboardingData.fundData}
                role={onboardingData.role}
                setRole={setActiveRole}
              />
            )}
          </>
        )}
        {/* Demo bypass: if onboarded=true from Google login */}
        {user && user.onboarded && !onboardingData && (
          <CFODashboard
            bizData={{ revenue:85000, fixedCosts:18000, variableCosts:9000, cash:320000,
              payroll:28000, cogs:22000, debt:0, teamSize:12, bizName:"Demo Company" }}
            role="both"
            setRole={setActiveRole}
          />
        )}
      </AuthCtx.Provider>
    </>
  );
}
