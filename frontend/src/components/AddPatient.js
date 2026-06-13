import React, { useState } from 'react';
import { addPatient } from '../services/api';
import { toast } from 'react-toastify';

const AddPatient = ({ onPatientAdded }) => {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', mobile: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      await addPatient({
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        mobile: form.mobile,
      });
      toast.success('Patient added successfully!');
      setForm({ name: '', age: '', gender: 'Male', mobile: '' });
      setErrors({});
      setIsOpen(false);
      onPatientAdded();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding patient');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: '', age: '', gender: 'Male', mobile: '' });
    setErrors({});
    setIsOpen(false);
  };

  const inputClass = (err) =>
    `w-full px-4 py-2.5 rounded-xl border-2 
    ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} 
    focus:outline-none focus:border-violet-500 focus:bg-white 
    transition-all duration-200 text-gray-700`;

  return (
    <div className="mb-6">
      {/* Toggle Button — shown when form is collapsed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-3 
            bg-gradient-to-r from-violet-500 to-purple-600 
            text-white font-semibold rounded-2xl shadow-md 
            hover:shadow-lg hover:from-violet-600 hover:to-purple-700 
            active:scale-95 transition-all duration-200"
        >
          <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-base">
            ➕
          </span>
          Add New Patient
        </button>
      )}

      {/* Expandable Form Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-violet-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 
                rounded-xl flex items-center justify-center text-white text-lg">
                🧑‍⚕️
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">New Patient Registration</h3>
                <p className="text-sm text-violet-500 font-medium">Fill in the details below</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full 
                flex items-center justify-center text-gray-500 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Patient Name <span className="text-red-400">*</span>
                </label>
                <input
                  placeholder="e.g. Rahul Sharma"
                  className={inputClass(errors.name)}
                  value={form.name}
                  onChange={e => {
                    // Allow only letters and spaces
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setForm({ ...form, name: val });
                    // Clear error as soon as user types
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0 – 120"
                  className={inputClass(errors.age)}
                  value={form.age}
                  onChange={e => {
                    setForm({ ...form, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: undefined });
                  }}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {errors.age}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Gender
                </label>
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
                  placeholder="10-digit number"
                  className={inputClass(errors.mobile)}
                  value={form.mobile}
                  onChange={e => {
                    setForm({ ...form, mobile: e.target.value });
                    if (errors.mobile) setErrors({ ...errors, mobile: undefined });
                  }}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 
                  text-white font-semibold rounded-xl shadow-md hover:shadow-lg
                  active:scale-95 transition-all duration-200 disabled:opacity-60
                  flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  ' Add Patient'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 font-semibold 
                  rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                 Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddPatient;