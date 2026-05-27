import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, LogOut, LayoutDashboard, Inbox, FileText, Settings, 
  Trash2, CheckCircle2, XCircle, AlertCircle, Save, Plus, ArrowUpRight, Download, Check
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = ({ onShowToast }) => {
  const { admin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Database lists
  const [inquiries, setInquiries] = useState([]);
  const [loans, setLoans] = useState([]);
  const [services, setServices] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    businessName: 'Cyber Hub Services',
    tagline: 'Loan se lekar Cyber Work tak, sab kuch ek hi chhat ke neeche',
    phoneNumbers: [],
    whatsappNumber: '',
    address: '',
    emailNotifications: '',
    openingHours: { weekdays: '', saturday: '', sunday: '' }
  });

  // Services form state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    category: 'aadhaar-pan',
    description: '',
    estimatedTime: '1-3 Days',
    serviceCharge: 'Nominal Charges',
    requiredDocuments: '',
  });

  const [loading, setLoading] = useState(true);

  // Security guard check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch admin databases on load
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [inqRes, loanRes, srvRes, setRes] = await Promise.all([
        api.get('/inquiries'),
        api.get('/loans'),
        api.get('/services'),
        api.get('/settings')
      ]);

      if (inqRes.data.success) setInquiries(inqRes.data.data);
      if (loanRes.data.success) setLoans(loanRes.data.data);
      if (srvRes.data.success) setServices(srvRes.data.data);
      if (setRes.data.success) setSiteSettings(setRes.data.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      onShowToast('Failed to fetch dashboard records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  // Toggle Inquiry resolution status
  const handleToggleInquiryStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await api.put(`/inquiries/${id}`, { status: nextStatus });
      if (res.data.success) {
        onShowToast('Inquiry status updated successfully!', 'success');
        setInquiries(inquiries.map(inq => inq._id === id ? res.data.data : inq));
      }
    } catch (err) {
      onShowToast('Failed to update status', 'error');
    }
  };

  // Delete inquiry
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to remove this inquiry log?')) return;
    try {
      const res = await api.delete(`/inquiries/${id}`);
      if (res.data.success) {
        onShowToast('Inquiry deleted successfully!', 'success');
        setInquiries(inquiries.filter(inq => inq._id !== id));
      }
    } catch (err) {
      onShowToast('Failed to delete inquiry record', 'error');
    }
  };

  // Toggle Loan status
  const handleUpdateLoanStatus = async (id, status) => {
    try {
      const res = await api.put(`/loans/${id}`, { status });
      if (res.data.success) {
        onShowToast(`Loan dossier status flagged as ${status}!`, 'success');
        setLoans(loans.map(ln => ln._id === id ? res.data.data : ln));
      }
    } catch (err) {
      onShowToast('Failed to update loan pipeline', 'error');
    }
  };

  // Delete loan dossier
  const handleDeleteLoan = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this loan portfolio? All files on disk will be removed.')) return;
    try {
      const res = await api.delete(`/loans/${id}`);
      if (res.data.success) {
        onShowToast('Loan application wiped out!', 'success');
        setLoans(loans.filter(ln => ln._id !== id));
      }
    } catch (err) {
      onShowToast('Failed to remove loan portfolio', 'error');
    }
  };

  // Save Settings configuration
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/settings', siteSettings);
      if (res.data.success) {
        onShowToast('Dynamic site settings saved successfully!', 'success');
        setSiteSettings(res.data.data);
      }
    } catch (err) {
      onShowToast('Failed to save settings variables', 'error');
    }
  };

  // Add new Service profile
  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split newline documents text into arrays
      const docsArray = newService.requiredDocuments
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      const res = await api.post('/services', {
        ...newService,
        requiredDocuments: docsArray
      });

      if (res.data.success) {
        onShowToast('Service profile created successfully!', 'success');
        setServices([res.data.data, ...services]);
        setIsAddingService(false);
        setNewService({
          title: '',
          category: 'aadhaar-pan',
          description: '',
          estimatedTime: '1-3 Days',
          serviceCharge: 'Nominal Charges',
          requiredDocuments: '',
        });
      }
    } catch (err) {
      onShowToast(err.response?.data?.message || 'Failed to create service', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    onShowToast('Logged out successfully', 'success');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-body pt-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-accent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider">Verifying JWT session metrics...</span>
        </div>
      </div>
    );
  }

  // Calculate statistics metrics
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
  const resolvedInquiries = totalInquiries - pendingInquiries;

  const totalLoans = loans.length;
  const pendingLoans = loans.filter(l => l.status === 'Pending').length;
  const approvedLoans = loans.filter(l => l.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-slate-50 font-body pt-16 flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-dark-blue text-white flex flex-col border-r border-white/5 z-20 shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <span className="w-9 h-9 bg-gold-accent rounded-lg flex items-center justify-center text-dark-blue font-bold shadow-premium-sm">
            <ShieldCheck className="w-5.5 h-5.5 text-dark-blue" />
          </span>
          <div>
            <h3 className="font-display font-extrabold text-sm tracking-wide text-white">CYBER HUB OFFICE</h3>
            <p className="text-[9px] text-gold-accent tracking-widest font-semibold mt-0.5">ADMIN MANAGER</p>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-1.5 mb-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'inquiries', label: 'Customer Inquiries', count: pendingInquiries, icon: Inbox },
            { id: 'loans', label: 'Loan Portfolios', count: pendingLoans, icon: FileText },
            { id: 'services', label: 'Services Manager', icon: Plus },
            { id: 'settings', label: 'Office Configurations', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsAddingService(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-xs tracking-wide transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gold-accent text-dark-blue shadow-premium-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    activeTab === tab.id ? 'bg-dark-blue text-gold-accent' : 'bg-rose-500 text-white animate-pulse'
                  }`}>{tab.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <p className="text-[10px] text-slate-400 mb-2 truncate">Session User: <strong className="text-white">{admin?.username}</strong></p>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-rose-900/30 hover:border-rose-500/35 border border-white/10 text-slate-300 hover:text-rose-200 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-dark-blue">Dashboard Overview</h1>
                <p className="text-xs text-slate-400 mt-1">Live customer activity metrics and loan elegibility queues.</p>
              </div>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium-sm flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Inquiries</span>
                  <p className="text-3xl font-display font-black text-dark-blue mt-1.5">{totalInquiries}</p>
                </div>
                <span className="w-11 h-11 bg-slate-50 text-teal-accent rounded-lg flex items-center justify-center shadow-premium-sm"><Inbox className="w-5.5 h-5.5" /></span>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium-sm flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pending Inquiries</span>
                  <p className="text-3xl font-display font-black text-rose-500 mt-1.5">{pendingInquiries}</p>
                </div>
                <span className="w-11 h-11 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center shadow-premium-sm"><AlertCircle className="w-5.5 h-5.5" /></span>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium-sm flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Loan Applications</span>
                  <p className="text-3xl font-display font-black text-dark-blue mt-1.5">{totalLoans}</p>
                </div>
                <span className="w-11 h-11 bg-slate-50 text-gold-accent rounded-lg flex items-center justify-center shadow-premium-sm"><FileText className="w-5.5 h-5.5" /></span>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium-sm flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Pending Loans</span>
                  <p className="text-3xl font-display font-black text-gold-accent mt-1.5">{pendingLoans}</p>
                </div>
                <span className="w-11 h-11 bg-amber-50 text-gold-accent rounded-lg flex items-center justify-center shadow-premium-sm"><AlertCircle className="w-5.5 h-5.5" /></span>
              </div>
            </div>

            {/* Quick overview columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Box 1: Recent Inquiries */}
              <div className="bg-white border border-slate-150 rounded-xl p-6 shadow-premium-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-sm tracking-wide text-dark-blue">Recent Customer Inquiries</h3>
                  <button onClick={() => setActiveTab('inquiries')} className="text-xs font-bold text-teal-accent hover:underline flex items-center gap-0.5">
                    <span>Manage all</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq._id} className="flex justify-between items-start gap-4 p-3.5 bg-slate-50 rounded-lg text-xs">
                      <div>
                        <div className="flex items-center gap-2 font-display font-bold text-dark-blue">
                          <span>{inq.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                            inq.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'
                          }`}>{inq.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">Service: {inq.service} | Mobile: {inq.phone}</p>
                        <p className="text-slate-500 mt-2 line-clamp-2 italic">"{inq.message}"</p>
                      </div>
                    </div>
                  ))}
                  {inquiries.length === 0 && <p className="text-slate-400 text-xs italic text-center py-6">No recent inquiries logged.</p>}
                </div>
              </div>

              {/* Box 2: Recent Loans */}
              <div className="bg-white border border-slate-150 rounded-xl p-6 shadow-premium-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-sm tracking-wide text-dark-blue">Recent Loan Requests</h3>
                  <button onClick={() => setActiveTab('loans')} className="text-xs font-bold text-teal-accent hover:underline flex items-center gap-0.5">
                    <span>Manage all</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {loans.slice(0, 5).map((ln) => (
                    <div key={ln._id} className="flex justify-between items-start gap-4 p-3.5 bg-slate-50 rounded-lg text-xs">
                      <div>
                        <div className="flex items-center gap-2 font-display font-bold text-dark-blue">
                          <span>{ln.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                            ln.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : ln.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>{ln.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">Type: {ln.loanType} | Value: {ln.amount}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Profile: {ln.occupation} | City: {ln.city}</p>
                      </div>
                    </div>
                  ))}
                  {loans.length === 0 && <p className="text-slate-400 text-xs italic text-center py-6">No recent loan requests filed.</p>}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CUSTOMER INQUIRIES QUEUE */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-dark-blue">Customer Inquiries Queue</h1>
              <p className="text-xs text-slate-400 mt-1">Review contact cards, quick government update queries, and resolve queues.</p>
            </div>

            <div className="bg-white border border-slate-150 rounded-xl shadow-premium-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-dark-blue text-white uppercase text-[9px] tracking-wider border-b border-slate-200">
                      <th className="p-4 font-bold">Applicant Details</th>
                      <th className="p-4 font-bold">Service Queried</th>
                      <th className="p-4 font-bold">Specific Message</th>
                      <th className="p-4 font-bold text-center">Status Flag</th>
                      <th className="p-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <p className="font-bold text-dark-blue text-sm">{inq.name}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5 font-semibold">Mob: {inq.phone}</p>
                          <p className="text-slate-400 text-[9px] mt-0.5">Filed: {new Date(inq.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-600">{inq.service}</td>
                        <td className="p-4 text-slate-500 max-w-xs truncate italic">"{inq.message}"</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleInquiryStatus(inq._id, inq.status)}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold cursor-pointer transition-all ${
                              inq.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 animate-pulse'
                            }`}
                          >
                            {inq.status}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleDeleteInquiry(inq._id)}
                              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center cursor-pointer"
                              title="Delete log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400 italic">No inquiries found in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LOAN PORTFOLIOS CENTER */}
        {activeTab === 'loans' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-dark-blue">Loan Pre-Approval requests</h1>
              <p className="text-xs text-slate-400 mt-1">Audit salaried seeker profiles, download attachments, and change approval queues.</p>
            </div>

            <div className="bg-white border border-slate-150 rounded-xl shadow-premium-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-dark-blue text-white uppercase text-[9px] tracking-wider border-b border-slate-200">
                      <th className="p-4 font-bold">Applicant Details</th>
                      <th className="p-4 font-bold">Loan Particulars</th>
                      <th className="p-4 font-bold">Uploaded Dossier Attachments</th>
                      <th className="p-4 font-bold text-center">Pipeline status</th>
                      <th className="p-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loans.map((ln) => (
                      <tr key={ln._id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <p className="font-bold text-dark-blue text-sm">{ln.name}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5 font-semibold">Phone: {ln.phone}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">City: {ln.city} | Profile: {ln.occupation}</p>
                          <p className="text-slate-400 text-[9px] mt-0.5">Filed: {new Date(ln.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-600">{ln.loanType}</p>
                          <p className="text-gold-accent font-bold mt-1">{ln.amount}</p>
                        </td>
                        <td className="p-4">
                          {ln.documents && ln.documents.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {ln.documents.map((doc, idx) => (
                                <a
                                  key={idx}
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-teal-accent hover:underline font-semibold"
                                  title="Download this document file"
                                >
                                  <Download className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate max-w-[150px]">{doc.originalName}</span>
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No attachments uploaded</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold ${
                              ln.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : ln.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                            }`}>
                              {ln.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateLoanStatus(ln._id, 'Approved')}
                              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                              title="Approve Loan request"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateLoanStatus(ln._id, 'Rejected')}
                              className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                              title="Reject Loan request"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLoan(ln._id)}
                              className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center cursor-pointer"
                              title="Wipe Dossiers"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {loans.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400 italic">No loan applications filed in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES DIRECTORY MANAGER */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-dark-blue">Services Directory</h1>
                <p className="text-xs text-slate-400 mt-1">Manage active listings, estimated filing speeds, and required document checklists.</p>
              </div>
              <button
                onClick={() => setIsAddingService(!isAddingService)}
                className="flex items-center gap-2 px-5 py-2.5 bg-dark-blue hover:bg-dark-blue-light text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-premium-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingService ? 'Hide Editor Form' : 'Create New Service'}</span>
              </button>
            </div>

            {/* Create Service Form layout */}
            {isAddingService && (
              <form onSubmit={handleAddServiceSubmit} className="bg-white border border-slate-150 rounded-xl p-6 sm:p-8 shadow-premium-sm space-y-4">
                <h3 className="font-display font-extrabold text-sm text-dark-blue border-b border-slate-100 pb-2">CREATE NEW SERVICE FORM</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Service Title *</label>
                    <input 
                      type="text" 
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="e.g. Aadhaar DOB Correction"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Category Category *</label>
                    <select 
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue cursor-pointer"
                    >
                      <option value="aadhaar-pan">Aadhaar & PAN Services</option>
                      <option value="loans">Loans & Finance tie-ups</option>
                      <option value="cyber">Cyber Cafe Printing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Filing Description *</label>
                  <textarea 
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows="3"
                    placeholder="Provide description parameter..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue resize-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Filing Speed / Estimated Time *</label>
                    <input 
                      type="text" 
                      value={newService.estimatedTime}
                      onChange={(e) => setNewService({ ...newService, estimatedTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Estimated Charges</label>
                    <input 
                      type="text" 
                      value={newService.serviceCharge}
                      onChange={(e) => setNewService({ ...newService, serviceCharge: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Documents Checklist (One document item per line) *</label>
                  <textarea 
                    value={newService.requiredDocuments}
                    onChange={(e) => setNewService({ ...newService, requiredDocuments: e.target.value })}
                    rows="4"
                    placeholder="Aadhaar Card (Original)&#10;10th Class Marksheet&#10;Birth Certificate Specimen..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold-accent hover:bg-gold-accent-hover text-dark-blue font-display font-semibold text-xs py-3 rounded-lg shadow-premium-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Create Service and Publish Online</span>
                </button>
              </form>
            )}

            {/* Active Services list */}
            <div className="bg-white border border-slate-150 rounded-xl shadow-premium-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-dark-blue text-white uppercase text-[9px] tracking-wider border-b border-slate-200">
                      <th className="p-4 font-bold">Title Name</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Required Documents Count</th>
                      <th className="p-4 font-bold">Est. Speed</th>
                      <th className="p-4 font-bold">Charges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.map((srv) => (
                      <tr key={srv._id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-dark-blue text-sm">{srv.title}</td>
                        <td className="p-4 font-semibold text-slate-500 uppercase text-[10px]">{srv.category.replace('-', ' & ')}</td>
                        <td className="p-4 text-slate-600 font-bold">{srv.requiredDocuments?.length || 0} items in checklist</td>
                        <td className="p-4 font-semibold text-slate-500">{srv.estimatedTime}</td>
                        <td className="p-4 text-gold-accent font-bold">{srv.serviceCharge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-dark-blue">Office Configurations</h1>
              <p className="text-xs text-slate-400 mt-1">Change telephone listings, WhatsApp numbers, physical addresses, and opening hours dynamically.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white border border-slate-150 rounded-xl p-6 sm:p-8 shadow-premium-sm space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Business Name Branding</label>
                  <input 
                    type="text" 
                    value={siteSettings.businessName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, businessName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Motto / Tagline</label>
                  <input 
                    type="text" 
                    value={siteSettings.tagline}
                    onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Primary Contact Numbers (separated by commas) *</label>
                  <input 
                    type="text" 
                    value={siteSettings.phoneNumbers.join(', ')}
                    onChange={(e) => setSiteSettings({ ...siteSettings, phoneNumbers: e.target.value.split(',').map(n => n.trim()).filter(n => n.length > 0) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Active WhatsApp Number (Without country code prefix) *</label>
                  <input 
                    type="text" 
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value.trim() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Physical Office Address *</label>
                  <input 
                    type="text" 
                    value={siteSettings.address}
                    onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Inquiry Email Routing Address *</label>
                  <input 
                    type="email" 
                    value={siteSettings.emailNotifications}
                    onChange={(e) => setSiteSettings({ ...siteSettings, emailNotifications: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-xs text-dark-blue mb-4">Office Opening Hours Configurations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Weekdays (Mon - Fri) *</label>
                    <input 
                      type="text" 
                      value={siteSettings.openingHours.weekdays}
                      onChange={(e) => setSiteSettings({ ...siteSettings, openingHours: { ...siteSettings.openingHours, weekdays: e.target.value } })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Saturdays *</label>
                    <input 
                      type="text" 
                      value={siteSettings.openingHours.saturday}
                      onChange={(e) => setSiteSettings({ ...siteSettings, openingHours: { ...siteSettings.openingHours, saturday: e.target.value } })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sundays *</label>
                    <input 
                      type="text" 
                      value={siteSettings.openingHours.sunday}
                      onChange={(e) => setSiteSettings({ ...siteSettings, openingHours: { ...siteSettings.openingHours, sunday: e.target.value } })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold-accent hover:bg-gold-accent-hover text-dark-blue font-display font-semibold text-xs py-3.5 rounded-lg shadow-premium-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Save className="w-4 h-4" />
                <span>Save site Configurations</span>
              </button>

            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
