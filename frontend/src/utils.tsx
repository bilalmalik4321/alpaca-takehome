export const handleNotesChange = (
    input: HTMLTextAreaElement,
    setNotes: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const cursorPosition = input.selectionStart;
  
    if (input.value[cursorPosition - 1] === "•" && input.value[cursorPosition - 2] === "\n") {
      setNotes((prev) => {
        const lines = prev.split("\n");
        lines.pop();
        return lines.join("\n") || "• ";
      });
      return;
    }
  
    if (input.value.endsWith("\n")) {
      setNotes((prev) => `${prev.trim()}\n• `);
      return;
    }
  
    setNotes(input.value);
  };
  
  export const generateNotes = async (
    sessionType: string,
    duration: string,
    notes: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>,
    setEditableNotes: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_type: sessionType, duration, notes }),
      });
  
      if (!res.ok) throw new Error("Failed to generate notes");
  
      const data = await res.json();
      setResponse(data.result);
      setEditableNotes(data.result);
    } catch (error) {
      console.error(error);
      setResponse("Failed to generate notes.");
    } finally {
      setLoading(false);
    }
  };
  
  export const saveNotes = async (
    patientName: string,
    date: string,
    editableNotes: string
  ): Promise<boolean> => {
    if (!patientName || !date || !editableNotes) {
      alert("Please fill out patient name, date, and notes.");
      return false;
    }
  
    try {
      const res = await fetch("http://127.0.0.1:8000/save-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: patientName, date, notes: editableNotes }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to save notes");
      }
  
      alert("Notes saved successfully!");
      return true;
    } catch (error) {
      console.error(error);
      alert("Failed to save notes.");
      return false;
    }
  };
  