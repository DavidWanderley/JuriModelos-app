import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const LegalEditor = ({ value, onChange }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        if (!isUpdating.current) {
          const html = quillRef.current.root.innerHTML;
          onChange(html === "<p><br></p>" ? "" : html);
        }
      });
    }
  }, []); 

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdating.current = true;
      quillRef.current.root.innerHTML = value || "";
      isUpdating.current = false;
    }
  }, [value]);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-inner">
      <div ref={containerRef} style={{ height: "400px" }} />
    </div>
  );
};

export default LegalEditor;