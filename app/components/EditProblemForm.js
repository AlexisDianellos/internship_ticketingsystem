'use client';
import React from 'react';
import AutoCompleteDropdown from './AutoCompleteComponent';

export default function EditProblemForm({ problem, setEditingProblem,onEditSave }) {
  
  const selectOptions = {
    status: ['Open', 'Closed', 'In Progress'],
    impact: ['High', 'Med', 'Low'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProblem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problem || Object.keys(problem).length === 0) {
      alert('No problem data to send.');
      return;
    }

    const res = await fetch('/api/problems/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    });

    if (res.ok) {
      setEditingProblem(null);
      onEditSave(problem);
    } else {
      alert('Failed to update problem');
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = new Date(date);
    if (isNaN(d)) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm z-40"
        onClick={() => setEditingProblem(null)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-300 p-6 rounded-2xl w-1/2 text-black overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4 text-center">Edit Problem</h2>
          <button
            type="button"
            onClick={() => setEditingProblem(null)}
            className="absolute top-4 right-6 text-red-400 cursor-pointer">X
          </button>

          {Object.entries(problem).map(([key, value]) => {
            if (key === 'problem_id') return null;

            const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            const isDateField = key.includes('date');
            const isDropdown = Object.keys(selectOptions).includes(key);

            return (
              <div key={key} className="mb-4">
                <label htmlFor={key} className="block text-sm mb-1">
                  {label}
                </label>

                {isDropdown ? (
                  <select
                    id={key}
                    name={key}
                    value={value || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-400 rounded bg-gray-400"
                  >
                    <option value="">Select {label}</option>
                    {selectOptions[key].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) :key==='ext_support'?(
                  <AutoCompleteDropdown
                    type="extsupport"
                    value={value || ''}
                    onChange={(val) =>
                      setEditingProblem((prev) => ({ ...prev, [key]: val }))
                    }
                  /> 
                ): (
                  <input
                    id={key}
                    name={key}
                    type={isDateField ? 'date' : 'text'}
                    value={isDateField ? formatDateForInput(value) : value || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-400 rounded bg-gray-400"
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#802828] text-white px-4 py-2 rounded cursor-pointer mt-3"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
