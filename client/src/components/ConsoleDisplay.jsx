import React from "react";

export const ConsoleDisplay = ({ data, requestTime }) => {
  const consoleText = JSON.stringify(data, null, 2);
  return (
    <div className="h-full max-h-[500px]">
      {requestTime > 0 && (
        <p className="mt-2 text-green-500">
          Request took {requestTime.toFixed(2)} milliseconds.
        </p>
      )}
      <pre className="rounded-md bg-black p-2 text-white font-mono text-xs whitespace-pre-wrap h-full overflow-y-auto  ">
        {consoleText}
      </pre>
    </div>
  );
};
