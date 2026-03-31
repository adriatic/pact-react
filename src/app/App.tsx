import { useState } from "react";

type RunRecord = {
  runId: number;
  version: number;
  response: string;
};

type Cell = {
  id: string;
  prompt: string;
  version: number;
  history: RunRecord[];
};

export default function App() {
  const [cells, setCells] = useState<Cell[]>([
    {
      id: "prompt-01",
      prompt: "Explain PACT architecture",
      version: 0,
      history: [],
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(true);
  const [showRaw, setShowRaw] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [selectedRuns, setSelectedRuns] = useState<number[]>([]);

  const activeCell = cells[activeIndex];

  const newPrompt = () => {
    const newCell: Cell = {
      id: `prompt-${String(cells.length + 1).padStart(2, "0")}`,
      prompt: "",
      version: 0,
      history: [],
    };

    setCells((prev) => [...prev, newCell]);
    setActiveIndex(cells.length);
    setIsEditing(true);
    setShowRaw(false);
    setSelectedRuns([]);
  };

  const editPrompt = () => {
    if (showRaw) {
      alert("Switching to Normal view to edit");
      setShowRaw(false);
    }
    setIsEditing(true);
  };

  const toggleView = () => {
    setShowRaw((v) => !v);
  };

  const runCell = () => {
    const runId = Date.now();

    setCells((prev) =>
      prev.map((c, i) => {
        if (i !== activeIndex) return c;

        const newVersion = c.version + 1;

        let response = "";

        if (newVersion === 1) {
          response = `PACT (Prompt-Aware Computational Tooling) is an architectural paradigm that transforms conversational AI into deterministic execution units.

Each prompt becomes a reproducible computational step, similar to a notebook cell. This enables traceability, versioning, and structured interaction.

PACT introduces a notebook-based interaction model where prompts are versioned, executed, and compared. Each execution produces a run with a unique identifier, allowing users to inspect and reproduce results.

The architecture enforces separation between draft and executed prompts, ensuring that executed states remain immutable. This guarantees reproducibility.

PACT also introduces deterministic traceability, allowing users to audit how outputs were generated.

Overall, PACT replaces informal chat with structured computation.`;
        } else if (newVersion === 2) {
          response = `PACT (Prompt-Aware Computational Tooling) is a structured execution framework that transforms AI interaction into a reproducible computational workflow.

Key Features:

1. Prompt as Execution Unit  
Each prompt is a runnable entity producing versioned outputs.

2. Versioned Execution  
Each run increments a version (v1, v2...), enabling comparison.

3. Run IDs  
Every execution is uniquely identified.

4. Draft vs Executed Separation  
Editable prompts are distinct from executed snapshots.

5. Built-in Comparison  
Users can compare outputs across versions to understand prompt impact.

6. Multi-model Readiness  
Designed for GPT, Claude, Gemini comparison.

7. Structured Representation  
Separates system instructions from user prompts.

PACT turns prompt engineering into a disciplined, inspectable process.`;
        } else {
          response = `Executed (v${newVersion}): ${c.prompt}`;
        }

        return {
          ...c,
          version: newVersion,
          history: [
            ...c.history,
            {
              runId,
              version: newVersion,
              response,
            },
          ],
        };
      })
    );

    setIsEditing(false);
    setShowRaw(false);
    setSelectedRuns([]);
  };

  const toggleRunSelection = (runId: number) => {
    setSelectedRuns((prev) =>
      prev.includes(runId)
        ? prev.filter((id) => id !== runId)
        : [...prev, runId]
    );
  };

  const compareSelected = () => {
    if (selectedRuns.length < 2) {
      alert("Select at least two runs to compare");
      return;
    }

    alert(`Comparing runs: ${selectedRuns.join(", ")}`);
  };

  const Menu = ({ name, children }: any) => (
    <div className="relative">
      <div
        onClick={() =>
          setMenuOpen(menuOpen === name ? null : name)
        }
        className="cursor-pointer hover:bg-gray-800 px-2 rounded"
      >
        {name}
      </div>

      {menuOpen === name && (
        <div className="absolute top-6 left-0 bg-gray-900 border border-gray-700 rounded shadow z-50 min-w-[180px]">
          {children}
        </div>
      )}
    </div>
  );

  const MenuItem = ({ onClick, children }: any) => (
    <div
      onClick={() => {
        onClick();
        setMenuOpen(null);
      }}
      className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* MENU */}
      <div className="h-10 flex items-center px-4 border-b border-gray-800 gap-6 text-sm">
        <Menu name="File"><MenuItem onClick={newPrompt}>New Prompt</MenuItem></Menu>
        <Menu name="Edit"><MenuItem onClick={editPrompt}>Edit Prompt</MenuItem></Menu>
        <Menu name="Run"><MenuItem onClick={runCell}>Execute</MenuItem></Menu>
        <Menu name="Compare"><MenuItem onClick={compareSelected}>Compare Selected</MenuItem></Menu>
        <Menu name="View"><MenuItem onClick={toggleView}>Toggle Normal / Raw</MenuItem></Menu>
      </div>

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-64 border-r border-gray-800 p-2">
          {cells.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setActiveIndex(i)}
              className={`p-2 cursor-pointer ${
                i === activeIndex ? "bg-gray-800" : ""
              }`}
            >
              {c.id}
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-6">

          <div className="text-sm text-gray-400 mb-2">
            {isEditing
              ? `Draft (next run → v${activeCell.version + 1})`
              : `Executed Prompt (v${activeCell.version})`}
          </div>

          {showRaw ? (
            <div className="text-purple-300 whitespace-pre-wrap">
              {activeCell.history.length
                ? activeCell.history.at(-1)?.response
                : "Run this prompt to see its raw view"}
            </div>
          ) : isEditing ? (
            <textarea
              value={activeCell.prompt}
              onChange={(e) =>
                setCells((prev) =>
                  prev.map((c, i) =>
                    i === activeIndex
                      ? { ...c, prompt: e.target.value }
                      : c
                  )
                )
              }
              className="w-full h-24 bg-gray-900 border border-gray-700 rounded p-2 mb-4"
            />
          ) : (
            <div className="mb-4 bg-gray-900/40 p-2 rounded">
              {activeCell.prompt}
            </div>
          )}

          {/* 🔥 STRONG VISUAL CARDS */}
          {activeCell.history.map((run, i) => (
            <div
              key={run.runId}
              className={`
                mb-4 rounded-lg flex gap-3
                border border-gray-600
                bg-gray-900
                shadow-md
                ${
                  selectedRuns.includes(run.runId)
                    ? "ring-2 ring-blue-500"
                    : "hover:ring-1 hover:ring-blue-500/40"
                }
                transition
              `}
            >
              {/* LEFT ACCENT BAR */}
              <div className="w-1 bg-blue-500 rounded-l-lg" />

              <div className="p-3 flex gap-3 w-full">
                <input
                  type="checkbox"
                  checked={selectedRuns.includes(run.runId)}
                  onChange={() => toggleRunSelection(run.runId)}
                />

                <div>
                  <div className="text-xs text-gray-400 mb-1">
                    Run #{i + 1} → v{run.version}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {run.response}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}