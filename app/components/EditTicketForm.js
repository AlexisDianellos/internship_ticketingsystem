'use client';
import React from 'react';

export default function EditTicketForm({ ticket, setEditingTicket }) {
  
  const selectOptions={
  ticket_type : ['Problem', 'User mgm', 'Request'],
  status : ['Open', 'Open External', 'Closed'],
  severity : ['1-Critical', '2-Important', '3-Basic'],
  shop : ['CityLink', 'Cosmos', 'E-shop', 'Golden', 'Mall', 'Paiania', 'Amerikis', 'Valaoritou', 'Tsimiski', 'ola'],
};
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    
    if (!ticket || Object.keys(ticket).length === 0) {
    alert('No ticket data to send.');
    return;
    }
    
    const res = await fetch('/api/tickets/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json',
    'x-secret': process.env.NEXT_PUBLIC_API_SECRET_KEY
      },
      body: JSON.stringify(ticket),
    });

    if (res.ok) {
      setEditingTicket(null);
    } else {
      alert('Failed to update ticket');
    }
  };

  const formatDateForInput = (date) => {
  if (!date) return '';

  // If it's already in yyyy-mm-dd format
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

  const d = new Date(date);
  if (isNaN(d)) return '';

  // Extract local YYYY-MM-DD directly (not via toISOString)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}




  return (
    <>
      <div
        className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm z-40"
        onClick={() => setEditingTicket(null)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-300 p-6 rounded-2xl w-1/2 text-black overflow-y-auto max-h-[90vh]"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Edit Ticket</h2>
          <button
            type="button"
            onClick={() => setEditingTicket(null)}
            className="absolute top-4 right-6 text-red-400 cursor-pointer"
          >
            X
          </button>

          {Object.entries(ticket).map(([key, value]) => {
  if (key === 'created_at' || key === 'ticket_no') return null;

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
      ) : (
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
