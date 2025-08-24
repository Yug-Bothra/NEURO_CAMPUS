import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const TeachersTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    teacher_id: "",
    teacher_name: "",
    phone_number: "",
    email: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Teacher Auth State
  const [logins, setLogins] = useState([]);
  const [resettingId, setResettingId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch teachers
  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("teachers").select("*");
    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setTeachers(data);
    }
    setLoading(false);
  };

  // Fetch teacher logins
  const fetchLogins = async () => {
    const { data, error } = await supabase.from("teacher_auth").select("*");
    if (error) {
      console.error("Error fetching logins:", error);
    } else {
      setLogins(data);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchLogins();
  }, []);

  // Add / update teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase
        .from("teachers")
        .update({
          teacher_name: form.teacher_name,
          phone_number: form.phone_number,
          email: form.email,
          salary: form.salary,
        })
        .eq("teacher_id", editingId);

      if (error) alert("Update failed: " + error.message);
      else {
        resetForm();
        fetchTeachers();
      }
    } else {
      if (!form.teacher_id.trim()) {
        alert("Teacher ID is required!");
        return;
      }
      const { error } = await supabase.from("teachers").insert([form]);
      if (error) alert("Insert failed: " + error.message);
      else {
        // create login for teacher
        await supabase.from("teacher_auth").insert([
          {
            teacher_id: form.teacher_id,
            password: "svvv@123",
            must_reset: true,
          },
        ]);
        resetForm();
        fetchTeachers();
        fetchLogins();
      }
    }
  };

  // Delete teacher (cascade removes login too)
  const deleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    const { error } = await supabase.from("teachers").delete().eq("teacher_id", id);

    if (error) alert("Delete failed: " + error.message);
    else {
      fetchTeachers();
      fetchLogins();
    }
  };

  const editTeacher = (teacher) => {
    setForm({
      teacher_id: teacher.teacher_id,
      teacher_name: teacher.teacher_name,
      phone_number: teacher.phone_number,
      email: teacher.email,
      salary: teacher.salary,
    });
    setEditingId(teacher.teacher_id);
  };

  const resetForm = () => {
    setForm({
      teacher_id: "",
      teacher_name: "",
      phone_number: "",
      email: "",
      salary: "",
    });
    setEditingId(null);
  };

  // Reset password for teacher
  const resetPassword = async (teacher_id) => {
    setResettingId(teacher_id);
    const { error } = await supabase
      .from("teacher_auth")
      .update({ password: "svvv@123", must_reset: true })
      .eq("teacher_id", teacher_id);

    setResettingId(null);

    if (error) {
      alert("Password reset failed: " + error.message);
    } else {
      fetchLogins();
    }
  };

  return (
    <div className="space-y-12">
      {/* ================= TEACHERS MANAGEMENT ================= */}
      <h2 className="text-2xl font-bold text-blue-600">Teachers</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border border-blue-100"
      >
        <input
          type="text"
          placeholder="Teacher ID (Manual)"
          value={form.teacher_id}
          onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          required
          disabled={!!editingId}
        />
        <input
          type="text"
          placeholder="Teacher Name"
          value={form.teacher_name}
          onChange={(e) => setForm({ ...form, teacher_name: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <input
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
        <div className="col-span-full flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update Teacher" : "Add Teacher"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Teachers Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-blue-500">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="text-center text-gray-500">No teachers found.</div>
        ) : (
          <table className="min-w-full bg-white shadow-md border border-blue-100 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-4 py-2">Teacher ID</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Phone</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Salary</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {teachers.map((t) => (
                <tr key={t.teacher_id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-4 py-2">{t.teacher_id}</td>
                  <td className="px-4 py-2">{t.teacher_name}</td>
                  <td className="px-4 py-2">{t.phone_number}</td>
                  <td className="px-4 py-2">{t.email}</td>
                  <td className="px-4 py-2">{t.salary}</td>
                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => editTeacher(t)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTeacher(t.teacher_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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

      {/* ================= TEACHER LOGIN CREDENTIALS ================= */}
      <h2 className="text-2xl font-bold text-blue-600">Teacher Login Credentials</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Teacher ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-400 rounded px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Teacher ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Password</th>
              <th className="p-3 text-left">Must Reset?</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800 divide-y divide-blue-100">
            {teachers
              .filter((t) =>
                !search ? true : t.teacher_id.toLowerCase().includes(search.toLowerCase())
              )
              .map((t) => {
                const login = logins.find((l) => l.teacher_id === t.teacher_id);
                return (
                  <tr key={t.teacher_id} className="hover:bg-blue-50 transition duration-150">
                    <td className="p-3">{t.teacher_id}</td>
                    <td className="p-3">{t.teacher_name}</td>
                    <td className="p-3">{login?.password || "svvv@123"}</td>
                    <td className="p-3">{login ? (login.must_reset ? "Yes" : "No") : "-"}</td>
                    <td className="p-3">
                      {login ? new Date(login.created_at).toLocaleString() : "-"}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => resetPassword(t.teacher_id)}
                        disabled={resettingId === t.teacher_id}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        {resettingId === t.teacher_id ? "Resetting..." : "Reset Password"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachersTable;
