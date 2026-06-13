import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPatient from './components/AddPatient';
import PatientList from './components/PatientList';
import EditPatient from './components/EditPatient';
import { getPatients } from './services/api';

function App() {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [search, setSearch] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = useCallback(async (page = 1, searchTerm = search) => {
    try {
      const res = await getPatients(searchTerm, page, 5);
      setPatients(res.data.patients);
      setTotalPatients(res.data.totalCount);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error(err);
    }
  }, [search]);

  // Search change — page 1 reset
  useEffect(() => {
    setCurrentPage(1);
    fetchPatients(1, search);
  }, [search, fetchPatients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
            🏥
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Patient Registration System</h1>
            <p className="text-violet-200 text-sm">Manage patient records efficiently</p>
          </div>
          <div className="ml-auto bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium">
            Total: {totalPatients} Patients
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AddPatient onPatientAdded={() => fetchPatients(currentPage)} />

        {editingPatient && (
          <EditPatient
            patient={editingPatient}
            onClose={() => setEditingPatient(null)}
            onUpdated={() => fetchPatients(currentPage)}
          />
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 
                rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white 
                transition-all duration-200 text-gray-700"
              placeholder="Search by Patient Name or Mobile Number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >✕</button>
            )}
          </div>
        </div>

        <PatientList
          patients={patients}
          totalPages={totalPages}
          currentPage={currentPage}
          onDelete={() => fetchPatients(currentPage)}
          onEdit={setEditingPatient}
          onPageChange={(page) => fetchPatients(page, search)}
        />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;