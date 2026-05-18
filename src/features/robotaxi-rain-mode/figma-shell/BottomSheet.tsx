"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { SheetContext } from "./SheetContext";
import { useSheetHeight } from "./SheetHeightContext";

type BottomSheetProps = {
  children: ReactNode;
};

export function BottomSheet({ children }: BottomSheetProps) {
  const { heightPct, setHeightPct, heightRef, snaps, snapTo, screenKey } =
    useSheetHeight();
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({
    active: false,
    startY: 0,
    startPct: heightPct,
    mode: "none" as "none" | "sheet" | "scroll",
  });
  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const getScreenHeight = useCallback(() => {
    return sheetRef.current?.parentElement?.clientHeight ?? 1;
  }, []);

  const expand = useCallback(() => snapTo("expanded"), [snapTo]);
  const collapse = useCallback(() => snapTo("collapsed"), [snapTo]);
  const isExpanded =
    heightPct >= (snaps.collapsed + snaps.expanded) / 2;

  /** Shrink sheet when content is shorter than expanded snap (avoids blank area below CTA) */
  const fitSheetToContent = useCallback(() => {
    const sheet = sheetRef.current;
    const body = bodyRef.current;
    if (!sheet || !body) return;

    const stageH = getScreenHeight();
    if (stageH <= 0) return;

    const dragH =
      sheet.querySelector(".figma-sheet-drag-zone")?.getBoundingClientRect()
        .height ?? 42;
    const safeH = 8;
    const neededPct = (dragH + safeH + body.scrollHeight + 2) / stageH;
    const pct = Math.min(snaps.expanded, Math.max(snaps.collapsed, neededPct));

    heightRef.current = pct;
    setHeightPct(pct);
  }, [getScreenHeight, heightRef, setHeightPct, snaps]);

  const applyDrag = useCallback(
    (clientY: number) => {
      if (!dragRef.current.active) return;
      const screenH = getScreenHeight();
      const deltaY = dragRef.current.startY - clientY;
      const next = dragRef.current.startPct + deltaY / screenH;
      const min = snaps.collapsed - 0.03;
      const max = snaps.expanded + 0.02;
      const clamped = Math.min(max, Math.max(min, next));
      heightRef.current = clamped;
      setHeightPct(clamped);
    },
    [getScreenHeight, heightRef, setHeightPct, snaps.collapsed, snaps.expanded],
  );

  const endDrag = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    dragRef.current.mode = "none";
    setDragging(false);
    const mid = (snaps.collapsed + snaps.expanded) / 2;
    snapTo(heightRef.current >= mid ? "expanded" : "collapsed");
    requestAnimationFrame(fitSheetToContent);
  }, [snapTo, snaps.collapsed, snaps.expanded, heightRef, fitSheetToContent]);

  const startSheetDrag = useCallback(
    (clientY: number) => {
      setDragging(true);
      dragRef.current = {
        active: true,
        startY: clientY,
        startPct: heightRef.current,
        mode: "sheet",
      };
    },
    [heightRef],
  );

  const onZonePointerDown = (e: PointerEvent) => {
    e.preventDefault();
    startSheetDrag(e.clientY);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onZonePointerMove = (e: PointerEvent) => {
    if (dragRef.current.mode !== "sheet") return;
    e.preventDefault();
    applyDrag(e.clientY);
  };

  const onZonePointerUp = (e: PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    endDrag();
  };

  const isSheetDragTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return !target.closest(
      "button, a, input, textarea, select, label, .figma-pickup-row, .figma-field",
    );
  };

  const onBodyPointerDown = (e: PointerEvent) => {
    if (!bodyRef.current) return;
    const allowSheetDrag = isSheetDragTarget(e.target);
    dragRef.current = {
      active: false,
      startY: e.clientY,
      startPct: heightRef.current,
      mode: allowSheetDrag ? "none" : "scroll",
    };
  };

  const onBodyPointerMove = (e: PointerEvent) => {
    const body = bodyRef.current;
    if (!body) return;

    if (dragRef.current.mode === "sheet") {
      e.preventDefault();
      applyDrag(e.clientY);
      return;
    }

    if (dragRef.current.mode === "scroll") return;

    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dy) <= 8) return;

    const atTop = body.scrollTop <= 1;
    const collapsed = heightRef.current <= snaps.collapsed + 0.02;

    if (collapsed && dy < -10) {
      dragRef.current.mode = "sheet";
      dragRef.current.active = true;
      setDragging(true);
      body.setPointerCapture(e.pointerId);
      e.preventDefault();
      applyDrag(e.clientY);
      return;
    }

    if (isExpanded && atTop && dy > 0) {
      dragRef.current.mode = "sheet";
      dragRef.current.active = true;
      setDragging(true);
      body.setPointerCapture(e.pointerId);
      e.preventDefault();
      applyDrag(e.clientY);
      return;
    }

    dragRef.current.mode = "scroll";
  };

  const onBodyPointerUp = (e: PointerEvent) => {
    const body = bodyRef.current;
    if (dragRef.current.mode === "sheet") {
      body?.releasePointerCapture(e.pointerId);
      endDrag();
    }
    dragRef.current.mode = "none";
  };

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(fitSheetToContent);
  }, [screenKey, fitSheetToContent]);

  return (
    <SheetContext.Provider value={{ expand, collapse, isExpanded, fitToContent: fitSheetToContent }}>
      <div
        ref={sheetRef}
        className="figma-bottom-sheet"
        style={{
          ["--sheet-height" as string]: `${heightPct * 100}%`,
          height: `${heightPct * 100}%`,
          minHeight: `${heightPct * 100}%`,
          transition: dragging ? "none" : undefined,
        }}
        data-expanded={isExpanded ? "true" : "false"}
      >
        <div
          className="figma-sheet-drag-zone"
          onPointerDown={onZonePointerDown}
          onPointerMove={onZonePointerMove}
          onPointerUp={onZonePointerUp}
          onPointerCancel={onZonePointerUp}
        >
          <button type="button" className="figma-sheet-handle" tabIndex={-1}>
            <span className="figma-sheet-handle-bar" aria-hidden />
          </button>
        </div>
        <div
          ref={bodyRef}
          className="figma-sheet-body"
          onPointerDown={onBodyPointerDown}
          onPointerMove={onBodyPointerMove}
          onPointerUp={onBodyPointerUp}
          onPointerCancel={onBodyPointerUp}
        >
          {children}
        </div>
        <div className="figma-sheet-safe" aria-hidden />
      </div>
    </SheetContext.Provider>
  );
}
