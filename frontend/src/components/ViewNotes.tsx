"use client";

import { useState, useEffect } from "react";

interface Note {
  name: string;
  date: string;
  notes: string;
}

export default function ViewNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchName, setSearchName] = useState<string>("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/get-notes");
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data: Note[] = await res.json();
        // Sort notes by date (latest first)
        const sortedNotes = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNotes(sortedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes based on searchName
  const filteredNotes = notes.filter((note) =>
    searchName ? note.name.toLowerCase().includes(searchName.toLowerCase()) : true
  );

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">View Notes</h1>

      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="searchName" className="block text-left text-gray-700 font-medium mb-2">
          Search by Patient Name:
        </label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter patient name"
          className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-800">{note.name}</h3>
            <p className="text-sm text-gray-600 italic">{note.date}</p>
            <p className="mt-4 text-gray-700 leading-relaxed">{note.notes}</p>
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">No notes found for the specified patient name.</p>
        )}
      </div>
    </div>
  );
}
