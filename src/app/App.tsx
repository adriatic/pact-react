import { useState } from "react";

const ALL_MODELS = ["GPT", "Claude", "Gemini"];

type ModelResult = {
  model: string;
  response: string;
};

type RunRecord = {
  runId: number;
  compiledPrompt: string;
  results: ModelResult[];
};

type Cell = {
  id: string;
  prompt: string;
  compiledPrompt?: string;
  response: string;
  history: RunRecord[];
  status: "idle" | "running";
  runId?: number;

  mode: "single" | "compare";
  selectedModel: string;
  compareModels: string[];
};

export default function App() {
  const [cells, setCells] = useState<Cell[]>([
    {
      id: "prompt-01",
      prompt: "Explain PACT architecture",
      compiledPrompt: "",
      response: "",
      history: [],
      status: "idle",
      mode: "single",
      selectedModel: "GPT",
      compareModels: ["GPT", "Claude"],
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showInternal, setShowInternal] = useState(false);
  const [runCounter, setRunCounter] = useState(1);
  const [expandedRunId, setExpandedRunId] = useState<number | null>(null);

  const activeCell = cells[activeIndex];

  // 🔥 Create cell
  const createCell = () => {
    const newCell: Cell = {
      id: `prompt-${String(cells.length + 1).padStart(2, "0")}`,
      prompt: "",
      compiledPrompt: "",
      response: "",
      history: [],
      status: "idle",
      mode: "single",
      selectedModel: "GPT",
      compareModels: ["GPT", "Claude"],
    };

    setCells((prev) => [...prev, newCell]);
    setActiveIndex(cells.length);
  };

  const setMode = (mode: "single" | "compare") => {
    setCells((prev) =>
      prev.map((c, i) =>
        i === activeIndex ? { ...c, mode } : c
      )
    );
  };

  const selectModel = (model: string) => {
    setCells((prev) =>
      prev.map((c, i) =>
        i === activeIndex ? { ...c, selectedModel: model } : c
      )
    );
  };

  const toggleCompareModel = (model: string) => {
    setCells((prev) =>
      prev.map((c, i) => {
        if (i !== activeIndex) return c;

        const exists = c.compareModels.includes(model);

        return {
          ...c,
          compareModels: exists
            ? c.compareModels.filter((m) => m !== model)
            : [...c.compareModels, model],
        };
      })
    );
  };

  const runCell = () => {
    const runId = runCounter;
    setRunCounter((r) => r + 1);

    setCells((prev) =>
      prev.map((c, i) =>
        i === activeIndex ? { ...c, status: "running", runId } : c
      )
    );

    setTimeout(() => {
      setCells((prev) =>
        prev.map((c, i) => {
          if (i !== activeIndex) return c;

          const models =
            c.mode === "single"
              ? [c.selectedModel]
              : c.compareModels;

          const results: ModelResult[] = models.map((m) => ({
            model: m,
            response: `${m} explanation:\nPACT is a structured execution model.\nIt ensures deterministic behavior.`,
          }));

          return {
            ...c,
            status: "idle",
            response: results[0]?.response || "",
            history: [
              ...c.history,
              {
                runId,
                compiledPrompt: "",
                results,
              },
            ],
          };
        })
      );
    }, 800);
  };

  // 🔥 Diff helper
  const computeDiff = (results: ModelResult[]) => {
    const linesPerModel = results.map((r) =>
      r.response.split("\n")
    );

    const maxLines = Math.max(...linesPerModel.map((l) => l.length));

    const rows = [];

    for (let i = 0; i < maxLines; i++) {
      const row = linesPerModel.map((lines) => lines[i] || "");

      const allEqual = row.every((v) => v === row[0]);

      rows.push({ row, allEqual });
    }

    return rows;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* HEADER */}
      <div className="h-12 flex items-center px-4 border-b border-gray-800 justify-between">
        <div>PACT Notebook</div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowInternal((v) => !v)}
            className="px-3 py-1 bg-purple-600 rounded text-sm"
          >
            {showInternal ? "Internal" : "External"}
          </button>

          <button
            onClick={createCell}
            className="px-3 py-1 bg-green-600 rounded text-sm"
          >
            + New Prompt
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-64 border-r border-gray-800 p-2">
          {cells.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setActiveIndex(i)}
              className={`p-2 ${i === activeIndex ? "bg-gray-800" : ""}`}
            >
              {c.id}
            </div>
          ))}
        </div>

        {/* CENTER */}
        <div className="flex-1 p-4">

          <div className="bg-gray-900 p-4 rounded">

            {/* MODE */}
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setMode("single")}
                className={activeCell.mode === "single" ? "bg-blue-600 px-2" : "bg-gray-800 px-2"}
              >
                Single
              </button>
              <button
                onClick={() => setMode("compare")}
                className={activeCell.mode === "compare" ? "bg-blue-600 px-2" : "bg-gray-800 px-2"}
              >
                Compare
              </button>
            </div>

            {/* MODELS */}
            {activeCell.mode === "single" && (
              <div className="mb-3 flex gap-2">
                {ALL_MODELS.map((m) => (
                  <button
                    key={m}
                    onClick={() => selectModel(m)}
                    className={activeCell.selectedModel === m ? "bg-blue-600 px-2" : "bg-gray-800 px-2"}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {activeCell.mode === "compare" && (
              <div className="mb-3 flex gap-2">
                {ALL_MODELS.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleCompareModel(m)}
                    className={activeCell.compareModels.includes(m) ? "bg-green-600 px-2" : "bg-gray-800 px-2"}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {/* PROMPT */}
            <div className="mb-4">{activeCell.prompt}</div>

            {/* HISTORY */}
            {activeCell.history.map((run) => {
              const expanded = expandedRunId === run.runId;

              return (
                <div key={run.runId} className="mb-4">

                  <div
                    onClick={() =>
                      setExpandedRunId(expanded ? null : run.runId)
                    }
                    className="cursor-pointer text-gray-400"
                  >
                    Run {run.runId} →
                  </div>

                  {expanded && (
                    <div className="mt-2">

                      {/* HEADERS */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {run.results.map((r) => (
                          <div key={r.model} className="text-blue-400 text-sm">
                            {r.model}
                          </div>
                        ))}
                      </div>

                      {/* DIFF TABLE */}
                      {computeDiff(run.results).map((row, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-2">
                          {row.row.map((cell, i) => (
                            <div
                              key={i}
                              className={`p-1 text-sm ${
                                row.allEqual
                                  ? "text-gray-500"
                                  : "text-red-300"
                              }`}
                            >
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="h-14 border-t border-gray-800 flex items-center px-4 justify-end">
        <button
          onClick={runCell}
          className="px-4 py-1 bg-blue-600 rounded"
        >
          Run
        </button>
      </div>

    </div>
  );
}