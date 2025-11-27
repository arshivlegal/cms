"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ChevronUp, Trash2, ChevronDown, Undo, Redo, X, MoreVertical } from "lucide-react";

// Store selection range per block with unique IDs
const selectionStore = new Map();

export default function ManualEditorBox({
  id,
  active,
  setActive,
  value,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const toolbarRef = useRef(null);
  const saveTimerRef = useRef(null);
  const lastContentRef = useRef(value ?? "<p><br/></p>");
  const isMountedRef = useRef(true);

  const [activeStyles, setActiveStyles] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize content only once
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      const initialValue = value ?? "<p><br/></p>";
      editorRef.current.innerHTML = initialValue;
      lastContentRef.current = initialValue;
    }
  }, []);

  // Update only when value changes externally
  useEffect(() => {
    if (editorRef.current && value !== lastContentRef.current && value !== undefined) {
      editorRef.current.innerHTML = value;
      lastContentRef.current = value;
    }
  }, [value]);

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      selectionStore.delete(id);
    };
  }, [id]);

  /* SAVE SELECTION */
  const saveSelection = useCallback(() => {
    try {
      const sel = window.getSelection();
      if (sel?.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
        selectionStore.set(id, sel.getRangeAt(0).cloneRange());
      }
    } catch {}
  }, [id]);

  /* RESTORE SELECTION */
  const restoreSelection = useCallback(() => {
    const range = selectionStore.get(id);
    if (!range) return false;
    
    try {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range.cloneRange());
      return true;
    } catch (e) {
      return false;
    }
  }, [id]);

  /* GET ALIGNMENT */
  const getAlignment = useCallback(() => {
    try {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode) return 'left';
      
      let element = sel.anchorNode.nodeType === 3 
        ? sel.anchorNode.parentElement 
        : sel.anchorNode;

      while (element && element !== editorRef.current) {
        const align = window.getComputedStyle(element).textAlign;
        if (align) return align;
        element = element.parentElement;
      }
      return 'left';
    } catch {
      return 'left';
    }
  }, []);

  /* CHECK ACTIVE STYLES */
  const checkActiveStyles = useCallback(() => {
    if (!isMountedRef.current) return;
    
    try {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode) return;

      let element = sel.anchorNode.nodeType === 3 
        ? sel.anchorNode.parentElement 
        : sel.anchorNode;

      let tag = 'P';
      while (element && element !== editorRef.current) {
        const elTag = element.tagName;
        if (['H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'P', 'DIV', 'LI'].includes(elTag)) {
          tag = elTag;
          break;
        }
        element = element.parentElement;
      }

      const align = getAlignment();

      const newStyles = {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikethrough: document.queryCommandState("strikeThrough"),
        subscript: document.queryCommandState("subscript"),
        superscript: document.queryCommandState("superscript"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
        h1: tag === "H1",
        h2: tag === "H2",
        h3: tag === "H3",
        h4: tag === "H4",
        quote: tag === "BLOCKQUOTE",
        p: tag === "P",
        alignLeft: align === 'left' || align === 'start',
        alignCenter: align === 'center',
        alignRight: align === 'right' || align === 'end',
        alignJustify: align === 'justify',
      };

      setActiveStyles(prev => {
        const hasChanged = Object.keys(newStyles).some(key => prev[key] !== newStyles[key]);
        return hasChanged ? newStyles : prev;
      });
    } catch {}
  }, [getAlignment]);

  /* APPLY COMMAND WITH TOGGLE */
  const apply = useCallback((cmd, arg = null) => {
    if (!editorRef.current) return;

    // Special handling for link
    if (cmd === "link") {
      if (activeStyles.link || document.queryCommandState("createLink")) {
        restoreSelection();
        editorRef.current.focus();
        try {
          document.execCommand("unlink", false, null);
        } catch (e) {
          console.warn("Unlink failed:", e);
        }
      } else {
        restoreSelection();
        const url = window.prompt("Enter URL:");
        if (!url) {
          editorRef.current.focus();
          return;
        }
        
        restoreSelection();
        editorRef.current.focus();
        
        try {
          document.execCommand("createLink", false, url);
        } catch (e) {
          console.warn("Link creation failed:", e);
        }
      }
      
      setTimeout(() => {
        if (!isMountedRef.current) return;
        const html = editorRef.current?.innerHTML || "";
        if (html !== lastContentRef.current) {
          lastContentRef.current = html;
          onChange(html);
        }
        saveSelection();
        checkActiveStyles();
      }, 50);
      return;
    }

    // For all other commands
    restoreSelection();
    editorRef.current.focus();
    
    try {
      if (cmd === "h1" || cmd === "h2" || cmd === "h3" || cmd === "h4") {
        if (activeStyles[cmd]) {
          document.execCommand("formatBlock", false, "p");
        } else {
          document.execCommand("formatBlock", false, cmd);
        }
      } 
      else if (cmd === "quote") {
        if (activeStyles.quote) {
          document.execCommand("formatBlock", false, "p");
        } else {
          document.execCommand("formatBlock", false, "blockquote");
        }
      } 
      else if (cmd === "p") {
        document.execCommand("formatBlock", false, "p");
      } 
      else if (cmd === "removeFormat") {
        document.execCommand("removeFormat", false, null);
        document.execCommand("formatBlock", false, "p");
      } 
      else if (cmd === "justifyLeft") {
        document.execCommand("justifyLeft", false, null);
      } 
      else if (cmd === "justifyCenter") {
        if (activeStyles.alignCenter) {
          document.execCommand("justifyLeft", false, null);
        } else {
          document.execCommand("justifyCenter", false, null);
        }
      } 
      else if (cmd === "justifyRight") {
        if (activeStyles.alignRight) {
          document.execCommand("justifyLeft", false, null);
        } else {
          document.execCommand("justifyRight", false, null);
        }
      } 
      else if (cmd === "justifyFull") {
        if (activeStyles.alignJustify) {
          document.execCommand("justifyLeft", false, null);
        } else {
          document.execCommand("justifyFull", false, null);
        }
      }
      else if (cmd === "subscript") {
        if (activeStyles.superscript) {
          document.execCommand("superscript", false, null);
        }
        document.execCommand("subscript", false, null);
      }
      else if (cmd === "superscript") {
        if (activeStyles.subscript) {
          document.execCommand("subscript", false, null);
        }
        document.execCommand("superscript", false, null);
      }
      else {
        document.execCommand(cmd, false, arg);
      }

      setTimeout(() => {
        if (!isMountedRef.current) return;
        const html = editorRef.current?.innerHTML || "";
        if (html !== lastContentRef.current) {
          lastContentRef.current = html;
          onChange(html);
        }
        saveSelection();
        checkActiveStyles();
      }, 50);
    } catch (e) {
      console.warn("Command failed:", cmd, e);
    }
  }, [activeStyles, restoreSelection, saveSelection, checkActiveStyles, onChange]);

  /* ON INPUT */
  const handleInput = useCallback(() => {
    if (!isMountedRef.current) return;
    
    saveSelection();
    
    const html = editorRef.current?.innerHTML || "";
    const finalHtml = html.trim() === "" || html === "<br>" ? "<p><br/></p>" : html;
    
    if (finalHtml !== lastContentRef.current) {
      lastContentRef.current = finalHtml;
      
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      
      saveTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        onChange(finalHtml);
        checkActiveStyles();
      }, 300);
    }
  }, [saveSelection, onChange, checkActiveStyles]);

  /* HANDLE SELECTION CHANGES */
  const handleSelectionChange = useCallback(() => {
    if (!isMountedRef.current) return;
    saveSelection();
    checkActiveStyles();
  }, [saveSelection, checkActiveStyles]);

  /* KEYBOARD SHORTCUTS */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!editorRef.current?.contains(document.activeElement)) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          apply('undo');
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          apply('redo');
        } else if (e.key === 'e') {
          e.preventDefault();
          apply('justifyCenter');
        } else if (e.key === 'l') {
          e.preventDefault();
          apply('justifyLeft');
        } else if (e.key === 'r') {
          e.preventDefault();
          apply('justifyRight');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [apply]);

  /* CLOSE TOOLBAR ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      if (active === id) {
        setActive(null);
        setShowMobileToolbar(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setActive, active, id]);

  const styleButtons = useMemo(() => [
    { key: "bold", label: "B", cmd: "bold", title: "Bold", group: "text" },
    { key: "italic", label: "I", cmd: "italic", title: "Italic", group: "text" },
    { key: "underline", label: "U", cmd: "underline", title: "Underline", group: "text" },
    { key: "strikethrough", label: "S", cmd: "strikeThrough", title: "Strikethrough", group: "text" },
    
    { key: "subscript", label: "X₂", cmd: "subscript", title: "Subscript", group: "script" },
    { key: "superscript", label: "X²", cmd: "superscript", title: "Superscript", group: "script" },
    
    { key: "h1", label: "H1", cmd: "h1", title: "Heading 1", group: "heading" },
    { key: "h2", label: "H2", cmd: "h2", title: "Heading 2", group: "heading" },
    { key: "h3", label: "H3", cmd: "h3", title: "Heading 3", group: "heading" },
    { key: "h4", label: "H4", cmd: "h4", title: "Heading 4", group: "heading" },
    
    { key: "p", label: "P", cmd: "p", title: "Paragraph", group: "heading" },
    
    { key: "ul", label: "• List", cmd: "insertUnorderedList", title: "Bullet List", group: "list" },
    { key: "ol", label: "1. List", cmd: "insertOrderedList", title: "Numbered List", group: "list" },
    
    { key: "quote", label: "❝", cmd: "quote", title: "Quote", group: "format" },
    { key: "link", label: "🔗", cmd: "link", title: "Link", group: "format" },
    
    { key: "alignLeft", label: "⬅", cmd: "justifyLeft", title: "Align Left", group: "align" },
    { key: "alignCenter", label: "⬌", cmd: "justifyCenter", title: "Align Center", group: "align" },
    { key: "alignRight", label: "➡", cmd: "justifyRight", title: "Align Right", group: "align" },
    { key: "alignJustify", label: "⬍", cmd: "justifyFull", title: "Justify", group: "align" },
    
    { key: "indent", label: "→", cmd: "indent", title: "Indent", group: "indent" },
    { key: "outdent", label: "←", cmd: "outdent", title: "Outdent", group: "indent" },
    { key: "hr", label: "—", cmd: "insertHorizontalRule", title: "Horizontal Rule", group: "format" },
  ], []);

  const isActive = active === id;

  return (
    <div
      ref={containerRef}
      className={`
        relative rounded-xl overflow-hidden transition-all duration-300
        ${isActive 
          ? 'ring-2 ring-blue-500 shadow-xl bg-white' 
          : 'ring-1 ring-gray-200 hover:ring-gray-300 shadow-sm bg-white hover:shadow-md'
        }
      `}
    >
      {/* DESKTOP TOOLBAR - Right Side */}
      {isActive && !isMobile && (
        <div
          ref={toolbarRef}
          className="absolute top-0 right-0 h-full w-28 border-l border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg z-40 backdrop-blur-sm"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col gap-1.5 p-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
            {styleButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                title={btn.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  apply(btn.cmd);
                }}
                className={`
                  w-full h-9 rounded-lg text-xs font-semibold transition-all duration-200
                  flex items-center justify-center flex-shrink-0
                  ${activeStyles[btn.key]
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE TOOLBAR - Bottom Overlay */}
      {isActive && isMobile && showMobileToolbar && (
        <div className="fixed inset-x-0 bottom-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-4 gap-2 p-3">
            {styleButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                title={btn.title}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  apply(btn.cmd);
                }}
                className={`
                  h-12 rounded-lg text-xs font-semibold transition-all
                  flex items-center justify-center
                  ${activeStyles[btn.key]
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                  }
                `}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowMobileToolbar(false)}
            className="w-full py-3 bg-gray-800 text-white font-medium"
          >
            Close Toolbar
          </button>
        </div>
      )}

      {/* EDITOR */}
      <div className={`
        p-4 md:p-6 transition-all duration-200 
        ${isActive && !isMobile ? 'pr-32' : ''}
      `}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Start writing something amazing..."
          className="
            min-h-[200px] outline-none max-w-none focus:outline-none
            prose prose-sm md:prose-base max-w-none
            [&_h1]:text-3xl md:[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:my-4 [&_h1]:text-gray-900
            [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-gray-900
            [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:my-2.5 [&_h3]:text-gray-900
            [&_h4]:text-lg md:[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:my-2 [&_h4]:text-gray-800
            [&_p]:text-base [&_p]:leading-relaxed [&_p]:my-2 [&_p]:text-gray-700
            [&_strong]:font-bold [&_strong]:text-gray-900
            [&_em]:italic
            [&_u]:underline
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
            [&_li]:my-1.5 [&_li]:text-gray-700
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:bg-blue-50 [&_blockquote]:py-2 [&_blockquote]:rounded-r
            [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a]:hover:text-blue-700
            [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-gray-300 [&_hr]:my-8
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none
          "
          onClick={(e) => {
            e.stopPropagation();
            setActive(id);
            handleSelectionChange();
          }}
          onKeyUp={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          onInput={handleInput}
          onFocus={() => {
            setActive(id);
            handleSelectionChange();
          }}
          onBlur={(e) => {
            saveSelection();
            if (!editorRef.current?.innerHTML.trim() || editorRef.current?.innerHTML === '<br>') {
              editorRef.current.innerHTML = "<p><br/></p>";
              lastContentRef.current = "<p><br/></p>";
            }
          }}
        />
      </div>

      {/* CONTROL BUTTONS - Bottom Left */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-50">
        {isMobile && isActive && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              setShowMobileToolbar(!showMobileToolbar);
            }}
            title="Toggle Toolbar"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md"
          >
            <MoreVertical size={18} />
          </button>
        )}
        
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            apply('undo');
          }}
          title="Undo (Ctrl+Z)"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all border border-gray-300"
        >
          <Undo size={16} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            apply('redo');
          }}
          title="Redo (Ctrl+Y)"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all border border-gray-300"
        >
          <Redo size={16} />
        </button>

        <button
          type="button"
          disabled={isFirst}
          onClick={onMoveUp}
          title="Move Up"
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all border ${
            isFirst
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
          }`}
        >
          <ChevronUp size={16} />
        </button>

        <button
          type="button"
          disabled={isLast}
          onClick={onMoveDown}
          title="Move Down"
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all border ${
            isLast
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
          }`}
        >
          <ChevronDown size={16} />
        </button>

        <button
          type="button"
          onClick={onDelete}
          title="Delete Block"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
        >
          <Trash2 size={16} />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            apply('removeFormat');
          }}
          title="Clear Formatting"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}