'use client';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function CreateTicketForm({
  onCreate,
  showCreateTicketForm,
  setShowCreateTicketForm
}) {
  const examples = {
    ticket_no: 'eg. 1 - Check current ticket number',
    period: 'eg. 202506',
    date_created: 'eg. 2025-06-26',
    date_closed: 'eg. 2025-07-01',
    external_supplier: 'eg. Singular etc. - if needed',
    problem_id: 'eg. 1 - Look at problems - if needed',
    requestor: 'eg. Alexandros Dianellos',
    floor: 'eg. 1st',
    area_corner: 'eg. Designer shoes, Armani etc.',
    problem: 'eg. SW/HW',
    hardware: 'eg. Phone device/CCTV',
    hardware_vendor: 'eg. Dell/HP',
    software: 'eg. Email/ProfitRMS etc.',
    resolver: 'eg. Alexandros Dianellos',
    description: 'Χάλασε ο εκτυπωτής',
  };

  const ticketType = ['Problem', 'User mgm', 'Request'];
  const statusOptions = ['Open', 'Open External', 'Closed'];
  const severityOptions = ['1-Critical', '2-Important', '3-Basic'];
  const shopOptions = ['CityLink', 'Cosmos', 'E-shop', 'Golden', 'Mall', 'Paiania', 'Amerikis', 'Valaoritou', 'Tsimiski', 'ola'];

  const requiredFields = ['ticket_no', 'ticket_type', 'severity', 'shop', 'period', 'requestor'];

  const [ticket, setTicket] = useState({
    ticket_no: '',
    period: '',
    ticket_type: '',
    date_created: '',
    date_closed: '',
    status: '',
    external_supplier: '',
    problem_id: '',
    requestor: '',
    severity: '',
    shop: '',
    floor: '',
    area_corner: '',
    problem: '',
    hardware: '',
    hardware_vendor: '',
    software: '',
    resolver: '',
    description: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Required field validation
    const missing = requiredFields.filter((key) => !ticket[key]?.trim());
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }

    if (!ticket.ticket_no || Number(ticket.ticket_no) < 24500) {
    setError('Ticket number already exists.');
    return;
    }

    const preparedTicket = {
      ...ticket,
      problem_id: ticket.problem_id === '' ? null : ticket.problem_id,
      date_closed: ticket.date_closed === '' ? null : ticket.date_closed,
    };

    await onCreate(preparedTicket);

    // Reset form
    setTicket({
      ticket_no: '',
      period: '',
      ticket_type: '',
      date_created: '',
      date_closed: '',
      status: '',
      external_supplier: '',
      problem_id: '',
      requestor: '',
      severity: '',
      shop: '',
      floor: '',
      area_corner: '',
      problem: '',
      hardware: '',
      hardware_vendor: '',
      software: '',
      resolver: '',
      description: '',
    });
  };

  return (
    <>
    <div className="max-w-[20.5rem] mb-2 text-red-700 font-semibold text-center">
        {error}
      </div>
    <form
      onSubmit={handleSubmit}
      className="bg-gray-300 p-6 rounded mb-6 text-black space-y-7 lg:w-1/2 md:w-1/2 relative"
    >
      <h2 className="text-xl font-bold text-center p-5 pt-15">Create New Ticket</h2>

      <IconButton
        color="red"
        onClick={() => setShowCreateTicketForm(!showCreateTicketForm)}
        style={{ position: 'absolute', top: '1rem', right: '1rem' }}
      >
        <CloseIcon sx={{ fontSize: 28 }} />
      </IconButton>

      {Object.entries(ticket).map(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        const isRequired = requiredFields.includes(key);

        return (
          <div key={key}>
            <label htmlFor={key} className="block mb-1 text-sm font-medium">
              {label}{isRequired ? ' *' : ''}
            </label>

            {key === 'ticket_type' ? (
              <select
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              >
                <option value="">Select ticket type</option>
                {ticketType.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : key === 'status' ? (
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
            ) : key === 'severity' ? (
              <select
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              >
                <option value="">Select severity</option>
                {severityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : key === 'shop' ? (
              <select
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              >
                <option value="">Select shop</option>
                {shopOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : key === 'date_created' || key === 'date_closed' ? (
              <input
                id={key}
                type="date"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full p-2 border border-gray-400 rounded bg-gray-400"
              />
            ) : (
              <input
                id={key}
                type="text"
                name={key}
                value={value}
                placeholder={examples[key] || label}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-400"
              />
            )}
          </div>
        );
      })}

      <div className="flex justify-center p-2">
        <button
          type="submit"
          className="bg-[#802828] text-green-100 px-4 py-2 rounded cursor-pointer"
        >
          Submit Ticket
        </button>
      </div>
    </form>
    </>
  );
}
