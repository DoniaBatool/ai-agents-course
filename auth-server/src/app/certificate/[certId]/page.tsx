"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface CertData {
  studentName: string;
  certId:      string;
  completedAt: string;
  found:       boolean;
}

export default function CertificatePage() {
  const params               = useParams();
  const certId               = params.certId as string;
  const [data, setData]      = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/certificate/${certId}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setData({ found: false, studentName: "", certId: "", completedAt: "" }); setLoading(false); });
  }, [certId]);

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#06041a", color:"#a5b4fc", fontFamily:"Georgia" }}>
        Loading certificate…
      </div>
    );
  }

  if (!data?.found) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#06041a", color:"#f87171", fontFamily:"Georgia" }}>
        Certificate not found.
      </div>
    );
  }

  const date = new Date(data.completedAt).toLocaleDateString("en-US", { month:"long", year:"numeric" });

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #06041a !important; }
        }
        body { margin: 0; background: #0a0618; }
      `}</style>

      {/* Print button */}
      <div className="no-print" style={{
        position:"fixed", top:16, right:16, zIndex:100,
        display:"flex", gap:12,
      }}>
        <button
          onClick={() => window.print()}
          style={{
            background:"linear-gradient(135deg,#7c3aed,#6366f1)",
            color:"#fff", border:"none", borderRadius:8,
            padding:"10px 24px", fontSize:14, cursor:"pointer", fontFamily:"Georgia",
          }}
        >
          Save as PDF (Ctrl+P)
        </button>
      </div>

      {/* Certificate */}
      <div style={{
        width:"100vw", minHeight:"100vh",
        display:"flex", alignItems:"center", justifyContent:"center",
        background:"#0a0618", padding:"40px 0",
      }}>
        <div style={{
          width:880, height:624,
          background:"#06041a",
          position:"relative",
          fontFamily:"Georgia, serif",
          boxShadow:"0 0 80px rgba(99,102,241,0.3)",
        }}>
          {/* Outer gold border */}
          <div style={{ position:"absolute", inset:14, border:"2.5px solid #c9a84c", pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:22, border:"1px solid rgba(201,168,76,0.45)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:32, border:"0.75px solid #6366f1", pointerEvents:"none" }} />

          {/* Corner ornaments */}
          {[
            { top:14, left:14 }, { top:14, right:14 },
            { bottom:14, left:14 }, { bottom:14, right:14 },
          ].map((pos, i) => (
            <div key={i} style={{ position:"absolute", width:50, height:50, ...pos }}>
              <div style={{ position:"absolute", inset:0, border:"1.5px solid #c9a84c", borderRadius:"50%", opacity:0.4 }} />
              <div style={{ position:"absolute", inset:8, border:"1px solid #f0d080", borderRadius:"50%", opacity:0.6 }} />
              <div style={{ position:"absolute", inset:18, background:"#f0d080", borderRadius:"50%" }} />
            </div>
          ))}

          {/* Top banner */}
          <div style={{
            position:"absolute", top:40, left:44, right:44, height:70,
            background:"rgba(124,58,237,0.15)",
            border:"0.5px solid rgba(201,168,76,0.4)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            {/* AI logo */}
            <div style={{
              position:"absolute",
              width:60, height:60, top:-30,
              left:"50%", transform:"translateX(-50%)",
            }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#06041a", border:"2.5px solid #c9a84c" }} />
              <div style={{ position:"absolute", inset:5, borderRadius:"50%", background:"#7c3aed", border:"1px solid #f0d080" }} />
              <div style={{
                position:"absolute", inset:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontWeight:"bold", fontSize:18,
              }}>AI</div>
            </div>
            <span style={{
              color:"#f0d080", fontSize:11, fontWeight:"bold",
              letterSpacing:"0.45em", marginTop:8,
            }}>AI  AGENTS  ACADEMY</span>
          </div>

          {/* Gold divider with diamond */}
          <div style={{ position:"absolute", top:138, left:72, right:72 }}>
            <div style={{ position:"absolute", top:4, left:0, right:"52%", height:3, background:"linear-gradient(to right,transparent,#c9a84c)" }} />
            <div style={{ position:"absolute", top:4, left:"52%", right:0, height:3, background:"linear-gradient(to left,transparent,#c9a84c)" }} />
            <div style={{
              position:"absolute", top:-3,
              left:"50%", transform:"translateX(-50%) rotate(45deg)",
              width:14, height:14, background:"#f0d080", border:"1px solid #c9a84c",
            }} />
          </div>

          {/* Certificate title */}
          <div style={{
            position:"absolute", top:154, left:56, right:56,
            textAlign:"center", color:"#ffffff",
            fontSize:38, fontWeight:"bold", letterSpacing:1,
          }}>
            Certificate of Completion
          </div>

          {/* Subtitle */}
          <div style={{
            position:"absolute", top:208, left:56, right:56,
            textAlign:"center", color:"#c0c8d8",
            fontSize:13, fontStyle:"italic",
          }}>
            This is to proudly certify that
          </div>

          {/* Student name */}
          <div style={{
            position:"absolute", top:230, left:160, right:160,
            textAlign:"center",
          }}>
            <div style={{
              fontSize:36, fontWeight:"bold", color:"#f0d080",
              fontStyle:"italic", letterSpacing:1, lineHeight:1.2,
            }}>
              {data.studentName}
            </div>
            <div style={{ marginTop:4, height:2, background:"rgba(201,168,76,0.4)" }} />
          </div>

          {/* Description */}
          <div style={{
            position:"absolute", top:298, left:56, right:56,
            textAlign:"center", color:"#c0c8d8",
            fontSize:12, fontStyle:"italic",
          }}>
            has successfully completed all modules of the
          </div>

          {/* Course name box */}
          <div style={{
            position:"absolute", top:318, left:144, right:144,
            height:62,
            background:"rgba(124,58,237,0.2)",
            border:"1.5px solid #c9a84c",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0, width:5, background:"#c9a84c",
            }} />
            <div style={{
              position:"absolute", right:0, top:0, bottom:0, width:5, background:"#c9a84c",
            }} />
            <span style={{ fontSize:20, fontWeight:"bold", color:"#ffffff" }}>
              AI Agents Development Course
            </span>
          </div>

          {/* Thin separator */}
          <div style={{
            position:"absolute", top:396, left:56, right:56,
            height:2, background:"rgba(201,168,76,0.4)",
          }} />

          {/* Footer: Date | Seal | Signature */}
          {/* Date */}
          <div style={{ position:"absolute", bottom:70, left:56, width:220, textAlign:"center" }}>
            <div style={{ fontSize:16, fontWeight:"bold", color:"#f0d080" }}>{date}</div>
            <div style={{ marginTop:4, height:2, background:"rgba(201,168,76,0.5)" }} />
            <div style={{ marginTop:4, fontSize:9, color:"#c0c8d8", letterSpacing:"0.2em" }}>DATE OF COMPLETION</div>
          </div>

          {/* Seal */}
          <div style={{
            position:"absolute",
            bottom:52,
            left:"50%", transform:"translateX(-50%)",
            width:100, height:100,
          }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#06041a", border:"2.5px solid #c9a84c" }} />
            <div style={{ position:"absolute", inset:8, borderRadius:"50%", background:"#06041a", border:"0.75px solid #f0d080" }} />
            <div style={{ position:"absolute", inset:14, borderRadius:"50%", background:"rgba(124,58,237,0.8)", border:"1.5px solid #c9a84c" }} />
            <div style={{ position:"absolute", inset:24, borderRadius:"50%", background:"#6366f1" }} />
            {/* 8 star dots */}
            {Array.from({length:8}).map((_,i) => {
              const angle = (i * 45) * Math.PI / 180;
              const r = 43;
              const cx = 50 + Math.cos(angle) * r;
              const cy = 50 + Math.sin(angle) * r;
              return (
                <div key={i} style={{
                  position:"absolute",
                  width:6, height:6, borderRadius:"50%",
                  background:"#f0d080",
                  left:cx - 3, top:cy - 3,
                }} />
              );
            })}
            <div style={{
              position:"absolute", inset:0,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:0,
            }}>
              <span style={{ fontSize:7, fontWeight:"bold", color:"#f0d080", letterSpacing:"0.15em" }}>VERIFIED</span>
              <span style={{ fontSize:11, fontWeight:"bold", color:"#ffffff" }}>CERT</span>
            </div>
          </div>

          {/* Signature */}
          <div style={{ position:"absolute", bottom:70, right:56, width:220, textAlign:"center" }}>
            <div style={{ fontSize:18, color:"#a5b4fc", fontStyle:"italic" }}>Donia Batool</div>
            <div style={{ marginTop:4, height:2, background:"rgba(201,168,76,0.5)" }} />
            <div style={{ marginTop:4, fontSize:9, color:"#c0c8d8", letterSpacing:"0.2em" }}>INSTRUCTOR &amp; DIRECTOR</div>
            <div style={{ marginTop:2, fontSize:9, color:"#c0c8d8" }}>AI Agents Academy</div>
          </div>

          {/* Bottom bar */}
          <div style={{
            position:"absolute", bottom:14, left:44, right:44,
            height:28,
            background:"rgba(124,58,237,0.1)",
            border:"0.5px solid rgba(201,168,76,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span style={{ fontSize:8, color:"#c0c8d8", letterSpacing:"0.1em" }}>
              Certificate ID: {data.certId}&nbsp;&nbsp;|&nbsp;&nbsp;Awarded by AI Agents Academy&nbsp;&nbsp;|&nbsp;&nbsp;Verify at: ai-agents-course-xi.vercel.app
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
