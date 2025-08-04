import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const SubjectsTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    subject_code: "",
    subject_name: "",
    class_name: "",
    semester: "",
  });

  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("subjects").select("*");
    if (error) {
      console.error("Error fetching subjects:", error);
      alert("Failed to fetch subjects: " + error.message);
    } else {
      setSubjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const saveSubject = async (e) => {
    e.preventDefault();

    if (!form.subject_code || !form.subject_name || !form.class_name || !form.semester) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      subject_code: form.subject_code.trim(),
      subject_name: form.subject_name.trim(),
      class_name: form.class_name.trim(),
      semester: Number(form.semester),
    };

    if (editingId) {
      const { error } = await supabase
        .from("subjects")
        .update(payload)
        .eq("subject_id", editingId);

      if (error) {
        console.error("Update failed:", error);
        alert("Update failed: " + error.message);
      } else {
        setEditingId(null);
        resetForm();
        fetchSubjects();
      }
    } else {
      const { error } = await supabase.from("subjects").insert([payload]);
      if (error) {
        console.error("Insert failed:", error);
        alert("Insert failed: " + error.message);
      } else {
        resetForm();
        fetchSubjects();
      }
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    const { error } = await supabase.from("subjects").delete().eq("subject_id", id);
    if (error) {
      console.error("Delete failed:", error);
      alert("Delete failed: " + error.message);
    } else {
      fetchSubjects();
    }
  };

  const startEdit = (subject) => {
    setEditingId(subject.subject_id);
    setForm({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      class_name: subject.class_name,
      semester: subject.semester,
    });
  };

  const resetForm = () => {
    setForm({
      subject_code: "",
      subject_name: "",
      class_name: "",
      semester: "",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Subjects</h2>

      <form
        onSubmit={saveSubject}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          placeholder="Subject Code"
          value={form.subject_code}
          onChange={(e) => setForm({ ...form, subject_code: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Subject Name"
          value={form.subject_name}
          onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Class Name"
          value={form.class_name}
          onChange={(e) => setForm({ ...form, class_name: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <input
          type="number"
          placeholder="Semester"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className={`${
              editingId ? "bg-yellow-600" : "bg-blue-600"
            } text-white px-4 py-2 rounded`}
          >
            {editingId ? "Update Subject" : "Add Subject"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Subjects Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((s) => (
                  <tr key={s.subject_id} className="border-b">
                    <td className="p-3">{s.subject_id}</td>
                    <td className="p-3">{s.subject_code}</td>
                    <td className="p-3">{s.subject_name}</td>
                    <td className="p-3">{s.class_name}</td>
                    <td className="p-3">{s.semester}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => startEdit(s)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSubject(s.subject_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectsTable;
