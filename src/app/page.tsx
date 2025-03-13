"use client";
import { useState, useEffect } from "react";
import JsonViewer from "./components/JsonViewer";
import { MoonIcon, SunIcon, Maximize2Icon, Minimize2Icon } from "lucide-react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [parsedJson, setParsedJson] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fullHeight, setFullHeight] = useState<boolean>(false);

  // Initialize theme based on user's system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);

      // Apply theme
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleFullHeight = () => {
    setFullHeight(!fullHeight);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const parseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setError(null);
    } catch (_error) {
      setError("Invalid JSON");
      setParsedJson(null);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col items-center p-4 md:p-8">
        {/* Header with theme toggle and full height toggle */}
        <div className="w-full max-w-6xl flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JSON Viewer
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullHeight}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle height"
            >
              {fullHeight ? (
                <Minimize2Icon className="h-5 w-5" />
              ) : (
                <Maximize2Icon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
          {/* JSON Input Field */}
          <div className="flex-1 flex flex-col p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-2">JSON Input</h2>
            <textarea
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors ${fullHeight ? 'h-[calc(100vh-240px)]' : 'h-96'}`}
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={handleJsonChange}
            />
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={parseJson}
                className="py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Parse JSON
              </button>
              {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            </div>
          </div>

          {/* JSON Output Field */}
          <div className={`flex-1 flex flex-col p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 ${fullHeight ? 'h-[calc(100vh-180px)]' : ''}`}>
            <h2 className="text-lg font-medium mb-2">JSON Output</h2>
            <div className={`overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 ${fullHeight ? 'flex-grow' : 'max-h-96'}`}>
              {parsedJson !== null ? (
                <JsonViewer data={parsedJson} darkMode={darkMode} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Valid JSON will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
