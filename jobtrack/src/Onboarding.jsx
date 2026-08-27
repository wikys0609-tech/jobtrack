   import { useState } from "react";
   import { supabase } from "./supabase";

   export default function Onboarding({ session, onDone }) {
     const [job, setJob] = useState("");

     async function next() {
       if (!job.trim()) return;
       // 직무를 profiles에 저장
       await supabase.from("profiles")
         .insert({ user_id: session.user.id, job: job.trim() });
       onDone(job.trim());  // 다음 단계(스펙 추가)로
     }

     return (
       <div style={{ minHeight: "100vh", background: "#0B0E1A", color: "#EAECF5",
         display: "flex", alignItems: "center", justifyContent: "center",
         fontFamily: "-apple-system, sans-serif" }}>
         <div style={{ width: 360, padding: 28, background: "#161B33",
           border: "1px solid #262C4A", borderRadius: 16 }}>
           <div style={{ fontSize: 13, color: "#7A82A8", marginBottom: 6 }}>온보딩 · 1/2</div>
           <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
             어떤 직무를 준비하세요?
           </div>
           <div style={{ fontSize: 12, color: "#7A82A8", marginBottom: 16 }}>
             예: 백엔드 개발자, 데이터 분석가, UX 디자이너
           </div>
           <input value={job} onChange={(e) => setJob(e.target.value)}
             onKeyDown={(e) => { if (e.key === "Enter") next(); }}
             placeholder="목표 직무 입력…"
             style={{ width: "100%", padding: "10px 12px", borderRadius: 8,
               background: "#0B0E1A", border: "1px solid #262C4A", color: "#EAECF5",
               outline: "none", boxSizing: "border-box", fontSize: 14, marginBottom: 14 }} />
           <button onClick={next}
             style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none",
               background: "#00E5C7", color: "#05070E", fontWeight: 700,
               fontSize: 14, cursor: "pointer" }}>
             다음 →
           </button>
         </div>
       </div>
     );
   }