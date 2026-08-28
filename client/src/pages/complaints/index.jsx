import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import ComplaintFilters from '../../components/ComplaintFilters';
import ComplaintTable from '../../components/ComplaintTable';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import { PlusCircle, FileText } from 'lucide-react';

const ComplaintsListPage = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'student';

  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');

  // Dropdown options
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, deptRes] = await Promise.all([
          api.get('/categories'),
          api.get('/departments'),
        ]);
        setCategories(catRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch complaints
  const fetchComplaints = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(category ? { category } : {}),
        ...(department ? { department } : {}),
      };
      const res = await api.get('/complaints', { params });
      setComplaints(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(1);
  }, [search, status, priority, category, department]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
    setDepartment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {role === 'student'
              ? 'My Submitted Complaints'
              : role === 'faculty'
              ? 'Assigned Complaints Queue'
              : 'All College Complaints'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {pagination.total} total complaints in your view
          </p>
        </div>

        {role === 'student' && (
          <Link
            to="/complaints/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Complaint</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <ComplaintFilters
        search={search}
        status={status}
        priority={priority}
        category={category}
        department={department}
        categories={categories}
        departments={departments}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onCategoryChange={setCategory}
        onDepartmentChange={setDepartment}
        onReset={handleResetFilters}
      />

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <ComplaintTable
          complaints={complaints}
          pagination={pagination}
          onPageChange={(page) => fetchComplaints(page)}
          showAssignee={role !== 'faculty'}
        />
      )}
    </div>
  );
};

export default ComplaintsListPage;
