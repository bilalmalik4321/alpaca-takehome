"use client";

import { useState } from "react";

export default function Home() {
  const [patientName, setPatientName] = useState(""); // Required field
  const [date, setDate] = useState(""); // Required field
  const [duration, setDuration] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("• "); // Start with a bullet point
  const [loading, setLoading] = useState(false); // State to track loading status
  const [response, setResponse] = useState(""); // State to store AI response
  const [editableNotes, setEditableNotes] = useState(""); // State for editable notes

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;

    // Get cursor position to handle specific cases
    const cursorPosition = e.target.selectionStart;

    // Handle Backspace: Remove the last bullet if at the start of a bullet
    if (input[cursorPosition - 1] === "•" && input[cursorPosition - 2] === "\n") {
      setNotes((prev) => {
        const lines = prev.split("\n");
        lines.pop(); // Remove the last bullet point
        return lines.join("\n") || "• "; // Ensure at least one bullet remains
      });
      return;
    }

    // Automatically add a bullet point if the user presses Enter
    if (input.endsWith("\n")) {
      setNotes((prev) => `${prev.trim()}\n• `); // Add a new bullet point
      return;
    }

    setNotes(input); // Update input normally for other cases
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setResponse("");

    const sessionInfo = sessionType || "not specified";
    const sessionDuration = duration || "not specified";

    try {
      const res = await fetch("http://127.0.0.1:8000/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_type: sessionInfo,
          duration: sessionDuration,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await res.json();
      setResponse(data.result);
      setEditableNotes(data.result); // Populate editable notes
    } catch (error) {
      console.error("Error generating notes:", error);
      setResponse("Failed to generate notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patientName || !date || !editableNotes) {
      alert("Please provide a patient name, date, and notes before saving.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/save-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: patientName,
          date,
          notes: editableNotes,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to save notes");
      }

      alert("Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">
        Session Note Generator
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        {/* Patient Name */}
        <div>
          <label className="block text-left text-gray-700 font-medium mb-2">
            Patient Name:
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-left text-gray-700 font-medium mb-2">
            Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Session Parameters */}
        <div>
          <label className="block text-left text-gray-700 font-medium mb-2">
            Duration (minutes):
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter session duration"
            className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-left text-gray-700 font-medium mb-2">
            Session Type:
          </label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              Select session type
            </option>
            <option value="Behavioral Therapy">Behavioral Therapy</option>
            <option value="Speech Therapy">Speech Therapy</option>
            <option value="Occupational Therapy">Occupational Therapy</option>
          </select>
        </div>

        {/* Bullet Point Notes */}
        <div>
          <label className="block text-left text-gray-700 font-medium mb-2">
            Notes:
          </label>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write your notes here. Bullet points will be auto-inserted."
            className="w-full h-40 border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Generating Notes..." : "Submit Notes"}
        </button>
      </form>

      {/* Editable Response Section */}
      {editableNotes && (
        <div className="mt-6 w-full max-w-lg bg-gray-50 p-4 rounded-lg shadow-md text-gray-800 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Generated Notes:</h2>
          <textarea
            value={editableNotes}
            onChange={(e) => setEditableNotes(e.target.value)}
            className="w-full h-40 border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          />
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Save Notes
          </button>
        </div>
      )}
    </div>
  );
}
