import React, { useEffect, useState } from "react";
import api from "../services/api";

const Admin_Approval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [reason, setReason] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/pending/requests");
      setRequests(res.data.data || res.data.requests || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      alert("Failed to load job requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    if (!window.confirm("Approve this job post request?")) return;

    try {
      await api.post(`/jobs/approve/${id}`);
      alert("Job approved successfully");
      setRequests((prev) => prev.filter((r) => r.request_id !== id));
    } catch (err) {
      console.error("Approve error:", err);
      alert("Approval failed");
    }
  };

  const rejectRequest = async () => {
    try {
      await api.post(`/jobs/reject/${rejectModal.id}`, {
        rejection_reason: reason,
      });
      alert("Job request rejected");
      setRequests((prev) =>
        prev.filter((r) => r.request_id !== rejectModal.id)
      );
      setRejectModal({ open: false, id: null });
      setReason("");
    } catch (err) {
      console.error("Reject error:", err);
      alert("Rejection failed");
    }
  };

  return (
    <div className="min-h-screen px-8 py-6 text-gray-200">
      <h2 className="text-2xl font-semibold">Pending Job Requests</h2>
      <p className="text-gray-400 mt-1">
        Review and approve alumni-submitted job postings
      </p>

      {loading ? (
        <p className="mt-6 text-gray-400">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="mt-6 text-gray-400">No pending job requests</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800/60">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Submitted By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Submitted On
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.request_id} className="border-t border-gray-800">
                  <td className="px-4 py-3">{req.job_title}</td>
                  <td className="px-4 py-3">{req.company}</td>
                  <td className="px-4 py-3">
                    {req.location || <span className="text-gray-500">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {req.alumni_email || req.alumni_user_id}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => approveRequest(req.request_id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        setRejectModal({ open: true, id: req.request_id })
                      }
                      className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-black text-sm font-semibold"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 w-[420px]">
            <h3 className="text-lg font-semibold mb-2">
              Reject Job Request
            </h3>

            <textarea
              className="w-full h-24 mt-2 p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
              placeholder="Optional rejection reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={rejectRequest}
                className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-black font-semibold"
              >
                Confirm Reject
              </button>

              <button
                onClick={() => setRejectModal({ open: false, id: null })}
                className="px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Approval;
