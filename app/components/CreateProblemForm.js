'use client';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AutoCompleteDropdown from './AutoCompleteComponent';

export default function CreateProblemForm({ onCreate,showCreateProblemForm,setShowCreateProblemForm}) {
  
  const statusOptions = ['Open', 'Closed', 'In Progress'];
  
  const [problem, setProblem] = useState({
    id: '',
    problem_description: '',
    date_started: '',
    date_closed: null,
    status: '',
    type: '',
    impact: '',
    ext_support: '',
    comments: '',
  });

  
  const problemImpact = [
    "High",
    "Med",
    "Low"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(problem);
    setProblem({
       id: '',
      problem_description: '',
      date_started: '',
      date_closed: null,
      status: '',
      type: '',
      impact: '',
      ext_support: '',
      comments: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-300 p-6 rounded-2xl lg:w-1/2 md:w-1/2 text-black space-y-7 relative mb-5">
      <IconButton color="red" onClick={()=>{setShowCreateProblemForm(!setShowCreateProblemForm)}}
        style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
        <CloseIcon sx={{ fontSize: 28 }}/>
      </IconButton>

      <h2 className="text-xl font-bold text-center p-5 pt-15">Create New Problem</h2>

      {Object.entries(problem).map(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={key}>

            {key === 'status' ? (
              <select
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              >
                <option value="">Select status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ):key==='impact'?(
               <select
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              >
                <option value="">Select Impact</option>
                {problemImpact.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : key === 'date_started' || key === 'date_closed' ? (
              <input
                type="date"
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border border-gray-400 rounded bg-gray-400"
              />
            ): key === 'ext_support' ? (
              <AutoCompleteDropdown
                type="extsupport"
                value={value}
                onChange={(val) => setTicket((prev) => ({ ...prev, [key]: val }))}
              />):(
              <input
                type="text"
                id={key}
                name={key}
                value={value}
                placeholder={label}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              />
            )}
          </div>
        );
      })}
      <div className='flex justify-center p-2'>
      <button type="submit" className="bg-[#802828] text-green-100 px-4 py-2 rounded cursor-pointer">
        Submit Problem
      </button>
      </div>
    </form>
  );
}
