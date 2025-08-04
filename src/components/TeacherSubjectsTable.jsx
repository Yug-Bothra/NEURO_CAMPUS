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

  const fetchTeacherSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("teacher_subjects_read").select("*");
    if (error) {
      console.error("Error fetching teacher_subjects:", error);
    } else {
      setTeacherSubjects(data);
    }
    setLoading(false);
  };

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

  const saveTeacherSubject = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("teacher_subjects")
        .update(form)
        .eq("id", editingId);
      if (error) {
        alert("Update failed: " + error.message);
      } else {
        setEditingId(null);
        resetForm();
        fetchTeacherSubjects();
      }
    } else {
      const { error } = await supabase.from("teacher_subjects").insert([form]);
      if (error) {
        alert("Insert failed: " + error.message);
      } else {
        resetForm();
        fetchTeacherSubjects();
      }
    }
  };

  const deleteTeacherSubject = async (id) => {
    const { error } = await supabase.from("teacher_subjects").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      fetchTeacherSubjects();
    }
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setForm({
      teacher_id: record.teacher_id,
      subject_id: record.subject_id,
      section: record.section,
      semester: record.semester,
    });
  };

  const resetForm = () => {
    setForm({
      teacher_id: "",
      subject_id: "",
      section: "",
      semester: "",
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Teacher-Subject Assignments</h2>

      {/* Form */}
      <form
        onSubmit={saveTeacherSubject}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <select
          value={form.teacher_id}
          onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
          className="border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="number"
          placeholder="Semester"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
          className="border border-blue-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="flex space-x-2 col-span-1 md:col-span-2">
          <button
            type="submit"
            className={`${
              editingId ? "bg-yellow-600" : "bg-blue-600"
            } text-white px-4 py-2 rounded hover:opacity-90 transition`}
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
              className="bg-gray-500 text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-blue-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow">
            <thead className="bg-blue-100 text-blue-800">
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
              {teacherSubjects.map((ts, idx) => (
                <tr
                  key={ts.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <td className="p-2 border text-center">{ts.id}</td>
                  <td className="p-2 border">{ts.teacher_name}</td>
                  <td className="p-2 border">{ts.subject_name}</td>
                  <td className="p-2 border text-center">{ts.section}</td>
                  <td className="p-2 border text-center">{ts.semester}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => startEdit(ts)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTeacherSubject(ts.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectsTable;
