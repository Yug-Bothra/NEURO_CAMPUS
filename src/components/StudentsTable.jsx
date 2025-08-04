import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [resettingId, setResettingId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    enrollment_number: "",
    name: "",
    email: "",
    mobile_number: "",
    semester: "",
    fees: "",
    branch: "CSE",
    section: "",
  });

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    } else {
      setStudents(data);
      setLoading(false);
    }
  };

  // Fetch student login records
  const fetchLogins = async () => {
    const { data, error } = await supabase.from("student_auth").select("*");
    if (error) {
      console.error("Error fetching logins:", error);
    } else {
      setLogins(data);
    }
  };

  // On mount
  useEffect(() => {
    fetchStudents();
    fetchLogins();
  }, []);

  // Save new or updated student
  const saveStudent = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase
        .from("students")
        .update(form)
        .eq("enrollment_number", editingId);

      if (!error) {
        setEditingId(null);
        resetForm();
        fetchStudents();
      } else {
        alert("Update failed: " + error.message);
      }
    } else {
      const { error } = await supabase.from("students").insert([form]);
      if (!error) {
        await supabase.from("student_auth").insert([
          {
            enrollment_number: form.enrollment_number,
            password: "svvv@123",
            must_reset: true,
          },
        ]);
        resetForm();
        fetchStudents();
        fetchLogins();
      } else {
        alert("Insert failed: " + error.message);
      }
    }
  };

  // Delete student (auto deletes login due to ON DELETE CASCADE)
  const deleteStudent = async (id) => {
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("enrollment_number", id);
    if (!error) {
      fetchStudents();
      fetchLogins();
    } else {
      alert("Delete failed: " + error.message);
    }
  };

  const resetForm = () => {
    setForm({
      enrollment_number: "",
      name: "",
      email: "",
      mobile_number: "",
      semester: "",
      fees: "",
      branch: "CSE",
      section: "",
    });
  };

  const startEdit = (student) => {
    setEditingId(student.enrollment_number);
    setForm({ ...student });
  };

  // Reset password
  const resetPassword = async (enrollment_number) => {
    setResettingId(enrollment_number);
    const { error } = await supabase
      .from("student_auth")
      .update({ password: "svvv@123", must_reset: true })
      .eq("enrollment_number", enrollment_number);

    setResettingId(null);

    if (error) {
      alert("Password reset failed: " + error.message);
    } else {
      fetchLogins();
    }
  };

  return (
    <div>
      {/* --- STUDENTS MANAGEMENT --- */}
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Students</h2>

      <form
        onSubmit={saveStudent}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          placeholder="Enrollment Number"
          value={form.enrollment_number}
          onChange={(e) =>
            setForm({ ...form, enrollment_number: e.target.value })
          }
          className="border border-blue-300 rounded px-4 py-2"
          required
          disabled={!!editingId}
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={form.mobile_number}
          onChange={(e) =>
            setForm({ ...form, mobile_number: e.target.value })
          }
          className="border border-blue-300 rounded px-4 py-2"
        />
        <input
          type="number"
          placeholder="Semester"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
          required
        />
        <input
          type="number"
          placeholder="Fees"
          value={form.fees}
          onChange={(e) => setForm({ ...form, fees: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
        />
        <select
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
        >
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>
        <input
          type="text"
          placeholder="Section"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
          className="border border-blue-300 rounded px-4 py-2"
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className={`${
              editingId ? "bg-yellow-500" : "bg-blue-600"
            } text-white px-4 py-2 rounded`}
          >
            {editingId ? "Update Student" : "Add Student"}
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

      {/* --- STUDENTS TABLE --- */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto mb-10">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Enrollment</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Fees</th>
                <th className="p-3 text-left">Branch</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-800">
              {students.map((s) => (
                <tr key={s.enrollment_number} className="border-b">
                  <td className="p-3">{s.enrollment_number}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.mobile_number}</td>
                  <td className="p-3">{s.semester}</td>
                  <td className="p-3">{s.fees}</td>
                  <td className="p-3">{s.branch}</td>
                  <td className="p-3">{s.section}</td>
                  <td className="p-3">
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => startEdit(s)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStudent(s.enrollment_number)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
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

      {/* --- STUDENT LOGIN CREDENTIALS --- */}
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Student Login Credentials
      </h2>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Enrollment Number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-green-400 rounded px-4 py-2 w-full md:w-1/3"
        />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">Enrollment</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Password</th>
              <th className="p-3 text-left">Must Reset?</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {students
              .filter((s) =>
                !search
                  ? true
                  : s.enrollment_number
                      .toLowerCase()
                      .includes(search.toLowerCase())
              )
              .map((s) => {
                const login = logins.find(
                  (l) => l.enrollment_number === s.enrollment_number
                );
                return (
                  <tr key={s.enrollment_number} className="border-b">
                    <td className="p-3">{s.enrollment_number}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{login?.password || "svvv@123"}</td>
                    <td className="p-3">
                      {login ? (login.must_reset ? "Yes" : "No") : "-"}
                    </td>
                    <td className="p-3">
                      {login
                        ? new Date(login.created_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => resetPassword(s.enrollment_number)}
                        disabled={resettingId === s.enrollment_number}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        {resettingId === s.enrollment_number
                          ? "Resetting..."
                          : "Reset Password"}
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

export default StudentsTable;
