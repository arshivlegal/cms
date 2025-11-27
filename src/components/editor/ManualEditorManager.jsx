"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import ManualEditorBox from "./ManualEditorBox";
import { Plus } from "lucide-react";

// Generate unique IDs
let nextId = 0;
const generateId = () => `editor-${Date.now()}-${nextId++}`;

export default function ManualEditorManager({ value, onChange }) {
  const [boxes, setBoxes] = useState(() => {
    if (value && value.length > 0) {
      return value.map((box, i) => ({
        id: box.id || generateId(),
        content: box.content || "<p><br /></p>",
      }));
    }
    return [{ id: generateId(), content: "<p><br /></p>" }];
  });

  const [active, setActive] = useState(null);
  const syncTimer = useRef(null);
  const isInitialMount = useRef(true);

  // Sync to parent when boxes change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      onChange(boxes.map(b => ({ content: b.content })));
    }, 200);
    
    return () => clearTimeout(syncTimer.current);
  }, [boxes, onChange]);

  const update = (id, html) => {
    setBoxes((prev) => 
      prev.map((box) => 
        box.id === id ? { ...box, content: html } : box
      )
    );
  };

  const addBox = () => {
    const newBox = { id: generateId(), content: "<p><br /></p>" };
    setBoxes((prev) => [...prev, newBox]);
    // Auto-focus new box
    setTimeout(() => setActive(boxes.length), 100);
  };

  const deleteBox = (id) => {
    setBoxes((prev) => {
      if (prev.length === 1) {
        return [{ id: generateId(), content: "<p><br /></p>" }];
      }
      return prev.filter((box) => box.id !== id);
    });
    setActive(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setBoxes((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index) => {
    if (index >= boxes.length - 1) return;
    setBoxes((prev) => {
      const arr = [...prev];
      [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      return arr;
    });
  };

  return (
    <div className="flex flex-col gap-s16">
      {boxes.map((box, i) => (
        <ManualEditorBox
          key={box.id}
          id={box.id}
          active={active}
          setActive={setActive}
          value={box.content}
          onChange={(html) => update(box.id, html)}
          onDelete={() => deleteBox(box.id)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          isFirst={i === 0}
          isLast={i === boxes.length - 1}
        />
      ))}

      <button 
        type="button" 
        onClick={addBox}
        className="
          inline-flex items-center justify-center gap-s8
          px-s16 py-s12 
          bg-primary-main text-background
          hover:bg-primary-light
          rounded-r8
          font-secondary font-medium text-sm
          transition-all duration-200
          border-2 border-transparent hover:border-primary-light
        "
      >
        <Plus size={18} />
        <span>Add Section</span>
      </button>
    </div>
  );
}