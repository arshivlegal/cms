"use client";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef(null);
  const isUserTyping = useRef(false);
  const lastValueRef = useRef(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only update editor content when value changes externally (not from user input)
  useEffect(() => {
    if (!editorRef.current || isUserTyping.current) return;
    
    // Only update if the value is different from what's in the editor
    const currentContent = editorRef.current.getContent();
    
    if (value !== currentContent && value !== lastValueRef.current) {
      lastValueRef.current = value;
      editorRef.current.setContent(value || "");
    }
  }, [value]);

  const handleEditorChange = (content, editor) => {
    isUserTyping.current = true;
    lastValueRef.current = content;
    
    // Call onChange with the new content
    if (onChange) {
      onChange(content);
    }
    
    // Reset typing flag after a short delay
    setTimeout(() => {
      isUserTyping.current = false;
    }, 100);
  };

  if (!mounted) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 min-h-[400px] animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    );
  }

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      
      onInit={(evt, editor) => {
        editorRef.current = editor;
        lastValueRef.current = value;
      }}

      initialValue={value || ""}

      onEditorChange={handleEditorChange}

      init={{
        height: 400,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | link image | removeformat | code",
        content_style: `
  :root {
    --font-primary: 'Playfair Display', serif;
    --font-secondary: 'Source Sans 3', sans-serif;

    --text-main: #050505;
    --text-secondary: #3A3A3A;
    --accent-main: #804012;
  }

  /* h1 = hero-h1 */
  h1 {
    font-family: var(--font-primary);
    font-size: clamp(2.5rem, 3.333vw, 4rem);
    line-height: clamp(3.5rem, 1.167vw, 5rem);
    font-weight: 700;
    margin: 1.5rem 0 1rem;
    color: var(--text-main);
  }

  /* h2 = page-title-h2 */
  h2 {
    font-family: var(--font-secondary);
    font-size: clamp(1.75rem, 2.5vw, 3rem);
    line-height: clamp(2.5rem, 3.333vw, 4rem);
    font-weight: 600;
    margin: 1.25rem 0 1rem;
    color: var(--text-main);
  }

  /* h3 = subheading-h3 */
  h3 {
    font-family: var(--font-secondary);
    font-size: clamp(1.5rem, 1.667vw, 2rem);
    line-height: clamp(2rem, 2.5vw, 3rem);
    font-weight: 500;
    margin: 1rem 0 0.75rem;
    color: var(--text-main);
  }

  /* h4 = title-h4 */
  h4 {
    font-family: var(--font-secondary);
    font-size: clamp(1.25rem, 1.25vw, 1.5rem);
    line-height: clamp(1.75rem, 1.667vw, 2rem);
    font-weight: 500;
    margin: 0.75rem 0 0.5rem;
    color: var(--text-main);
  }

  /* p = body-small */
  p {
    font-family: var(--font-secondary);
 font-size: clamp(1.25rem, 1.25vw, 1.5rem);
    line-height: clamp(1.75rem, 1.667vw, 2rem);
    margin: 0 0 1rem;
    color: var(--text-main);
  }

  /* list items = body-small */
  li {
    font-family: var(--font-secondary);
    font-size: clamp(0.75rem, 0.833vw, 0.875rem);
    line-height: clamp(1.25rem, 1.5vw, 1.5rem);
    margin: 0.25rem 0;
    color: var(--text-main);
  }

  blockquote {
    border-left: 4px solid var(--accent-main);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--text-secondary);
    font-style: italic;
    font-family: var(--font-secondary);
  }

  a {
    color: var(--primary-main);
    text-decoration: underline;
  }
`,

        
        // Prevent auto-clearing
        forced_root_block: 'p',
        remove_trailing_brs: false,
        
        // Better paste handling
        paste_as_text: false,
        paste_data_images: true,
        
        // Improve stability
        branding: false,
        promotion: false,
        
        // Better typing experience
        browser_spellcheck: true,
        contextmenu: false,
      }}
    />
  );
}