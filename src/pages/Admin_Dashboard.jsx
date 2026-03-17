import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import { FaUsers, FaUserGraduate, FaCalendar, FaDonate, FaSync } from 'react-icons/fa';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import useDashboardStats from '../hooks/useDashboardStats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Admin_Dashboard = () => {
  // Use custom hook for real-time dashboard stats (refreshes every 30 seconds)
  const { stats, loading, error, refresh } = useDashboardStats(30000);

  // Chart configurations
  const usersByRoleChart = useMemo(() => {
    const data = stats.usersByRole.length > 0
      ? stats.usersByRole
      : [
        { role: 'Students', count: stats.totalStudents },
        { role: 'Alumni', count: stats.totalAlumni }
      ];

    return {
      labels: data.map(d => d.role || 'Unknown'),
      datasets: [{
        label: 'Users',
        data: data.map(d => d.count || 0),
        backgroundColor: ['#C5B239', '#8B5CF6', '#EC4899'],
        borderColor: ['#a89628', '#7C3AED', '#DB2777'],
        borderWidth: 2
      }]
    };
  }, [stats.usersByRole, stats.totalStudents, stats.totalAlumni]);

  const alumniVerificationChart = useMemo(() => {
    let data = stats.alumniVerificationStatus;

    // If no verification data, use safe defaults
    if (!data || data.length === 0) {
      data = [
        { status: 'Verified', count: 0 },
        { status: 'Pending', count: stats.totalAlumni },
        { status: 'Rejected', count: 0 }
      ];
    }

    return {
      labels: data.map(d => d.status || 'Unknown'),
      datasets: [{
        label: 'Alumni',
        data: data.map(d => d.count || 0),
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#059669', '#D97706', '#DC2626'],
        borderWidth: 2
      }]
    };
  }, [stats.alumniVerificationStatus, stats.totalAlumni]);

  const studentSkillsChart = useMemo(() => {
    const data = stats.studentSkills;

    if (!data || data.length === 0) {
      return null; // Will show "No data available"
    }

    return {
      labels: data.map(d => d.skill || 'Other'),
      datasets: [{
        label: 'Students',
        data: data.map(d => d.count || 0),
        backgroundColor: '#C5B239',
        borderColor: '#a89628',
        borderWidth: 2,
        borderRadius: 6
      }]
    };
  }, [stats.studentSkills]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#9CA3AF',
          font: { size: 11 },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F3F4F6',
        bodyColor: '#E5E7EB',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: { color: '#9CA3AF', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9CA3AF', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 pt-28 md:pt-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-4 mb-1">
              <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
              <h1 className="text-3xl font-bold tracking-tight">ADMIN <span className="font-light text-gray-400">DASHBOARD</span></h1>
            </div>
            <p className="text-gray-500 text-sm pl-14 font-medium uppercase tracking-wider">Strategic insights and network analytics</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black rounded-xl font-bold transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 shadow-lg group"
          >
            <FaSync className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
            <span className="text-sm">REFRESH ANALYTICS</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900/10 rounded-3xl border border-gray-800/50">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#C5B239]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#C5B239] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing metrics...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-[#C5B239]/30 transition-all duration-300 group shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                    <FaUsers className="text-blue-400 text-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Total</span>
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Users</h3>
                <p className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#C5B239] transition-colors">{stats.totalUsers}</p>
                <div className="mt-3 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[70%]"></div>
                </div>
              </div>

              <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-[#C5B239]/30 transition-all duration-300 group shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                    <FaUserGraduate className="text-purple-400 text-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Alumni</span>
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Network</h3>
                <p className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#C5B239] transition-colors">{stats.totalAlumni}</p>
                <div className="mt-3 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[45%]"></div>
                </div>
              </div>

              <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-[#C5B239]/30 transition-all duration-300 group shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:border-green-500/40 transition-colors">
                    <FaCalendar className="text-green-400 text-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Live</span>
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Events</h3>
                <p className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#C5B239] transition-colors">{stats.numberOfEvents}</p>
                <div className="mt-3 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[60%]"></div>
                </div>
              </div>

              <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl hover:border-[#C5B239]/30 transition-all duration-300 group shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[#C5B239]/10 rounded-xl flex items-center justify-center border border-[#C5B239]/20 group-hover:border-[#C5B239]/40 transition-colors">
                    <FaDonate className="text-[#C5B239] text-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Funds</span>
                </div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Donations</h3>
                <p className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#C5B239] transition-colors">{stats.numberOfDonations}</p>
                <div className="mt-3 h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C5B239] w-[80%]"></div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Users by Role Chart */}
              <div className="bg-[#111] border border-gray-800 p-7 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">User Distribution</h3>
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut data={usersByRoleChart} options={chartOptions} />
                </div>
              </div>

              {/* Alumni Verification Status Chart */}
              <div className="bg-[#111] border border-gray-800 p-7 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Verification Status</h3>
                  <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <Doughnut data={alumniVerificationChart} options={chartOptions} />
                </div>
              </div>

              {/* Student Skills Chart */}
              <div className="bg-[#111] border border-gray-800 p-7 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Top Capabilities</h3>
                  <div className="w-2 h-2 rounded-full bg-[#C5B239] shadow-[0_0_8px_rgba(197,178,57,0.5)]"></div>
                </div>
                <div className="h-64 flex items-center justify-center">
                  {studentSkillsChart ? (
                    <Bar data={studentSkillsChart} options={barChartOptions} />
                  ) : (
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">Insufficient data points</p>
                  )}
                </div>
              </div>
            </div>

            {/* Auto-refresh indicator */}
            <div className="text-center text-gray-500 text-sm">
              <p>📊 Data refreshes automatically every 30 seconds</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin_Dashboard;
