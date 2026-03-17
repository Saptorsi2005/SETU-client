import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Upload,
  FileSpreadsheet,
  FileText,
  X,
  FileDown,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { adminAPI } from "../services/api";

const Admin_Directory = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 0,
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const departments = [
    "All",
    "Computer Science and Engineering",
    "Information Technology",
    "Electrical Engineering",
    "Electronics and Communication",
    "Mechanical Engineering",
  ];

  // Fetch directory data
  const fetchDirectory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (filterDept && filterDept !== "All") {
        params.department = filterDept;
      }

      const response = await adminAPI.getDirectory(params);

      if (response.success) {
        setAlumniData(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching directory:", err);
      setError("Failed to load directory data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchDirectory();
  }, [searchTerm, filterDept]);

  // Handle Excel export
  const handleExportExcel = async () => {
    try {
      const blob = await adminAPI.exportDirectoryExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'directory_export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Delay revocation to ensure browser starts download
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Error exporting Excel:", err);
      alert("Failed to export Excel file. Please try again.");
    }
  };

  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      const blob = await adminAPI.exportDirectoryCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'directory_export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Delay revocation to ensure browser starts download
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      alert("Failed to export CSV file. Please try again.");
    }
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      const { blob, headers } = await adminAPI.exportDirectoryPDF();

      // Try to extract filename from Content-Disposition header
      let filename = 'directory_export.pdf'; // default filename
      const contentDisposition = headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Force download by changing MIME type to application/octet-stream
      // This bypasses Chrome's PDF viewer and forces a download
      const downloadBlob = new Blob([blob], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(downloadBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      // Add to DOM and trigger click
      document.body.appendChild(link);
      link.click();

      // Keep the blob URL alive longer for Chrome (5 seconds)
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 5000);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("Failed to export PDF file. Please try again.");
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle CSV import
  const handleImportCSV = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    try {
      setImporting(true);
      const response = await adminAPI.importDirectoryCSV(selectedFile);

      if (response.success) {
        setImportResults(response.data);
        setSelectedFile(null);
        // Refresh directory after import
        fetchDirectory();
      }
    } catch (err) {
      console.error("Error importing CSV:", err);
      alert(err.response?.data?.message || "Failed to import CSV file. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  // Close import modal
  const closeImportModal = () => {
    setShowImportModal(false);
    setSelectedFile(null);
    setImportResults(null);
  };

  // Filter data (now done on backend, but keep for consistency)
  const filteredData = alumniData;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 relative">
      <Navbar />
      {/* Header */}
      <header className="pt-10 mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
          <h1 className="text-3xl font-bold tracking-tight">
            ANALYTICS <span className="font-light text-gray-400">DIRECTORY</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm pl-14 tracking-wide uppercase font-medium">
          Manage and track your alumni network
        </p>
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2.5 bg-gray-900/50 hover:bg-[#C5B239]/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-xl border border-gray-800 hover:border-[#C5B239]/40 transition-all duration-300 shadow-lg"
        >
          <FileSpreadsheet size={18} className="text-[#C5B239]" /> <span className="text-sm font-bold">Export Excel</span>
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2.5 bg-gray-900/50 hover:bg-[#C5B239]/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-xl border border-gray-800 hover:border-[#C5B239]/40 transition-all duration-300 shadow-lg"
        >
          <FileText size={18} className="text-[#C5B239]" /> <span className="text-sm font-bold">Export CSV</span>
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2.5 bg-gray-900/50 hover:bg-[#C5B239]/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-xl border border-gray-800 hover:border-[#C5B239]/40 transition-all duration-300 shadow-lg"
        >
          <FileDown size={18} className="text-[#C5B239]" /> <span className="text-sm font-bold">Export PDF</span>
        </button>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black px-6 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <Upload size={18} className="stroke-[2.5px]" /> <span className="text-sm font-bold uppercase tracking-wider">Upload CSV</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-5 mb-8 items-center bg-[#111] p-5 rounded-2xl border border-gray-800 shadow-xl">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full bg-black/40 text-white placeholder-gray-600 pl-11 pr-4 py-3 rounded-xl border border-gray-800 focus:outline-none focus:border-[#C5B239]/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
        </div>

        <div className="flex items-center bg-black/40 px-4 py-3 rounded-xl border border-gray-800 focus-within:border-[#C5B239]/50 transition-all min-w-[240px]">
          <Filter size={18} className="mr-3 text-[#C5B239]" />
          <select
            className="bg-transparent text-gray-300 focus:outline-none w-full cursor-pointer text-sm font-medium"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map((dept, i) => (
              <option key={i} value={dept} className="bg-gray-900">
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest ml-auto px-4 border-l border-gray-800">
          Total: <span className="text-[#C5B239]">{pagination.total}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-800 shadow-2xl bg-[#111]">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-[10px] tracking-[0.15em] font-bold">
            <tr className="border-b border-gray-800">
              <th className="px-6 py-5 text-left">Full Name</th>
              <th className="px-6 py-5 text-left">Email Address</th>
              <th className="px-6 py-5 text-left">Access Level</th>
              <th className="px-6 py-5 text-left">Department</th>
              <th className="px-6 py-5 text-left text-center">Batch Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5B239]"></div>
                    <p className="text-gray-500 font-medium">Loading directory...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic font-medium">
                  No users match your criteria.
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-900/40 transition-colors duration-200 cursor-pointer group"
                  onClick={() => setSelectedProfile(row)}
                >
                  <td className="px-6 py-4 font-bold text-gray-300 group-hover:text-[#C5B239] transition-colors">{row.name}</td>
                  <td className="px-6 py-4 text-gray-400 group-hover:text-gray-300">{row.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${row.role === 'alumni'
                      ? 'bg-purple-900/20 text-purple-400 border-purple-500/20'
                      : 'bg-green-900/20 text-green-400 border-green-500/20'
                      }`}>
                      {row.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{row.department || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-900/50 px-3 py-1 rounded-lg border border-gray-800 text-xs font-bold text-[#C5B239]">
                      {row.year || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl relative animate-slide-up">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors bg-gray-900/50 p-2 rounded-full"
              onClick={() => setSelectedProfile(null)}
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C5B239] to-[#a89628] flex items-center justify-center text-black text-3xl font-bold font-serif shadow-lg">
                {selectedProfile.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {selectedProfile.name}
                </h2>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedProfile.role === 'alumni'
                    ? 'bg-purple-900/20 text-purple-400 border-purple-500/20'
                    : 'bg-green-900/20 text-green-400 border-green-500/20'
                    }`}>
                    {selectedProfile.role}
                  </span>
                  <span className="text-gray-500 text-xs font-bold">•</span>
                  <p className="text-[#C5B239] font-bold text-xs uppercase tracking-widest">
                    {selectedProfile.department || 'N/A'}
                  </p>
                </div>
                <p className="text-gray-500 text-sm font-medium">{selectedProfile.email}</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar bg-black/20 p-4 rounded-2xl border border-gray-800/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                  <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5B239] rounded-full"></span>
                    Batch Year
                  </h3>
                  <p className="text-gray-300 font-bold">{selectedProfile.year || 'N/A'}</p>
                </div>

                {selectedProfile.location && (
                  <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#C5B239] rounded-full"></span>
                      Location
                    </h3>
                    <p className="text-gray-300 font-bold">{selectedProfile.location}</p>
                  </div>
                )}
              </div>

              {selectedProfile.current_company && (
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5B239] rounded-full"></span>
                    Professional Status
                  </h3>
                  <p className="text-gray-200 font-bold text-lg">{selectedProfile.current_position || 'Member'}</p>
                  <p className="text-[#C5B239] font-medium text-sm">at {selectedProfile.current_company}</p>
                </div>
              )}

              {selectedProfile.bio && (
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5B239] rounded-full"></span>
                    Biography
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedProfile.bio}</p>
                </div>
              )}

              {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5B239] rounded-full"></span>
                    Expertise & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, i) => (
                      <span key={i} className="bg-[#C5B239]/10 text-[#C5B239] text-[10px] font-bold px-3 py-1 rounded-full border border-[#C5B239]/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfile.experience && (
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5B239] rounded-full"></span>
                    Experience Summary
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedProfile.experience}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 md:p-10 w-full max-w-2xl shadow-2xl relative animate-slide-up">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors bg-gray-900/50 p-2 rounded-full"
              onClick={closeImportModal}
            >
              <X size={20} />
            </button>

            <header className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Import Network Data
              </h2>
              <p className="text-gray-500 text-sm">Onboard multiple users via CSV spreadsheet</p>
            </header>

            {!importResults ? (
              <div className="space-y-6">
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="font-bold text-[#C5B239] text-xs uppercase tracking-widest mb-3">CSV Format Guide</h3>
                  <ul className="text-xs text-gray-400 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-[#C5B239]">•</span>
                      <p><strong>Required Columns:</strong> Name, Email, Role (alumni/student), Department, Year</p>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#C5B239]">•</span>
                      <p><strong>Optional:</strong> Skills (semicolon-separated), Company, Position, Location</p>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-gray-500">•</span>
                      <p className="italic">Note: Temporary password "changeme123" will be assigned</p>
                    </li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-800 hover:border-[#C5B239]/50 rounded-2xl p-10 text-center transition-all group bg-black/20">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 border border-gray-800 group-hover:border-[#C5B239]/30 transition-colors">
                      <Upload size={32} className="text-gray-500 group-hover:text-[#C5B239] transition-colors" />
                    </div>
                    <span className="text-gray-300 font-bold group-hover:text-white transition-colors">
                      {selectedFile ? selectedFile.name : 'Select CSV manifest'}
                    </span>
                    <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mt-2">
                      CSV format only • Max 5MB
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleImportCSV}
                    disabled={!selectedFile || importing}
                    className={`flex-1 py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg ${!selectedFile || importing
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-transparent'
                      : 'bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                  >
                    {importing ? 'Processing Data...' : 'Begin Import'}
                  </button>
                  <button
                    onClick={closeImportModal}
                    className="flex-1 bg-gray-900/50 hover:bg-gray-800/50 text-gray-400 hover:text-white py-3.5 rounded-xl font-bold uppercase tracking-wider transition-all border border-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-2xl">
                  <p className="font-bold flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Import Successful
                  </p>
                  <p className="text-sm font-medium text-gray-400">
                    <span className="text-green-400 font-bold">{importResults.imported}</span> records processed
                    {importResults.skipped > 0 && ` (${importResults.skipped} duplicates skipped)`}
                  </p>
                </div>

                {importResults.errors && importResults.errors.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="font-bold text-red-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Data Conflicts ({importResults.errors.length})
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {importResults.errors.map((error, idx) => (
                        <div key={idx} className="text-xs text-gray-400 bg-black/30 p-3 rounded-xl border border-gray-800/50">
                          <span className="text-red-400 font-bold mr-2 uppercase">Row {error.row}:</span> {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={closeImportModal}
                  className="w-full bg-gray-900 border border-gray-800 hover:border-gray-700 py-4 rounded-xl text-white font-bold uppercase tracking-widest transition-all shadow-lg"
                >
                  Return to Directory
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Directory;
