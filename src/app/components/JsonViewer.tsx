// components/JsonViewer.tsx
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface JsonViewerProps {
  data: unknown;
  darkMode?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, darkMode = false }) => {
  return (
    <div className="font-mono text-sm">
      <JsonNode data={data} name="root" isExpanded={true} level={0} darkMode={darkMode} />
    </div>
  );
};

interface JsonNodeProps {
  data: unknown;
  name: string;
  isExpanded?: boolean;
  level: number;
  darkMode: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  name,
  isExpanded = false,
  level,
  darkMode,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const isObject = data !== null && typeof data === "object";
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data as object).length === 0;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isObject) {
      setExpanded(!expanded);
    }
  };

  const getValueColor = (value: unknown) => {
    if (value === null) return darkMode ? "text-gray-400" : "text-gray-500";
    switch (typeof value) {
      case "boolean":
        return darkMode ? "text-yellow-300" : "text-yellow-600";
      case "number":
        return darkMode ? "text-green-300" : "text-green-600";
      case "string":
        return darkMode ? "text-red-300" : "text-red-600";
      default:
        return "";
    }
  };

  const renderValue = (value: unknown) => {
    if (value === null) return "null";
    if (typeof value === "string") {
      // For long strings, truncate them in the UI
      if (value.length > 100 && !expanded) {
        return `"${value.substring(0, 100)}..."`;
      }
      return `"${value}"`;
    }
    return String(value);
  };

  const getPadding = () => {
    return { paddingLeft: `${level * 20}px` };
  };

  const keyClass = darkMode ? "text-blue-300" : "text-blue-600";

  if (!isObject) {
    return (
      <div
        style={getPadding()}
        className="py-1 break-all"
      >
        <span className={keyClass}>{name}</span>:{" "}
        <span className={getValueColor(data)}>{renderValue(data)}</span>
      </div>
    );
  }

  return (
    <div style={getPadding()}>
      <div
        className="flex items-start py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        onClick={toggleExpand}
      >
        <div className="flex-shrink-0 mt-1">
          {isEmpty ? (
            <span className="w-4 h-4 inline-block mr-1"></span>
          ) : expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 mr-1" />
          )}
        </div>
        <div className="break-all">
          <span className={keyClass}>{name}</span>:{" "}
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            {isArray ? "Array" : "Object"}
            {isEmpty ? " (empty)" : expanded ? "" : ` (${Object.keys(data as object).length} ${isArray ? "items" : "properties"})`}
          </span>
        </div>
      </div>

      {expanded && !isEmpty && (
        <div className="ml-2 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
          {Object.keys(data as object).map((key) => (
            <JsonNode
              key={key}
              data={(data as Record<string, unknown>)[key]}
              name={isArray ? `[${key}]` : key}
              level={level + 1}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonViewer;
