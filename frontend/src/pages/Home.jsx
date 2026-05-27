import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Check, Star, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const Home = ({ settings, onShowToast }) => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Inquiry form states
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    service: 'General Query',
    message: ''
  });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  // Dynamic values
  const address = settings?.address || '101 A, Street No. 13, Pratap Nagar, Mayur Vihar Phase-1, Delhi';
  const phones = settings?.phoneNumbers || ['9891067013', '8736909000'];
  const email = settings?.emailNotifications || 'cyberhubservicesdelhi@gmail.com';
  const hours = settings?.openingHours || {
    weekdays: '09:30 AM - 08:30 PM',
    saturday: '09:30 AM - 08:30 PM',
    sunday: '10:00 AM - 02:00 PM'
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [srvRes, tstRes, faqRes] = await Promise.all([
          api.get('/services'),
          api.get('/testimonials'),
          api.get('/faqs')
        ]);
        if (srvRes.data.success) setServices(srvRes.data.data);
        if (tstRes.data.success) setTestimonials(tstRes.data.data);
        if (faqRes.data.success) setFaqs(faqRes.data.data);
      } catch (err) {
        console.error('Error fetching landing data:', err);
      }
    };
    fetchHomeData();
  }, []);

  // Handle hero search typing
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const matches = services.filter(srv => 
      srv.title.toLowerCase().includes(query.toLowerCase()) || 
      (srv.requiredDocuments && srv.requiredDocuments.some(doc => doc.toLowerCase().includes(query.toLowerCase())))
    );
    setSearchSuggestions(matches);
  };

  // Triggers visual scroll, accordion open, and gold flash highlight
  const triggerAccordionFocus = (slug) => {
    setSearchQuery('');
    setSearchSuggestions([]);

    const element = document.getElementById(`accordion-${slug}`);
    if (element) {
      setActiveAccordion(slug);
      
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 125;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });

      // Apply keyframe outline flash
      element.classList.add('highlight-accordion');
      setTimeout(() => {
        element.classList.remove('highlight-accordion');
      }, 2500);
    }
  };

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingInquiry(true);

    try {
      const res = await api.post('/inquiries', contactData);
      if (res.data.success) {
        onShowToast('Inquiry Received!', 'success');

        // Compile direct WhatsApp redirect
        setTimeout(() => {
          const waMsg = encodeURIComponent(
            `*Cyber Hub Services Inquiry*\n\n` +
            `*Name:* ${contactData.name}\n` +
            `*Contact:* ${contactData.phone}\n` +
            `*Service:* ${contactData.service}\n` +
            `*Message:* ${contactData.message}\n\n` +
            `Please share the checklist and processing time.`
          );
          window.open(`https://wa.me/919891067013?text=${waMsg}`, '_blank');
        }, 1200);

        setContactData({ name: '', phone: '', service: 'General Query', message: '' });
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to log inquiry request', 'error');
    } finally {
      setSendingInquiry(false);
    }
  };

  // Filter service items by category tab
  const filteredServices = services.filter(srv => {
    if (activeCategory === 'all') return true;
    return srv.category === activeCategory;
  });

  return (
    <div className="font-body overflow-x-hidden pt-16">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-[90vh] bg-gradient-to-br from-dark-blue via-dark-blue to-[#0b1b3d] flex items-center py-16 px-6 overflow-hidden">
        
        {/* Glow vector backdrops */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 text-white flex flex-col gap-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gold-accent w-fit mx-auto lg:mx-0 animate-pulse-subtle">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Delhi Government Certified Facilitator</span>
            </span>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-gradient">
              Cyber Hub Services
            </h1>
            
            <p className="font-display font-semibold text-lg sm:text-xl text-teal-accent tracking-wide leading-relaxed italic">
              "Loan se lekar Cyber Work tak, sab kuch ek hi chhat ke neeche"
            </p>
            
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Filing official PAN card updates, Aadhaar biometric scans, fast-track home & personal loans, motor insurances, and government job forms with complete transparency.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="#documents"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('documents');
                  if (target) window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-teal-accent hover:bg-teal-accent-hover text-dark-blue font-display font-bold text-sm rounded-xl transition-all duration-300 text-center shadow-premium-sm"
              >
                View Required Documents
              </a>
              <a 
                href={`tel:+91${phones[0]}`}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/20 font-display font-bold text-sm rounded-xl transition-all duration-300 text-center"
              >
                Call Office Now
              </a>
            </div>
          </div>

          {/* Right Smart Search widget */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-premium-lg relative">
              <h3 className="font-display font-bold text-lg text-white mb-2 tracking-wide">Quick Document Finder</h3>
              <p className="text-xs text-slate-300 mb-6">Type a service name to instantly view required checklists.</p>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="e.g. Aadhaar DOB, PAN Correction..."
                  className="w-full bg-white/5 border border-white/15 focus:border-teal-accent text-white placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-0 transition-colors"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />

                {/* Suggestions Dropdown list */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute left-0 w-full mt-2 bg-[#0c1325] border border-white/10 rounded-xl overflow-hidden shadow-premium-lg z-50">
                    {searchSuggestions.map((match) => (
                      <div 
                        key={match.slug}
                        onClick={() => triggerAccordionFocus(match.slug)}
                        className="px-5 py-3 hover:bg-white/5 border-b border-white/5 cursor-pointer flex justify-between items-center transition-colors group"
                      >
                        <span className="text-xs text-white font-medium group-hover:text-gold-accent">{match.title}</span>
                        <span className="text-[9px] uppercase tracking-wider text-teal-accent bg-teal-accent-glow px-2 py-0.5 rounded-full font-bold">{match.category === 'loans' ? 'Loan' : 'Govt'}</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchQuery.trim().length >= 2 && searchSuggestions.length === 0 && (
                  <div className="absolute left-0 w-full mt-2 bg-[#0c1325] border border-white/10 rounded-xl p-4 text-center text-xs text-slate-400 z-50">
                    No matching service found
                  </div>
                )}
              </div>

              {/* Quick tags */}
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <span className="text-slate-400">Popular:</span>
                <button onClick={() => triggerAccordionFocus('aadhaar-dob')} className="text-teal-accent hover:underline">Aadhaar DOB</button>
                <button onClick={() => triggerAccordionFocus('new-pan')} className="text-teal-accent hover:underline">New PAN</button>
                <button onClick={() => triggerAccordionFocus('home-loan')} className="text-teal-accent hover:underline">Home Loan</button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC SERVICES LIST */}
      <section id="services" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[3px] text-teal-accent">Our Offerings</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark-blue mt-3 tracking-tight">
              Premium Financial & Digital Services
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              We leverage direct bank tie-ups and official government channels to facilitate swift approvals and accurate record updates.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'aadhaar-pan', label: 'Aadhaar & PAN' },
              { id: 'loans', label: 'Loans & Finance' },
              { id: 'cyber', label: 'Cyber Cafe' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-5 py-2.5 font-display font-bold text-xs rounded-lg transition-all duration-200 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-dark-blue text-white shadow-premium-sm'
                    : 'bg-white text-dark-blue border border-slate-200 hover:border-dark-blue'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((srv) => (
              <div 
                key={srv.slug}
                className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col justify-between hover:shadow-premium-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <span className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-teal-accent group-hover:bg-teal-accent group-hover:text-white transition-colors duration-300 shadow-premium-sm mb-5">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <h3 className="font-display font-bold text-base text-dark-blue tracking-wide group-hover:text-teal-accent transition-colors mb-2.5">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">{srv.description}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-slate-400">{srv.estimatedTime}</span>
                  <Link 
                    to={`/service/${srv.slug}`}
                    className="flex items-center gap-1 font-display font-bold text-xs text-teal-accent hover:text-teal-accent-hover transition-colors"
                  >
                    <span>Check Docs</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. DYNAMIC DOCUMENTS REQUIRED GUIDE */}
      <section id="documents" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[3px] text-teal-accent">Filing Checklists</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark-blue mt-3 tracking-tight">
              Required Documents Guide
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Verify your documents beforehand to ensure flawless portal approvals. Click a card to expand the required checklists.
            </p>
          </div>

          {/* Accordion Container */}
          <div className="space-y-4">
            {services.map((srv) => (
              <div 
                key={srv.slug}
                id={`accordion-${srv.slug}`}
                className={`border rounded-xl transition-all duration-300 ${
                  activeAccordion === srv.slug 
                    ? 'border-gold-accent bg-slate-50/50 shadow-premium-sm' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setActiveAccordion(activeAccordion === srv.slug ? null : srv.slug)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-display cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      srv.category === 'loans' ? 'bg-gold-accent' : 'bg-teal-accent'
                    }`}></span>
                    <span className="font-bold text-sm sm:text-base text-dark-blue tracking-wide">{srv.title} Checklist</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{srv.estimatedTime}</span>
                </button>

                {/* Accordion Content */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion === srv.slug ? 'max-h-[500px] border-t border-slate-100' : 'max-h-0'
                }`}>
                  <div className="p-6 space-y-4">
                    <h4 className="font-display font-bold text-xs text-dark-blue tracking-wider uppercase">List of Mandatory Documents:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                      {srv.requiredDocuments && srv.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{doc}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 text-xs mt-4">
                      <span className="text-slate-500">Service Charges: <strong className="text-dark-blue">{srv.serviceCharge}</strong></span>
                      <Link 
                        to={`/service/${srv.slug}`}
                        className="font-display font-bold text-xs text-teal-accent hover:underline flex items-center gap-1"
                      >
                        <span>View Page Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section id="why-choose-us" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[3px] text-teal-accent">Our Strengths</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark-blue mt-3 tracking-tight">
              Why Customers Rely on Cyber Hub
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Providing highly reliable local services with 100% data integrity and robust procedural compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-premium-sm hover:shadow-premium-md transition-all duration-300">
              <span className="w-12 h-12 rounded-lg bg-teal-accent-glow flex items-center justify-center text-teal-accent mb-6 font-bold text-lg">01</span>
              <h3 className="font-display font-bold text-base text-dark-blue mb-3 tracking-wide">Government Authorized</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operating under certified agent channels for Aadhaar, PAN, and Insurances, guaranteeing that all database logs comply with federal directives.
              </p>
            </div>
            {/* Box 2 */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-premium-sm hover:shadow-premium-md transition-all duration-300">
              <span className="w-12 h-12 rounded-lg bg-gold-accent-glow flex items-center justify-center text-gold-accent mb-6 font-bold text-lg">02</span>
              <h3 className="font-display font-bold text-base text-dark-blue mb-3 tracking-wide">High Approval Ratios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our bank tie-up eligibility algorithms ensure that your personal, home, or vehicle loan application dossier is formatted perfectly before final submission.
              </p>
            </div>
            {/* Box 3 */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-premium-sm hover:shadow-premium-md transition-all duration-300">
              <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-dark-blue mb-6 font-bold text-lg">03</span>
              <h3 className="font-display font-bold text-base text-dark-blue mb-3 tracking-wide">Dynamic Offline Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No long lines! Send files via WhatsApp beforehand, and we will prepare prints, scan copy logs, or load applications before you even arrive at the counter.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[3px] text-teal-accent">Reviews</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark-blue mt-3 tracking-tight">
              Feedback from Pratap Nagar Residents
            </h2>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Read how we assist local business owners and families in obtaining financial aids and verified database records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((tst, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 p-8 rounded-xl border border-slate-100 relative"
              >
                <div className="flex items-center gap-1.5 mb-5 text-gold-accent">
                  {[...Array(tst.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">"{tst.reviewText}"</p>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm text-dark-blue">{tst.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{tst.location}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FAQs */}
      <section id="faq" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[3px] text-teal-accent">Questions</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark-blue mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-display cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-dark-blue tracking-wide">{faq.question}</span>
                  <span className="text-slate-400 font-bold text-lg">{activeFaq === idx ? '−' : '+'}</span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeFaq === idx ? 'max-h-[300px] border-t border-slate-100' : 'max-h-0'
                }`}>
                  <p className="p-6 text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CONTACT FORM & OFFICE MAP */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Details */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-10">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[3px] text-teal-accent">Office Desk</span>
              <h2 className="font-display font-extrabold text-3xl text-dark-blue tracking-tight">
                Visit or Reach Out
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connect with our certified facilitator desk in Mayur Vihar Phase-1. Scan our dynamic contact card or drop a query to schedule appointment filing.
              </p>
            </div>

            <ul className="space-y-6 text-sm text-slate-600">
              <li className="flex items-start gap-4">
                <span className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-gold-accent shrink-0 shadow-premium-sm mt-0.5">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-dark-blue">Office Address</h4>
                  <p className="text-xs text-slate-400 mt-1">{address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-gold-accent shrink-0 shadow-premium-sm mt-0.5">
                  <Phone className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-dark-blue">Telephones</h4>
                  <p className="text-xs text-slate-400 mt-1">{phones.join(' / ')}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-gold-accent shrink-0 shadow-premium-sm mt-0.5">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-dark-blue">Office Hours</h4>
                  <p className="text-xs text-slate-400 mt-1">Mon - Sat: {hours.weekdays} | Sunday: {hours.sunday}</p>
                </div>
              </li>
            </ul>

            {/* QR Card vector representation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center gap-5 w-fit">
              {/* Clean inline SVG representing a highly aesthetic scannable contact QR Code */}
              <svg className="w-20 h-20 text-dark-blue shrink-0 shadow-premium-sm bg-white p-1 rounded-md" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <path d="M5 5h25v25H5zm2 2v21h21V7zm3 3h15v15H10zm0 30h25v25H10zm2 2v21h21V42zm3 3h15v15H15zm30-35h25v25H45zm2 2v21h21V7zm3 3h15v15H50zm15 35h5v5h-5zm5 5h5v5h-5zm0-10h5v5h-5zm5 0h5v5h-5zm5 5h5v5h-5zm-15 15h5v5h-5zm5-5h5v5h-5zm5 5h5v5h-5zm5-10h5v5h-5zm-5 15h5v5h-5z" fill="currentColor" />
                {/* Center logo tag in gold */}
                <rect x="42" y="42" width="16" height="16" rx="3" fill="#d4af37" />
                <path d="M47 50l2 2 4-4" stroke="#0b1329" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div>
                <h4 className="font-display font-bold text-xs text-dark-blue tracking-wide">Scannable Contact Card</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Point your smartphone camera to save office coordinates instantly.</p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-premium-sm">
            <h3 className="font-display font-bold text-lg text-dark-blue mb-2 tracking-wide font-extrabold">File an Inquiry</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Need custom PAN card corrections or online govt forms? Log your inquiry below.</p>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={contactData.name}
                    onChange={handleContactChange}
                    placeholder="Enter name"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Contact Number *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    placeholder="10-digit mobile"
                    pattern="[0-9]{10}"
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Service Category Queried</label>
                <select 
                  name="service"
                  value={contactData.service}
                  onChange={handleContactChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue cursor-pointer"
                >
                  <option value="General Query">General Cyber Cafe Query</option>
                  <option value="Aadhaar Correction">Aadhaar Card Correction / DOB Update</option>
                  <option value="New PAN Application">New PAN Card Application</option>
                  <option value="PAN Card Correction">PAN Card Correction / Signature Update</option>
                  <option value="Loan Pre-Approval">Home / Personal / Vehicle Loan</option>
                  <option value="Insurance Renewal">Motor or Health Insurance</option>
                  <option value="Government Form Filling">Online Job Form Application</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Specific Request Details *</label>
                <textarea 
                  name="message"
                  value={contactData.message}
                  onChange={handleContactChange}
                  rows="4"
                  placeholder="Describe your spelling errors, required loan amount, or details..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-dark-blue resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sendingInquiry}
                className="w-full bg-dark-blue hover:bg-dark-blue-light text-white font-display font-semibold text-xs py-3.5 rounded-lg shadow-premium-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {sendingInquiry ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <span>Submit & Open WhatsApp Link</span>
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
