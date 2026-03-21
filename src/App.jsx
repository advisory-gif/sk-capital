import { useState } from "react";

export default function App() {
  return (
    <div style={{ background:"#070d1a", minHeight:"100vh", 
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"sans-serif", fontWeight:900, 
          fontSize:32, color:"#e6c364" }}>SK Capital</div>
        <div style={{ color:"rgba(232,240,255,0.5)", marginTop:8 }}>
          Coming soon...
        </div>
      </div>
    </div>
  );
}
