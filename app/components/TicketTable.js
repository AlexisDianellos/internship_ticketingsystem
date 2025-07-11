'use client';
import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditTicketForm from './EditTicketForm';


export default function TicketTable({ tickets }) {
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
  };
  const handleExpand = (ticket) => {
    setExpandedTicket(ticket);
  };
  const handleClose = () => {
    setExpandedTicket(null);
  };

 const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date)) return value;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    try {
      const res = await fetch(`/api/tickets/${ticketToDelete.ticket_no}`, {
        method: 'DELETE',
        headers: {
    'Content-Type': 'application/json',
    'x-secret': process.env.NEXT_PUBLIC_API_SECRET_KEY
  },
      });
      if (res.ok) {
        setTicketToDelete(null);
      } else {
        alert('Failed to delete ticket');
      }
    } catch (error) {
      alert('Error deleting ticket');
    }
  };

  return (
    <>
      <div className="mx-auto flex flex-col justify-center items-center">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_no}
            className="bg-gray-300 p-2 shadow hover:bg-gray-400 transition w-60 border border-gray-400"
          >
            <h1 className="text-gray-800 font-bold cursor-pointer mb-5"
            onClick={() => handleExpand(ticket)}
            >{(ticket.ticket_type?.trim() === '' || ticket.ticket_type?.trim() === '-') ? 'Ticket' : ticket.ticket_type} (#{ticket.ticket_no})</h1>
            <p className="text-gray-600">{ticket.description}</p>
             <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-2">
                <IconButton 
                  aria-label="edit" 
                  sx={{ color: '#802828' /* your maroon color */ }}
                  onClick={() => handleEdit(ticket)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  aria-label="delete" 
                  sx={{ color: '#802828' /* your maroon color */ }}
                  onClick={() => setTicketToDelete(ticket)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <p className="text-sm text-black font-medium">
                {ticket.requestor || 'Unidentified'}
              </p>
              </div>
            </div>
        ))}
      </div>

      {expandedTicket && (
        <>
        <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setExpandedTicket(null)}
          />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative bg-gray-300 p-6 rounded-2xl max-w-4xl w- text-gray-500 overflow-y-auto max-h-[90vh] w-1/2">
            <button
              onClick={handleClose}
              className="absolute top-4 right-6 text-[#802828] cursor-pointer p-4"
            >
              X
            </button>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(expandedTicket)
                .filter(([key]) => key !== 'created_at')
                .map(([key, value]) => (
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

      {editingTicket && (
        <EditTicketForm ticket={editingTicket} setEditingTicket={setEditingTicket} />
      )}

      {ticketToDelete && (
        <>
          <div
            className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setTicketToDelete(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gray-300 p-6 rounded-2xl max-w-md text-gray-200 w-full max-h-[90vh]">
              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Are you sure you want to delete ticket #{ticketToDelete.ticket_no}?
              </h2>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="bg-[#802828] px-4 py-2 rounded text-white cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setTicketToDelete(null)}
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
