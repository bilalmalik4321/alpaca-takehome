"use client";

import { useState } from "react";
import { handleNotesChange, generateNotes, saveNotes } from "../utils";
import { FormInput, FormSelect } from "../components/FormInput";

export default function GenerateNotes() {
  const [patientName, setPatientName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("");
  const [notes, setNotes] = useState<string>("• ");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [editableNotes, setEditableNotes] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"success" | "failure" | null>(null);

  const handleSave = async () => {
    const success = await saveNotes(patientName, date, editableNotes);
    setSaveStatus(success ? "success" : "failure");
  };

  const restartFlow = () => {
    setPatientName("");
    setDate("");
    setDuration("");
    setSessionType("");
    setNotes("• ");
    setEditableNotes("");
    setResponse("");
    setSaveStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Session Note Generator</h1>

      {/* Form Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateNotes(sessionType, duration, notes, setResponse, setEditableNotes, setLoading);
        }}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <FormInput
          label="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
        <FormInput
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          required
        />
        <FormInput
          label="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          type="number"
        />
        <FormSelect
          label="Session Type"
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          options={[
            { value: "", label: "Select session type", disabled: true },
            { value: "Behavioral Therapy", label: "Behavioral Therapy" },
            { value: "Speech Therapy", label: "Speech Therapy" },
            { value: "Occupational Therapy", label: "Occupational Therapy" },
          ]}
        />
        <div>
          <label className="block text-left text-gray-700 font-medium mb-2">Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target, setNotes)}
            placeholder="Write your notes here. Bullet points will be auto-inserted."
            className="w-full h-40 border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Generating Notes..." : "Submit Notes"}
        </button>

        {loading && (
          <div className="mt-4 text-blue-500 font-semibold">Generating Notes...</div>
        )}
      </form>

      {/* Generated Notes Section */}
      {editableNotes && (
        <div className="mt-6 w-full max-w-lg bg-gray-50 p-4 rounded-lg shadow-md text-gray-800 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Generated Notes:</h2>
          <textarea
            value={editableNotes}
            onChange={(e) => setEditableNotes(e.target.value)}
            className="w-full h-40 border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Save Notes
            </button>
            {saveStatus === "success" && <span className="text-green-500">✔️</span>}
            {saveStatus === "failure" && <span className="text-red-500">❌</span>}
          </div>
        </div>
      )}

      {/* Restart Button */}
      {editableNotes && (
        <button
          onClick={restartFlow}
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
        >
          Start New Session
        </button>
      )}
    </div>
  );
}
