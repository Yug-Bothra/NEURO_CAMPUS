// src/components/TeacherSubjectsTable.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const TeacherSubjectsTable = () => {
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    teacher_id: "",
    subject_id: "",
    section: "",
    semester: "",
  });

  // Fetch joined data for display
  const fetchTeacherSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teacher_subjects_read") // ✅ read view with names
      .select("*");

    if (error) {
      console.error("Error fetching teacher_subjects:", error);
    } else {
      setTeacherSubjects(data);
    }
    setLoading(false);
  };

  // Fetch teachers and subjects for dropdowns
  const fetchTeachersAndSubjects = async () => {
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("teacher_id, teacher_name");
    const { data: subjectData } = await supabase
      .from("subjects")
      .select("subject_id, subject_name");

    setTeachers(teacherData || []);
    setSubjects(subjectData || []);
  };

  useEffect(() => {
    fetchTeacherSubjects();
    fetchTeachersAndSubjects();
  }, []);

  // Insert / Update into writable view
  const saveTeacherSubject = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("teacher_subjects") // ✅ writable view
        .update({
          teacher_id: form.teacher_id,
          subject_id: form.subject_id,
          section: form.section,
          semester: form.semester,
        })
        .eq("id", editingId);

      if (error) {
        alert("Update failed: " + error.message);
      } else {
        setEditingId(null);
        resetForm();
        fetchTeacherSubjects();
      }
    } else {
      const { error } = await supabase.from("teacher_subjects").insert([
        {
          teacher_id: form.teacher_id,
          subject_id: form.subject_id,
          section: form.section,
          semester: form.semester,
        },
      ]);

      if (error) {
        alert("Insert failed: " + error.message);
      } else {
        resetForm();
        fetchTeacherSubjects();
      }
    }
  };

  // Delete
  const deleteTeacherSubject = async (id) => {
    const { error } = await supabase
      .from("teacher_subjects")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      fetchTeacherSubjects();
    }
  };

  // Start editing
  const startEdit = (record) => {
    setEditingId(record.id);
    setForm({
      teacher_id: record.teacher_id,
      subject_id: record.subject_id,
      section: record.section,
      semester: record.semester,
    });
  };

  // Reset form
  const resetForm = () => {
    setForm({
      teacher_id: "",
      subject_id: "",
      section: "",
      semester: "",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teacher-Subject Assignments</h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={saveTeacherSubject}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <select
          value={form.teacher_id}
          onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t.teacher_id} value={t.teacher_id}>
              {t.teacher_name}
            </option>
          ))}
        </select>

        <select
          value={form.subject_id}
          onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Semester"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <div className="flex space-x-2">
          <button
            type="submit"
            className={`${
              editingId ? "bg-yellow-600" : "bg-blue-600"
            } text-white px-4 py-2 rounded`}
          >
            {editingId ? "Update Assignment" : "Add Assignment"}
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

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Teacher</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Semester</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teacherSubjects.map((ts) => (
              <tr key={ts.id}>
                <td className="p-2 border">{ts.id}</td>
                <td className="p-2 border">{ts.teacher_name}</td>
                <td className="p-2 border">{ts.subject_name}</td>
                <td className="p-2 border">{ts.section}</td>
                <td className="p-2 border">{ts.semester}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => startEdit(ts)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTeacherSubject(ts.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherSubjectsTable;
