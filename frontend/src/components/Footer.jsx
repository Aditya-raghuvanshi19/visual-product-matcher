import React from "react";

export default function Footer(){
  return (
    <footer className="footer" role="contentinfo">
      <div>© {new Date().getFullYear()} VisionPro Inc. All rights reserved.</div>
    </footer>
  );
}
