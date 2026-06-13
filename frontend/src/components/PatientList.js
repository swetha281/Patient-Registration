import React, { useState } from 'react';
import { deletePatient } from '../services/api';
import { toast } from 'react-toastify';

// Delete Confirm Modal
const DeleteConfirmModal = ({ patient, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🗑️</span>
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-800 text-center mb-1">Delete Patient?</h2>
        <p className="text-sm font-semibold text-violet-700 text-center mb-6">
          {patient?.name} (ID: {patient?.patientId})
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 
              text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 
              text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Page <span className="font-semibold text-violet-700">{currentPage}</span> of{' '}
        <span className="font-semibold text-violet-700">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200
            text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors
              ${p === currentPage
                ? 'bg-violet-600 text-white shadow-sm'
                : 'border border-gray-200 text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700'
              }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200
            text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const PatientList = ({ patients, totalPages, currentPage, onDelete, onEdit, onPageChange }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (patient) => setDeleteTarget(patient);

  const handleConfirmDelete = async () => {
    try {
      await deletePatient(deleteTarget._id);
      toast.success('Patient deleted successfully!');
      onDelete();
    } catch {
      toast.error('Error deleting patient');
    } finally {
      setDeleteTarget(null);
    }
  };

  const genderBadge = (gender) => {
    const styles = {
      Male: 'bg-blue-100 text-blue-700',
      Female: 'bg-pink-100 text-pink-700',
      Other: 'bg-purple-100 text-purple-700'
    };
    return styles[gender] || 'bg-gray-100 text-gray-900';
  };

  return (
    <>
      {deleteTarget && (
        <DeleteConfirmModal
          patient={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              👥
            </div>
            <h3 className="font-bold text-lg text-purple-800">Patient Records</h3>
          </div>
          <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
            {patients.length} records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Patient ID', 'Name', 'Age', 'Gender', 'Mobile', 'Reg. Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-5xl">🏥</span>
                      <p className="text-gray-900 font-medium">No patients found</p>
                      <p className="text-gray-900 text-sm">Add a new patient to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id} className="hover:bg-violet-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {p.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-indigo-500 
                          rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{p.age} yrs</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${genderBadge(p.gender)}`}>
                        {p.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-mono text-sm">{p.mobile}</td>
                    <td className="px-6 py-4 text-gray-900 text-sm">
                      {new Date(p.registrationDate).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 
                            border border-amber-200 rounded-lg text-xs font-semibold
                            hover:bg-amber-100 transition-colors duration-150"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 
                            border border-red-200 rounded-lg text-xs font-semibold
                            hover:bg-red-100 transition-colors duration-150"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — totalPages > 1 irundha matum show */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};

export default PatientList;