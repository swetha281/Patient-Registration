import React, { useState, useEffect } from 'react';
import { updatePatient } from '../services/api';
import { toast } from 'react-toastify';

const EditPatient = ({ patient, onClose, onUpdated }) => {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', mobile: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      mobile: patient.mobile
    });
    setErrors({});
  }, [patient]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is mandatory';
    if (!form.age || Number(form.age) < 0 || Number(form.age) > 120)
      e.age = 'Age must be between 0 and 120';
    if (!/^\d{10}$/.test(form.mobile))
      e.mobile = 'Mobile must be 10 digits';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setLoading(true);
    try {
      await updatePatient(patient._id, form);
      toast.success('Patient updated successfully!');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error updating patient');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (err) => `w-full px-4 py-2.5 rounded-xl border-2 
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} 
    focus:outline-none focus:border-violet-500 focus:bg-white 
    transition-all duration-200 text-gray-700`;

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 
            rounded-xl flex items-center justify-center text-white text-lg">
            ✏️
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Edit Patient</h3>
            <p className="text-sm text-amber-500 font-medium">{patient?.patientId}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full 
            flex items-center justify-center text-gray-500 transition-colors"
        >✕</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Patient Name <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass(errors.name)}
              value={form.name}
              onChange={e => {
                const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setForm({ ...form, name: val });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Age <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className={inputClass(errors.age)}
              value={form.age}
              onChange={e => {
                setForm({ ...form, age: e.target.value });
                if (errors.age) setErrors({ ...errors, age: undefined });
              }}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">⚠️ {errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Gender</label>
            <select
              className={inputClass(false)}
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass(errors.mobile)}
              value={form.mobile}
              onChange={e => {
                setForm({ ...form, mobile: e.target.value });
                if (errors.mobile) setErrors({ ...errors, mobile: undefined });
              }}
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">⚠️ {errors.mobile}</p>}
          </div>

        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 
              text-white font-semibold rounded-xl shadow-md hover:shadow-lg
              active:scale-95 transition-all duration-200 disabled:opacity-60
              flex items-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>Updating...</>
            ) : ' Update Patient'}
          </button>
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-600 font-semibold 
              rounded-xl hover:bg-gray-200 transition-colors duration-200">
             Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;