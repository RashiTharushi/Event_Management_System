import React from "react";

const ExportReports: React.FC = () => {
  const handleExport = (format: "csv" | "pdf") => {
    const url = `/reports/export?type=registrations&format=${format}`;
    window.open(url, "_blank"); // opens in new tab and triggers download
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Export Reports</h2>
      <div className="flex gap-4">
        <button
          onClick={() => handleExport("csv")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Export CSV
        </button>
        <button
          onClick={() => handleExport("pdf")}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ExportReports;
