'use client';

import React from 'react';

export default function EditProblemForm({ problem, setEditingProblem }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProblem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const res = await fetch('/api/problems/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    });

    if (res.ok) {
      setEditingProblem(null);
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
          className="relative bg-gray-900 p-6 rounded-2xl w-1/2 text-gray-300 overflow-y-auto max-h-[90vh]"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Edit Problem</h2>
          <button
            type="button"
            onClick={() => setEditingProblem(null)}
            className="absolute top-4 right-6 text-red-400 cursor-pointer"
          >
            X
          </button>

          {Object.entries(problem).map(([key, value]) => {
            // Exclude problem_id from editable fields
            if (key === 'problem_id') return null;

            const label = key
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

            return (
              <div key={key} className="mb-4">
                <label htmlFor={key} className="block text-sm mb-1">
                  {label}
                </label>
                <input
                  id={key}
                  name={key}
                  type={key.includes('date') ? 'date' : 'text'}
                  value={key.includes('date') ? formatDateForInput(value) : value || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-700 rounded bg-gray-800"
                />
              </div>
            );
          })}

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
