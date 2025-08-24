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

  // Teacher Auth
  const [logins, setLogins] = useState([]);
  const [resettingId, setResettingId] = useState(null);
  const [search, setSearch] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("teachers"); // "teachers" | "logins"
  const [showForm, setShowForm] = useState(true); // toggle form vs table in teachers tab
  const [showLoginSearch, setShowLoginSearch] = useState(true); // toggle search vs table in logins tab

  // Fetch teachers
  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("teachers").select("*");
    if (!error) setTeachers(data);
    setLoading(false);
  };

  // Fetch logins
  const fetchLogins = async () => {
    const { data, error } = await supabase.from("teacher_auth").select("*");
    if (!error) setLogins(data);
  };

  useEffect(() => {
    fetchTeachers();
    fetchLogins();
  }, []);

  // Add / update teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase
        .from("teachers")
        .update({
          teacher_name: form.teacher_name,
          phone_number: form.phone_number,
          email: form.email,
          salary: form.salary,
        })
        .eq("teacher_id", editingId);
      resetForm();
      fetchTeachers();
    } else {
      const { error } = await supabase.from("teachers").insert([form]);
      if (!error) {
        await supabase.from("teacher_auth").insert([
          { teacher_id: form.teacher_id, password: "svvv@123", must_reset: true },
        ]);
        resetForm();
        fetchTeachers();
        fetchLogins();
      }
    }
  };

  // Delete teacher
  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    await supabase.from("teachers").delete().eq("teacher_id", id);
    fetchTeachers();
    fetchLogins();
  };

  const editTeacher = (teacher) => {
    setForm(teacher);
    setEditingId(teacher.teacher_id);
    setShowForm(true);
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

  // Reset password
  const resetPassword = async (id) => {
    setResettingId(id);
    await supabase
      .from("teacher_auth")
      .update({ password: "svvv@123", must_reset: true })
      .eq("teacher_id", id);
    setResettingId(null);
    fetchLogins();
  };

  return (
    <div className="space-y-6">
      {/* Main Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "teachers"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Teachers
        </button>
        <button
          onClick={() => setActiveTab("logins")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "logins"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Teacher Logins
        </button>
      </div>

      {/* Teachers Tab */}
      {activeTab === "teachers" && (
        <div>
          {/* Sub Tabs (Students-style) */}
          <div className="flex border-b mb-6 space-x-6">
            <button
              onClick={() => setShowForm(true)}
              className={`pb-2 font-semibold transition ${
                showForm
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Teacher Data
            </button>
            <button
              onClick={() => setShowForm(false)}
              className={`pb-2 font-semibold transition ${
                !showForm
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Show Data
            </button>
          </div>

          {/* Teacher Form */}
          {showForm ? (
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border"
            >
              <input
                type="text"
                placeholder="Teacher ID"
                value={form.teacher_id}
                onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                disabled={!!editingId}
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Name"
                value={form.teacher_name}
                onChange={(e) => setForm({ ...form, teacher_name: e.target.value })}
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="border rounded px-4 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border rounded px-4 py-2"
              />
              <input
                type="number"
                placeholder="Salary"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="border rounded px-4 py-2"
              />

              <div className="col-span-full flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingId ? "Update Teacher" : "Add Teacher"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            // Teacher Table
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center text-blue-500">Loading teachers...</div>
              ) : teachers.length === 0 ? (
                <div className="text-center text-gray-500">No teachers found.</div>
              ) : (
                <table className="min-w-full bg-white shadow-md border rounded-lg">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Salary</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.teacher_id} className="hover:bg-blue-50">
                        <td className="px-4 py-2">{t.teacher_id}</td>
                        <td className="px-4 py-2">{t.teacher_name}</td>
                        <td className="px-4 py-2">{t.phone_number}</td>
                        <td className="px-4 py-2">{t.email}</td>
                        <td className="px-4 py-2">{t.salary}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={() => editTeacher(t)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTeacher(t.teacher_id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
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
          )}
        </div>
      )}

      {/* Teacher Logins Tab */}
      {activeTab === "logins" && (
        <div>
          {/* Toggle Buttons */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600">
              Teacher Login Credentials
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowLoginSearch(true)}
                className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-lg transition ${
                  showLoginSearch
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setShowLoginSearch(false)}
                className={`px-3 md:px-4 py-2 text-sm md:text-base rounded-lg transition ${
                  !showLoginSearch
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Show Data
              </button>
            </div>
          </div>

          {/* Search Input */}
          {showLoginSearch && (
            <div className="mb-4 bg-white p-4 md:p-6 rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Search by Teacher ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-blue-400 rounded px-2 md:px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Teacher Login Table */}
          {!showLoginSearch && (
            <>
              {loading ? (
                <p className="text-center py-8">Loading...</p>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-2 md:p-4 text-left">Teacher ID</th>
                        <th className="p-2 md:p-4 text-left">Name</th>
                        <th className="p-2 md:p-4 text-left">Password</th>
                        <th className="p-2 md:p-4 text-left">Must Reset?</th>
                        <th className="p-2 md:p-4 text-left">Created At</th>
                        <th className="p-2 md:p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-gray-800">
                      {teachers
                        .filter((t) =>
                          !search
                            ? true
                            : t.teacher_id
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map((t, idx) => {
                          const login = logins.find(
                            (l) => l.teacher_id === t.teacher_id
                          );
                          return (
                            <tr
                              key={t.teacher_id}
                              className={`border-b ${
                                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }`}
                            >
                              <td className="p-2 md:p-4 break-words">
                                {t.teacher_id}
                              </td>
                              <td className="p-2 md:p-4 break-words">
                                {t.teacher_name}
                              </td>
                              <td className="p-2 md:p-4 break-words">
                                {login?.password || "svvv@123"}
                              </td>
                              <td className="p-2 md:p-4">
                                {login
                                  ? login.must_reset
                                    ? "Yes"
                                    : "No"
                                  : "-"}
                              </td>
                              <td className="p-2 md:p-4">
                                {login
                                  ? new Date(login.created_at).toLocaleString()
                                  : "-"}
                              </td>
                              <td className="p-2 md:p-4">
                                <button
                                  onClick={() => resetPassword(t.teacher_id)}
                                  disabled={resettingId === t.teacher_id}
                                  className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow transition ${
                                    resettingId === t.teacher_id
                                      ? "opacity-60 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {resettingId === t.teacher_id
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeachersTable;
