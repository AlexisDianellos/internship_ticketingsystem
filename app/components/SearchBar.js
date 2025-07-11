'use client';
import { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';

export default function SearchBar({ onSearch }) {
  const [infoShow, setInfoShow] = useState(false);

  const [filters, setFilters] = useState({
    ticket_no: '',
    ticket_type: '',
    status: '',
    date_created: '',
    ext_support: ''
  });

  const [openFilters, setOpenFilters] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

  const handleAdvancedSearch = async () => {
    try{
    const queryString = Object.entries(filters)
  .filter(([_, value]) => value)
  .map(([key, value]) => {
    if (key === 'date_created') {
      value = formatDateToDDMMYYYY(value);
    }
    return `${key}=${encodeURIComponent(value)}`;
  })
  .join('&');

    const res = await fetch(`/api/tickets/search?${queryString}`,{method:'GET',headers: {
    'Content-Type': 'application/json',
    'x-secret': process.env.NEXT_PUBLIC_API_SECRET_KEY
  },});

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('Search results from backend:', data); 
    onSearch(data);
    }catch(err){
      console.error('Advanced Search error: ',err.message);
      alert('Advanced Search Failed')
    }
  };

  return (
    <div className="w-full max-w-xl lg:mb-15 md:mb-15 mb-8 relative z-10">
      {/*ADVANCED FILTERS BUTTON*/}
      <div className="flex justify-center font-bold relative">
        <button
          onClick={() => setOpenFilters(!openFilters)}
          className="text-sm text-teal-700 cursor-pointer"
        >
          {openFilters ? 'Hide Advanced Search Filters' : 'Show Advanced Search Filters'}
        </button>

      <InfoIcon
        fontSize="small"
        className="absolute right-40 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
        onClick={() => setInfoShow(true)}
      />
      </div>

      {/* ADVANCED FILTERS */}
      <div
        className={`transition-all duration-300 ${
          openFilters ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
          <input
            type="text"
            name="ticket_no"
            placeholder="Ticket Number"
            value={filters.ticket_no}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="ticket_type"
            value={filters.ticket_type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">-- Ticket Type --</option>
            <option value="Problem">Problem</option>
            <option value="User mgm">User mgm</option>
            <option value="Request">Request</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">-- Status --</option>
            <option value="Open">Open</option>
            <option value="Open External">Open External</option>
            <option value="Closed">Closed</option>
          </select>

          <input
            type="date"
            name="date_created"
            value={filters.date_created}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="ext_support"
            placeholder="External Support"
            value={filters.ext_support}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={handleAdvancedSearch}
          className="bg-[#802828] text-white px-6 py-2 cursor-pointer rounded-lg m-2"
        >
          Search
        </button>
      </div>
  
      {infoShow && (
        <>
          <div
            className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setInfoShow(false)}
          />
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-400 text-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-[90%]">
            <p className="text-md p-3">
              Search for <strong>tickets</strong> by number (ex.1,2,100,56), ticket type, date created (e.g. 26/06/2025), status, supplier and more.
            </p>
          </div>
        </>
      )}

    </div>
  );
}
