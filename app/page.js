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
  const [tickets,setTickets]=useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const[showCreateTicketForm,setShowCreateTicketForm]=useState(false);
  const[showCreateProblemForm,setShowCreateProblemForm]=useState(false);
  const[openTickets,setOpenTickets]=useState([]);
  const[criticalTickets,setCriticalTickets]=useState([]);
  
  const [ticketsPage, setTicketsPage] = useState(0);//for the dynamic loading of tickets
  const [latestTicketsPage, setLatestTicketsPage] = useState(0);//for the dynamic loading of tickets

  const handleSearch = async(data)=>{
      resetAllViews();
      setSearchResults(data);
    }

        const [filtersExcel, setFiltersExcel] = useState({
    ticket_no: '',
    ticket_type: '',
    status: '',
    date_created: '',
    ext_support: '',
    resolver: '',
    requestor: ''
  });


  async function allTickets(page=0) {
      try {
        const offset=page*40;
        let res = await fetch(`/api/tickets/all?offset=${offset}&limit=40`);

        if (res.status === 500) {
          console.warn('Fetching all tickets failed. Retrying...');
          await new Promise(r => setTimeout(r, 500));
          res = await fetch('/api/tickets/all');
        }

        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();
        if (page === 0) {
          resetAllViews();
          setTickets(data);
        } else {
          setTickets(prev => [...prev, ...data]);
        }

      } catch (err) {
        console.error('Failed to fetch all tickets:', err);
        alert('Failed to load all tickets. Please try again.');
      }
  }

  async function latestTickets(page=0) {
    try{
    const offset=page*40;
    let res = await fetch(`/api/tickets/latest?offset=${offset}&limit=40`);
    
    if (res.status === 500) {
        console.warn('Fetching Latest Tickets...');
        await new Promise(r => setTimeout(r, 500));
        res = await fetch('/api/tickets/latest');
    }

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    
    const data = await res.json();

    if (page === 0) {
      resetAllViews();
      setCriticalTickets(data.criticalTickets || []);
      setOpenTickets(data.openTickets || []);
    } else {
      setCriticalTickets(prev => [...prev, ...(data.criticalTickets || [])]);
      setOpenTickets(prev => [...prev, ...(data.openTickets || [])]);
    }

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
      resetAllViews()
      setProblems(data);

    } catch (error) {
      console.error('Failed to fetch latest problems:', error);
      alert('Failed to load latest problems. Please try again.');
    }
  }


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
    setProblems((prev)=>[created, ...prev]);
    setShowCreateProblemForm(false);
  }

  const exportToExcel = async () => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filtersExcel).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(',')); // if the value of a key is an array it converts it into comma sep vals
        } else if (value && value.toString().trim() !== '') {
          queryParams.append(key, value.toString().trim());
        }
      });

      const res = await fetch(`/api/tickets/last-month?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tickets');

      const tickets = await res.json();
      exportTicketsToExcel(tickets);
    } catch (err) {
      console.error(err);
      alert('Could not export Tickets to EXCEL');
    }
  };

const filteredOpenTickets = openTickets.sort((a, b) => Number(b.ticket_no) - Number(a.ticket_no));
const filteredCriticalTickets = criticalTickets.sort((a, b) => Number(b.ticket_no) - Number(a.ticket_no));
const sortedTickets = tickets.sort((a, b) => Number(b.ticket_no) - Number(a.ticket_no));
const filteredSearchResults = searchResults.sort((a, b) => Number(b.ticket_no) - Number(a.ticket_no)).slice(0,100);

  function resetAllViews() {
    setProblems([]);
    setTickets([]);
    setSearchResults([]);
    setOpenTickets([]);
    setCriticalTickets([]);
    setShowCreateProblemForm(false);
    setShowCreateTicketForm(false);
  }

  return (
    <LoginGate>
    <main className="lg:p-10 md:p-10 p-5 lg:w-3/4 mx-auto flex flex-col justify-center items-center">
      
      <header className="mb-2 pb-2 border-b border-gray-500 text-2xl font-extrabold text-black">
          ATTICA Ticket System
      </header>

      <SearchBar onSearch={handleSearch}setFiltersExcell={setFiltersExcel}filtersExcell={filtersExcel}/>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
       <button className="bg-[#802828] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6B1F1F] transition font-bold cursor-pointer" onClick={() => {allTickets(0);setTicketsPage(0);setLatestTicketsPage(0);
      }}>
          All Tickets
        </button>
       <button className="bg-[#802828] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6B1F1F] transition font-bold cursor-pointer" onClick={() => {latestTickets(0);setLatestTicketsPage(0);setTicketsPage(0);
      }}>
          Latest Tickets
        </button>
        <button className="bg-[#802828] text-white px-5 py-2 rounded-lg shadow hover:bg-[#6B1F1F] transition font-bold cursor-pointer"onClick={latestProblems}>
          Latest Problems
        </button>
        <button className="bg-gray-300 text-[#802828] px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition font-bold cursor-pointer" onClick={() => {setShowCreateTicketForm(!showCreateTicketForm);setShowCreateProblemForm(false);setProblems([]);setOpenTickets([]);setCriticalTickets([]);setTickets([]);setSearchResults([]);}}>
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

      {(filteredOpenTickets.length > 0 || filteredCriticalTickets.length > 0) && (
        <div className="w-3/4 flex flex-col lg:flex-row justify-center items-start gap-8 mt-4 max-w-5xl mx-auto">

          {filteredOpenTickets.length > 0 && (
            <div className="w-full lg:w-1/2 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#802828] text-center">
                🆕 New
              </h2>
              <TicketTable tickets={openTickets} setTickets={setTickets}/>
            </div>
          )}

          {filteredCriticalTickets.length > 0 && (
            <div className="w-full lg:w-1/2 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#802828] text-center">
                🚨 Important
              </h2>
              <TicketTable tickets={criticalTickets} setTickets={setTickets}/>
            </div>
          )}
        </div>
      )}

        {sortedTickets.length > 0 && (
          <TicketTable tickets={sortedTickets} setTickets={setTickets} layout="grid"/>
        )}

      {problems.length > 0 && <ProblemTable problems={problems} />}

      {filteredSearchResults.length > 0 && <TicketTable tickets={filteredSearchResults} setTickets={setTickets} layout="grid"/>}

      {filteredSearchResults.length === 0 && problems.length===0&&sortedTickets.length===0&&filteredCriticalTickets.length===0&&filteredOpenTickets.length===0&&!showCreateTicketForm&&!showCreateProblemForm&&<p>No results</p>}

      {sortedTickets.length > 0 && (
        <button
          className="mt-5 bg-gray-300 text-[#802828] px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition font-bold cursor-pointer"
          onClick={() => {
            const nextPage = ticketsPage + 1;
            allTickets(nextPage);
            setTicketsPage(nextPage);
          }}
        >
          Load More
        </button>
      )}

      {(openTickets.length > 0 || criticalTickets.length > 0) && (
        <button
          className="mt-5 bg-gray-300 text-[#802828] px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition font-bold cursor-pointer"
          onClick={() => {
            const nextPage = latestTicketsPage + 1;
            latestTickets(nextPage);
            setLatestTicketsPage(nextPage);
          }}
        >
          Load More
        </button>
      )}

    </main>
    </LoginGate>
  );
}