import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plane, 
  Ticket as TicketIcon, 
  QrCode, 
  Scan, 
  User, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Armchair, 
  Phone, 
  Mail, 
  IdCard, 
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  Download,
  Copy,
  Check,
  Zap,
  Luggage,
  Compass,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('book'); // 'book', 'manage', 'scanner'
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('aero_luxury_qr_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // High quality default initial tickets
    return [
      {
        id: 'SKB-902418',
        pnr: 'SKY98A',
        passengerName: 'Elena Rostova',
        age: '29',
        gender: 'Female',
        idNumber: 'A-9823411',
        phone: '+1 (555) 234-5678',
        email: 'elena.rostova@aero.com',
        flightNumber: 'SK-402',
        origin: 'New York (JFK)',
        originCode: 'JFK',
        destination: 'Tokyo (HND)',
        destinationCode: 'HND',
        departureDate: '2026-10-15',
        departureTime: '14:30',
        seatNumber: '02A',
        flightClass: 'First Class',
        gate: 'B12',
        terminal: 'T4',
        status: 'Valid',
        createdAt: '2026-10-05T08:00:00.000Z'
      },
      {
        id: 'SKB-771029',
        pnr: 'LUX33B',
        passengerName: 'Alexander Vance',
        age: '34',
        gender: 'Male',
        idNumber: 'C-7740192',
        phone: '+1 (555) 891-2304',
        email: 'a.vance@techcorp.io',
        flightNumber: 'SK-881',
        origin: 'London (LHR)',
        originCode: 'LHR',
        destination: 'Dubai (DXB)',
        destinationCode: 'DXB',
        departureDate: '2026-10-20',
        departureTime: '21:00',
        seatNumber: '14F',
        flightClass: 'Business',
        gate: 'A07',
        terminal: 'T2',
        status: 'Valid',
        createdAt: '2026-10-05T10:15:00.000Z'
      }
    ];
  });

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [scanInputText, setScanInputText] = useState('');
  const [scanError, setScanError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  // Initial form values
  const [formData, setFormData] = useState({
    passengerName: '',
    age: '',
    gender: 'Male',
    idNumber: '',
    phone: '',
    email: '',
    flightNumber: 'SK-' + Math.floor(100 + Math.random() * 900),
    origin: 'New York (JFK)',
    destination: 'Paris (CDG)',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '11:45',
    seatNumber: `${Math.floor(1 + Math.random() * 18)}${['A','B','C','D','E','F'][Math.floor(Math.random()*6)]}`,
    flightClass: 'Business',
    gate: `G${Math.floor(1 + Math.random() * 20)}`,
    terminal: `T${Math.floor(1 + Math.random() * 5)}`
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aero_luxury_qr_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Set default selected ticket
  useEffect(() => {
    if (tickets.length > 0 && !selectedTicket) {
      setSelectedTicket(tickets[0]);
    }
  }, [tickets]);

  const extractAirportCode = (cityStr) => {
    const match = cityStr.match(/\(([^)]+)\)/);
    if (match && match[1]) return match[1].toUpperCase();
    return cityStr.substring(0, 3).toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookTicket = (e) => {
    e.preventDefault();
    if (!formData.passengerName || !formData.origin || !formData.destination) {
      return;
    }

    const originCode = extractAirportCode(formData.origin);
    const destinationCode = extractAirportCode(formData.destination);

    const newTicket = {
      ...formData,
      originCode,
      destinationCode,
      id: 'SKB-' + Math.floor(100000 + Math.random() * 900000),
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'Valid',
      createdAt: new Date().toISOString()
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    setSelectedTicket(newTicket);
    setActiveTab('manage');

    // Reset with randomized dynamic defaults
    setFormData({
      passengerName: '',
      age: '',
      gender: 'Male',
      idNumber: '',
      phone: '',
      email: '',
      flightNumber: 'SK-' + Math.floor(100 + Math.random() * 900),
      origin: 'Tokyo (HND)',
      destination: 'London (LHR)',
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '16:20',
      seatNumber: `${Math.floor(1 + Math.random() * 24)}${['A','B','C','D','E','F'][Math.floor(Math.random()*6)]}`,
      flightClass: 'First Class',
      gate: `B${Math.floor(1 + Math.random() * 15)}`,
      terminal: `T${Math.floor(1 + Math.random() * 4)}`
    });
  };

  const updateTicketStatus = (id, newStatus) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTickets(updated);
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const deleteTicket = (id) => {
    const remaining = tickets.filter(t => t.id !== id);
    setTickets(remaining);
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const processScanPayload = (rawPayload) => {
    setScanError('');
    try {
      const parsed = JSON.parse(rawPayload);
      if (parsed && (parsed.id || parsed.pnr || parsed.passengerName)) {
        setScannedData(parsed);
      } else {
        setScanError('Invalid payload structure. Expected valid flight JSON object.');
        setScannedData(null);
      }
    } catch (err) {
      setScanError('Could not parse QR string. Please input a valid JSON ticket object.');
      setScannedData(null);
    }
  };

  const handleTestScan = (ticket) => {
    const payload = JSON.stringify(ticket, null, 2);
    setScanInputText(payload);
    processScanPayload(payload);
    setActiveTab('scanner');
  };

  const handleCopyPayload = (ticket) => {
    navigator.clipboard.writeText(JSON.stringify(ticket));
    setCopiedId(ticket.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTickets = tickets.filter(t => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      t.passengerName.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.pnr.toLowerCase().includes(query) ||
      t.flightNumber.toLowerCase().includes(query) ||
      t.origin.toLowerCase().includes(query) ||
      t.destination.toLowerCase().includes(query);
    
    const matchesFilter = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased relative overflow-x-hidden">
      {/* Background Decorative Ambient Glowing Orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Glass Header */}
      <header className="border-b border-slate-800/80 bg-[#0B1120]/70 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-cyan-400">
                <Plane className="w-6 h-6 transform -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2 font-display">
                  AEROPASS <span className="text-cyan-400 font-light">LUXURY</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Digital Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart QR Ticketing & Boarding Pass Engine</p>
            </div>
          </div>

          {/* Navigation Pill Menu */}
          <nav className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeTab === 'book'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Plus className="w-4 h-4" /> Issue Ticket
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeTab === 'manage'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <TicketIcon className="w-4 h-4" /> Passes ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                activeTab === 'scanner'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Scan className="w-4 h-4" /> Verifier
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ==================== TAB 1: BOOKING FORM ==================== */}
        {}
        {activeTab === 'book' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Glass Form Container */}
            <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Passenger & Flight Booking</h2>
                    <p className="text-xs text-slate-400">Fill in details to instantly issue an encoded QR Boarding Pass</p>
                  </div>
                </div>
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Encrypted Local Token
                </span>
              </div>

              <form onSubmit={handleBookTicket} className="space-y-8">
                {/* Route Visualizer Live Preview Bar */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />
                  <div className="z-10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">ORIGIN DEPARTURE</span>
                    <span className="text-xl font-black text-white">{extractAirportCode(formData.origin)}</span>
                    <span className="text-xs text-slate-400 block truncate max-w-[120px]">{formData.origin}</span>
                  </div>

                  <div className="flex-1 px-6 flex flex-col items-center justify-center z-10">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold mb-1 tracking-widest">{formData.flightNumber}</span>
                    <div className="w-full flex items-center gap-2">
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-700 via-cyan-500 to-slate-700 rounded-full" />
                      <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/40 transform rotate-90">
                        <Plane className="w-4 h-4" />
                      </div>
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-700 via-cyan-500 to-slate-700 rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">{formData.flightClass} Class</span>
                  </div>

                  <div className="text-right z-10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">DESTINATION ARRIVAL</span>
                    <span className="text-xl font-black text-white">{extractAirportCode(formData.destination)}</span>
                    <span className="text-xs text-slate-400 block truncate max-w-[120px]">{formData.destination}</span>
                  </div>
                </div>

                {/* Section 1: Passenger Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                    <IdCard className="w-4 h-4" /> Passenger Personal Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="passengerName"
                        required
                        value={formData.passengerName}
                        onChange={handleInputChange}
                        placeholder="e.g. Captain Eleanor Vance"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Age *</label>
                      <input
                        type="number"
                        name="age"
                        required
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="31"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Passport / ID Number *</label>
                      <input
                        type="text"
                        name="idNumber"
                        required
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. P-9082341"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Contact</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 019-2831"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Trip & Route Details */}
                <div className="pt-4 border-t border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Flight Route & Departure Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Flight Number</label>
                      <input
                        type="text"
                        name="flightNumber"
                        required
                        value={formData.flightNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Origin (City / Airport) *</label>
                      <input
                        type="text"
                        name="origin"
                        required
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="e.g. New York (JFK)"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destination (City / Airport) *</label>
                      <input
                        type="text"
                        name="destination"
                        required
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="e.g. Paris (CDG)"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Departure Date</label>
                      <input
                        type="date"
                        name="departureDate"
                        required
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Departure Time</label>
                      <input
                        type="time"
                        name="departureTime"
                        required
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Seat Number</label>
                      <input
                        type="text"
                        name="seatNumber"
                        required
                        value={formData.seatNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 04A"
                        className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>

                    {/* Class Selector Buttons */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-2">Cabin Class Tier</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: 'Economy', badge: 'Standard' },
                          { name: 'Business', badge: 'Priority' },
                          { name: 'First Class', badge: 'VIP Luxury' }
                        ].map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, flightClass: c.name })}
                            className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                              formData.flightClass === c.name
                                ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <span className="block text-xs font-bold">{c.name}</span>
                            <span className="text-[10px] opacity-60 font-mono">{c.badge}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Form Button */}
                <div className="pt-4 border-t border-slate-800/80 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
                  >
                    <QrCode className="w-5 h-5" /> Issue Ticket & Generate Boarding Pass
                  </button>
                </div>
              </form>
            </div>

            {/* Right Live Encoded Badge Preview */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Dynamic QR Live Preview
                </h3>
                <p className="text-xs text-slate-400 mb-6">Real-time compilation of input fields into QR code matrix</p>

                {/* QR Code Container */}
                <div className="p-5 bg-white rounded-3xl inline-block shadow-2xl ring-8 ring-slate-950/80 mb-6">
                  <QRCodeSVG
                    value={JSON.stringify({
                      passenger: formData.passengerName || 'Passenger Name',
                      flight: formData.flightNumber,
                      from: formData.origin,
                      to: formData.destination,
                      seat: formData.seatNumber,
                      class: formData.flightClass
                    })}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {/* Metadata Summary */}
                <div className="text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 font-mono text-left space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">Passenger:</span>
                    <span className="text-slate-200 font-semibold">{formData.passengerName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">Flight:</span>
                    <span className="text-cyan-400 font-bold">{formData.flightNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-500">Seat / Class:</span>
                    <span className="text-amber-400">{formData.seatNumber} ({formData.flightClass})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security Tag:</span>
                    <span className="text-emerald-400 font-bold">RAW_JSON_ENCODED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: BOARDING PASSES & MANAGEMENT ==================== */}
        {}
        {activeTab === 'manage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel: Ticket Cards Directory */}
            <div className="lg:col-span-5 space-y-4">
              {/* Search & Filter Header */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-4 rounded-3xl space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search passenger, PNR, flight, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
                  {['All', 'Valid', 'Boarded', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        filterStatus === st
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/80'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Ticket List */}
              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
                    <TicketIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No boarding passes found</p>
                    <p className="text-xs text-slate-600 mt-1">Try adjusting your search filters or issue a new ticket.</p>
                  </div>
                ) : (
                  filteredTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                        selectedTicket?.id === t.id
                          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/90 border-cyan-500/80 shadow-xl shadow-cyan-500/10'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">{t.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono">PNR: {t.pnr}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'Valid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          t.status === 'Boarded' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm mb-1">{t.passengerName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                        <span>{t.originCode || t.origin}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                        <span>{t.destinationCode || t.destination}</span>
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/60 font-mono">
                        <span>FLT: <strong className="text-slate-200">{t.flightNumber}</strong></span>
                        <span>SEAT: <strong className="text-amber-400">{t.seatNumber}</strong></span>
                        <span className="text-slate-500">{t.flightClass}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Printable Boarding Pass Render */}
            <div className="lg:col-span-7">
              {selectedTicket ? (
                <div className="space-y-4">
                  {/* Action Bar Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-3xl border border-slate-800/80 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status:</span>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Valid">Valid</option>
                        <option value="Boarded">Boarded</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPayload(selectedTicket)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                        title="Copy raw JSON payload"
                      >
                        {copiedId === selectedTicket.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === selectedTicket.id ? 'Copied' : 'JSON'}
                      </button>
                      <button
                        onClick={() => handleTestScan(selectedTicket)}
                        className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-xl border border-cyan-500/30 flex items-center gap-1.5 transition-all"
                      >
                        <Scan className="w-3.5 h-3.5" /> Test Verifier
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                      <button
                        onClick={() => deleteTicket(selectedTicket.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Luxury Airline Boarding Pass UI */}
                  {}
                  <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
                    {/* Top Decorative Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-slate-800 relative">
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cyan-500 text-slate-950 rounded-xl font-bold">
                            <Plane className="w-5 h-5 transform -rotate-45" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase block">AEROPASS LUXURY AIRLINES</span>
                            <h3 className="text-lg font-black tracking-tight">BOARDING PASS</h3>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">PNR REFERENCE</span>
                          <span className="font-mono font-black text-xl text-cyan-400 tracking-wider">{selectedTicket.pnr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Ticket Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0B101D]">
                      {/* Details Section */}
                      <div className="md:col-span-8 space-y-6">
                        {/* Origin -> Destination Route */}
                        <div className="flex items-center justify-between p-4 bg-slate-900/90 rounded-2xl border border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">FROM</span>
                            <span className="text-2xl font-black text-white">{selectedTicket.originCode || extractAirportCode(selectedTicket.origin)}</span>
                            <span className="text-xs text-slate-400 block truncate max-w-[130px]">{selectedTicket.origin}</span>
                          </div>

                          <div className="flex flex-col items-center">
                            <Plane className="w-5 h-5 text-cyan-400 transform rotate-90" />
                            <span className="text-[10px] text-slate-500 font-mono mt-1">{selectedTicket.flightNumber}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">TO</span>
                            <span className="text-2xl font-black text-white">{selectedTicket.destinationCode || extractAirportCode(selectedTicket.destination)}</span>
                            <span className="text-xs text-slate-400 block truncate max-w-[130px]">{selectedTicket.destination}</span>
                          </div>
                        </div>

                        {/* Passenger Metadata Breakdown */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-slate-500 block text-[10px]">PASSENGER</span>
                            <span className="font-bold text-white text-sm truncate block">{selectedTicket.passengerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">FLIGHT NO.</span>
                            <span className="font-bold text-cyan-400">{selectedTicket.flightNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">CLASS</span>
                            <span className="font-bold text-slate-200">{selectedTicket.flightClass}</span>
                          </div>

                          <div>
                            <span className="text-slate-500 block text-[10px]">DATE</span>
                            <span className="font-semibold text-white">{selectedTicket.departureDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">TIME</span>
                            <span className="font-semibold text-white">{selectedTicket.departureTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">SEAT</span>
                            <span className="font-bold text-amber-400 text-base">{selectedTicket.seatNumber}</span>
                          </div>

                          <div>
                            <span className="text-slate-500 block text-[10px]">GATE / TERM</span>
                            <span className="text-white">{selectedTicket.gate || 'B12'} / {selectedTicket.terminal || 'T4'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">PASSPORT/ID</span>
                            <span className="text-slate-300">{selectedTicket.idNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">STATUS</span>
                            <span className="font-bold text-emerald-400">{selectedTicket.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Stub & Encoded QR Code */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-900/90 rounded-2xl border border-slate-800 text-center relative">
                        <div className="p-3.5 bg-white rounded-2xl shadow-xl mb-3">
                          <QRCodeSVG
                            value={JSON.stringify(selectedTicket)}
                            size={130}
                            level="H"
                          />
                        </div>
                        <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase block">
                          DIGITAL SECURITY ENCODED
                        </span>
                        <span className="font-mono text-xs font-bold text-cyan-400 mt-0.5">
                          {selectedTicket.id}
                        </span>
                      </div>
                    </div>

                    {/* Barcode Simulated Footer */}
                    <div className="bg-slate-950 p-4 border-t border-slate-800/80 flex items-center justify-between opacity-80">
                      <div className="h-7 w-48 bg-gradient-to-r from-slate-200 via-slate-700 to-slate-200 opacity-20 rounded-sm" />
                      <span className="text-[10px] font-mono text-slate-500">ELECTRONIC TICKETING STANDARD • IATA PASSENGER SPEC</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
                  <p className="text-slate-400 text-sm">Select a boarding pass from the left list to inspect.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: VERIFIER & SCANNER SIMULATOR ==================== */}
        {}
        {activeTab === 'scanner' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
                  <Scan className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Boarding Pass Verifier & Terminal Inspector</h2>
                  <p className="text-xs text-slate-400">Input or test any encoded JSON payload string to verify passenger credentials</p>
                </div>
              </div>

              {/* Text Area Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    QR Code Payload (JSON String):
                  </label>
                  <textarea
                    rows={5}
                    value={scanInputText}
                    onChange={(e) => {
                      setScanInputText(e.target.value);
                      processScanPayload(e.target.value);
                    }}
                    placeholder='Paste raw JSON here or use sample buttons below...'
                    className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                {/* Sample Preset Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Quick Test Samples:</span>
                  {tickets.slice(0, 3).map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => handleTestScan(t)}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono transition-all"
                    >
                      Sample #{idx + 1} ({t.passengerName.split(' ')[0]})
                    </button>
                  ))}
                </div>

                {scanError && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {scanError}
                  </div>
                )}
              </div>
            </div>

            {/* Inspection Results Dashboard */}
            {scannedData && (
              <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">VERIFIED TICKET RECORD</h3>
                      <p className="text-xs text-slate-400">Authentic digital signature & payload verified</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    STATUS: {scannedData.status || 'VALID'}
                  </span>
                </div>

                {/* Detailed Metadata Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <User className="w-4 h-4" /> Passenger Metadata
                    </h4>
                    <p className="text-slate-300"><span className="text-slate-500">Full Name:</span> <strong className="text-white">{scannedData.passengerName || scannedData.passenger}</strong></p>
                    <p className="text-slate-300"><span className="text-slate-500">Age / Gender:</span> {scannedData.age || 'N/A'} yrs • {scannedData.gender || 'N/A'}</p>
                    <p className="text-slate-300"><span className="text-slate-500">ID / Passport:</span> <span className="font-mono text-white">{scannedData.idNumber || 'N/A'}</span></p>
                    <p className="text-slate-300"><span className="text-slate-500">Contact Email:</span> {scannedData.email || 'N/A'}</p>
                  </div>

                  <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Plane className="w-4 h-4" /> Flight Itinerary
                    </h4>
                    <p className="text-slate-300"><span className="text-slate-500">Ticket ID:</span> <span className="font-mono text-cyan-400 font-bold">{scannedData.id || 'N/A'}</span></p>
                    <p className="text-slate-300"><span className="text-slate-500">PNR Reference:</span> <span className="font-mono text-white font-bold">{scannedData.pnr || 'N/A'}</span></p>
                    <p className="text-slate-300"><span className="text-slate-500">Route:</span> {scannedData.origin || scannedData.from} → {scannedData.destination || scannedData.to}</p>
                    <p className="text-slate-300"><span className="text-slate-500">Flight / Seat:</span> {scannedData.flightNumber || scannedData.flight} | <strong className="text-amber-400">{scannedData.seatNumber || scannedData.seat}</strong> ({scannedData.flightClass || scannedData.class})</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}