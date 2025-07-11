'use client';

import { useState } from 'react';
import TicketTable from './components/TicketTable';
import ProblemTable from './components/ProblemTable';
import CreateTicketForm from './components/CreateTicketForm';
import CreateProblemForm from './components/CreateProblemForm';
import SearchBar from './components/SearchBar';
import LoginGate from './login/page';
import { exportTicketsToExcel } from '@/lib/exportToExcel';

export default function HomePage() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [tickets,setTickets]=useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const[showCreateTicketForm,setShowCreateTicketForm]=useState(false);
  const[showCreateProblemForm,setShowCreateProblemForm]=useState(false);
  const[openTickets,setOpenTickets]=useState([]);
  const[criticalTickets,setCriticalTickets]=useState([]);

  const handleSearch = async(data)=>{
    setSearchResults(data);
    setProblems([]);
    setTickets([]);
    setOpenTickets([]);
    setCriticalTickets([]);
  }

async function allTickets() {
  try {
    let res = await fetch('/api/tickets/all');

    if (res.status === 500) {
      console.warn('Fetching all tickets failed. Retrying...');
      await new Promise(r => setTimeout(r, 500));
      res = await fetch('/api/tickets/all');
    }

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const data = await res.json();

    console.log("All tickets from backend:", data);
    setTickets(data);
    setProblems([]);
    setSearchResults([]);
    setCriticalTickets([]);
    setOpenTickets([]);
    setShowCreateProblemForm(false);
    setShowCreateTicketForm(false);
  } catch (err) {
    console.error('Failed to fetch all tickets:', err);
    alert('Failed to load all tickets. Please try again.');
  }
}

  async function latestTickets() {
  try{
  
  let res = await fetch('/api/tickets/latest');
  
  if (res.status === 500) {
      console.warn('Fetching Latest Tickets...');
      await new Promise(r => setTimeout(r, 500));
      res = await fetch('/api/tickets/latest');
    }
  if (!res.ok) {
    throw new Error(`Fetch failed with status ${res.status}`);
    }
  
  const data = await res.json();
  console.log("Latest tickets from backend:", data);
  setCriticalTickets(data.criticalTickets || []);
  setOpenTickets(data.openTickets || []);
  setProblems([]);
  setSearchResults([]);
  setShowCreateProblemForm(false);
  setShowCreateTicketForm(false);
  setTickets([]);
  }catch (error) {
    console.error('Failed to fetch latest tickets:', error);
    alert('Failed to load latest tickets. Please try again.');
  }
}

async function latestProblems() {

  try {
    let res = await fetch('/api/problems/latest');

    if (res.status === 500) {
      console.warn('First fetch failed with 500, retrying...');
      await new Promise(r => setTimeout(r, 500));
      res = await fetch('/api/problems/latest');
    }

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    setProblems(data);
    setTickets([]);
    setSearchResults([]);
    setShowCreateProblemForm(false);
    setShowCreateTicketForm(false);
    setOpenTickets([]);
    setCriticalTickets([]);

  } catch (error) {
    console.error('Failed to fetch latest problems:', error);
    alert('Failed to load latest problems. Please try again.');
  }}


async function createTicket(newTicket) {
  const res = await fetch('/api/tickets/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTicket),
  });

  if (!res.ok) throw new Error('Failed to create ticket');

  const created = await res.json();
  setTickets((prev) => [created, ...prev]);
  setShowCreateTicketForm(false);
}


async function createProblem(newProblem) {
  const res = await fetch('/api/problems/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProblem),
  });
  if (!res.ok) throw new Error('Failed to create problem');
  
  const created = await res.json();
  setShowCreateProblemForm(false);
}

const exportToExcel=async()=>{
  try{
    const res=await fetch('/api/tickets/last-month');
    if(!res.ok)throw new Error('Failed to fetch tickets');

    const tickets = await res.json();
    exportTicketsToExcel(tickets);
  }catch(err){
    console.error(err);
    alert('Could not export Tickets to EXCEL');
  }
}

const filteredOpenTickets = openTickets.filter(ticket =>
  ticket.ticket_no.toString().includes(search) ||
  ticket.problem?.toLowerCase().includes(search.toLowerCase()) ||
  ticket.status.toLowerCase().includes(search.toLowerCase())
).sort((a, b) => Number(b.ticket_no) - Number(a.ticket_no));


  const filteredSearchResults = searchResults.filter(ticket =>
  ticket.ticket_no.toString().includes(search) ||
  ticket.problem?.toLowerCase().includes(search.toLowerCase()) ||
  ticket.status.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => Number(b.ticket_no) - Number(a.ticket_no))
  .slice(0, 10);

  return (
    <LoginGate>
    <main className="lg:p-10 md:p-10 p-5 lg:w-3/4 mx-auto flex flex-col justify-center items-center">
      <header className="mb-2 pb-2 border-b border-gray-500 text-2xl font-extrabold text-black">
          ATTICA Ticket System
      </header>
      <SearchBar onSearch={handleSearch}/>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
       <button className="bg-[#802828] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6B1F1F] transition font-bold cursor-pointer" onClick={allTickets}>
          All Tickets
        </button>
       <button className="bg-[#802828] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6B1F1F] transition font-bold cursor-pointer" onClick={latestTickets}>
          Latest Tickets
        </button>
        <button className="bg-[#802828] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6B1F1F] transition font-bold cursor-pointer"onClick={latestProblems}>
          Latest Problems
        </button>
        <button className="bg-gray-300 text-[#802828] px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition font-bold cursor-pointer" onClick={() => {setShowCreateTicketForm(!showCreateTicketForm);setShowCreateProblemForm(false);setProblems([]);setOpenTickets([]);setCriticalTickets([]);setTickets([]);}}>
          Create Ticket
        </button>
        <button className="bg-gray-300 text-[#802828] px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition font-bold cursor-pointer" onClick={() => {setShowCreateProblemForm(!showCreateProblemForm); setShowCreateTicketForm(false);setProblems([]);setOpenTickets([]);setCriticalTickets([]);}}>
          Create Problem
        </button>
        <button className="bg-gray-300 text-[#802828] px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition font-bold cursor-pointer" onClick={(exportToExcel)}>Export to EXCEL</button>
      </div>

      {showCreateTicketForm&&<CreateTicketForm onCreate={createTicket} showCreateTicketForm={showCreateTicketForm}
      setShowCreateTicketForm={setShowCreateTicketForm}/>
      }

      {showCreateProblemForm&&<CreateProblemForm onCreate={createProblem} showCreateProblemForm={showCreateProblemForm}
      setShowCreateProblemForm={setShowCreateProblemForm}/>}

      {(filteredOpenTickets.length > 0 || criticalTickets.length > 0) && (
        <div className="w-3/4 flex flex-col lg:flex-row justify-center items-start gap-8 mt-4 max-w-5xl mx-auto">

          
          {filteredOpenTickets.length > 0 && (
            <div className="w-full lg:w-1/2 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#802828] text-center">
                🆕 New
              </h2>
              <TicketTable tickets={openTickets} />
            </div>
          )}

          {criticalTickets.length > 0 && (
            <div className="w-full lg:w-1/2 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#802828] text-center">
                🚨 Important
              </h2>
              <TicketTable tickets={criticalTickets} />
            </div>
          )}
        </div>
      )}

      {problems.length > 0 && <ProblemTable problems={problems} />}
      {filteredSearchResults.length > 0 && <TicketTable tickets={filteredSearchResults} />} 

      {tickets.length > 0 && (
        <TicketTable tickets={tickets} />
      )}


    </main>
    </LoginGate>
  );
}
