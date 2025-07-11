'use client';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditProblemForm from './EditProblemForm';

export default function ProblemTable({ problems }) {
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState(null);

  const handleExpand = (problem) => {
    setExpandedProblem(problem);
  };

  const handleClose = () => {
    setExpandedProblem(null);
  };

  const formatDate = (value) => {
    if (!value || typeof value !== 'string') return '-';
    const date = new Date(value);
    if (isNaN(date)) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const confirmDelete = async () => {
    if (!problemToDelete) return;
    try {
      const res = await fetch(`/api/problems/${problemToDelete.problem_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProblemToDelete(null);
      } else {
        alert('Failed to delete problem');
      }
    } catch (error) {
      alert('Error deleting Problem');
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
  };

  return (
    <>
      <div className="mx-auto flex flex-col justify-center items-center">
        {problems.map((problem) => (
          <div
            key={problem.problem_id}
            className="bg-gray-300 p-2 shadow hover:bg-gray-400 transition w-60 border border-gray-400"
          >
            <h1
              className="text-gray-800 font-bold cursor-pointer mb-5"
              onClick={() => handleExpand(problem)}
            >
              Problem (#{problem.problem_id})
            </h1>
            <p className="text-gray-600">{problem.problem_description}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-2">
                <IconButton
                  aria-label="edit"
                  sx={{ color: '#802828' }}
                  onClick={() => handleEdit(problem)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  sx={{ color: '#802828' }}
                  onClick={() => setProblemToDelete(problem)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <p className="text-sm text-black font-medium">
                {problem.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {expandedProblem && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gray-300 p-6 rounded-2xl max-w-4xl text-gray-500 overflow-y-auto max-h-[90vh] w-1/2">
              <button
                onClick={handleClose}
                className="absolute top-4 right-6 text-[#802828] cursor-pointer p-4"
              >
                X
              </button>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(expandedProblem).map(([key, value]) => (
                  <div key={key}>
                    <strong className="text-[#802828]">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                    </strong>
                    <div>
                      {key.includes('date') ? formatDate(value) : value || '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {editingProblem && (
        <EditProblemForm problem={editingProblem} setEditingProblem={setEditingProblem} />
      )}

      {problemToDelete && (
        <>
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setProblemToDelete(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gray-300 p-6 rounded-2xl max-w-md text-gray-900 w-full max-h-[90vh]">
              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Are you sure you want to delete problem #{problemToDelete.problem_id}?
              </h2>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="bg-[#802828] px-4 py-2 rounded text-white cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setProblemToDelete(null)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
