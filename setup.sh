export default function App() {
  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col">
      
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-gray-800">
        <span className="text-sm text-gray-400">PACT Notebook</span>
        <span className="ml-2 font-semibold">notebook-1</span>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel */}
        <div className="w-64 border-r border-gray-800 p-2">
          <div className="text-xs text-gray-500 mb-2">PROMPTS</div>

          <div className="space-y-1">
            <div className="p-2 rounded bg-gray-800 cursor-pointer">
              prompt-01
            </div>
            <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
              prompt-02
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="text-xs text-gray-500 mb-2">ACTIVE CELL</div>

          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="mb-2 text-gray-400 text-sm">Prompt</div>
            <div className="mb-4">Explain PACT architecture</div>

            <div className="mb-2 text-gray-400 text-sm">Response</div>
            <div className="text-gray-300">
              PACT transforms conversations into deterministic execution units...
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Control Panel */}
      <div className="h-14 border-t border-gray-800 flex items-center px-4 justify-between">
        <div className="text-sm text-gray-400">Cell 1 / 2</div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">
            ←
          </button>
          <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">
            →
          </button>
          <button className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-500">
            Run
          </button>
        </div>
      </div>

    </div>
  );
}