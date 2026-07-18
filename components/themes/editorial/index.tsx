"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { type FileId, getFile } from "./file-registry";
import { type ViewMode, TitleBar, TabStrip, StatusBar } from "./chrome";
import { Explorer } from "./explorer";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";

// --- SSR-safe narrow-viewport hook ---
//
// useSyncExternalStore keeps hydration safe: the server snapshot is always
// `false`, so the first client render matches the server HTML, and React then
// switches to the live matchMedia value after hydration — no mismatch warning,
// and no setState-in-effect.

const NARROW_QUERY = "(max-width: 819px)";

function subscribeNarrow(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getNarrowSnapshot(): boolean {
  return window.matchMedia(NARROW_QUERY).matches;
}

function useIsNarrow(): boolean {
  return useSyncExternalStore(subscribeNarrow, getNarrowSnapshot, () => false);
}

// --- neighbor pick for tab close ---

function neighborOf(id: FileId, tabs: readonly FileId[]): FileId | undefined {
  const idx = tabs.indexOf(id);
  if (idx < 0) return undefined;
  return tabs[idx + 1] ?? tabs[idx - 1];
}

// --- main component ---

export default function EditorialPortfolio() {
  const [active, setActive] = useState<FileId>("README.md");
  const [openTabs, setOpenTabs] = useState<FileId[]>(["README.md"]);
  const [view, setView] = useState<ViewMode>("split");
  const [explorerOpen, setExplorerOpen] = useState(false);

  const isNarrow = useIsNarrow();

  const open = useCallback((id: FileId) => {
    setActive(id);
    setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
    // On mobile, close the drawer after selecting a file
    setExplorerOpen(false);
  }, []);

  const close = useCallback(
    (id: FileId) => {
      const neighbor = neighborOf(id, openTabs);
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t !== id);
        return next.length === 0 ? ["README.md"] : next;
      });
      setActive((cur) => (cur === id ? (neighbor ?? "README.md") : cur));
    },
    [openTabs],
  );

  // On narrow viewports, split is not allowed — treat it as "code"
  const effectiveView: ViewMode =
    isNarrow && view === "split" ? "code" : view;

  const file = getFile(active);

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Title bar */}
      <TitleBar label={file.label} />

      {/* Tab strip + view-mode toggle */}
      {isNarrow ? (
        // Mobile: explorer toggle + tabs + code/preview switch
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            background: "var(--panel)",
            borderBottom: "1px solid var(--line)",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            aria-label={explorerOpen ? "Close file explorer" : "Open file explorer"}
            onClick={() => setExplorerOpen((v) => !v)}
            style={{
              padding: "8px 12px",
              background: "transparent",
              border: "none",
              borderRight: "1px solid var(--line)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: "var(--dim)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ☰
          </button>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <TabStrip
              tabs={openTabs}
              active={active}
              onSelect={open}
              onClose={close}
              view={effectiveView === "split" ? "code" : effectiveView}
              onView={(v) => {
                // On mobile only code/preview are valid
                if (v === "split") return;
                setView(v);
              }}
            />
          </div>
        </div>
      ) : (
        <TabStrip
          tabs={openTabs}
          active={active}
          onSelect={open}
          onClose={close}
          view={view}
          onView={setView}
        />
      )}

      {/* Body row: explorer + main area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Explorer: sidebar on desktop, overlay drawer on mobile */}
        {isNarrow ? (
          explorerOpen && (
            <>
              {/* backdrop */}
              <div
                aria-hidden
                onClick={() => setExplorerOpen(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 10,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 220,
                  zIndex: 11,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Explorer active={active} onOpen={open} />
              </div>
            </>
          )
        ) : (
          <div
            style={{
              width: 220,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Explorer active={active} onOpen={open} />
          </div>
        )}

        {/* Main pane area */}
        <main
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {effectiveView === "split" && (
            <>
              <div
                style={{
                  width: "50%",
                  minWidth: 0,
                  overflow: "auto",
                  borderRight: "1px solid var(--line)",
                }}
              >
                <EditorPane source={file.source} lang={file.lang} />
              </div>
              <div style={{ width: "50%", minWidth: 0, overflow: "auto" }}>
                <PreviewPane file={file} onOpen={open} />
              </div>
            </>
          )}
          {effectiveView === "code" && (
            <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
              <EditorPane source={file.source} lang={file.lang} />
            </div>
          )}
          {effectiveView === "preview" && (
            <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
              <PreviewPane file={file} onOpen={open} />
            </div>
          )}
        </main>
      </div>

      {/* Status bar */}
      <StatusBar label={file.label} />
    </div>
  );
}
