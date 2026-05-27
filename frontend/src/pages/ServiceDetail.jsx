import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Check, Clock, Coins, FileText, ArrowRight, MessageSquare } from 'lucide-react';
import api from '../utils/api';

const ServiceDetail = ({ onShowToast }) => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  // Quick form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/services/${slug}`);
        if (res.data.success) {
          setService(res.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching service slug:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/inquiries', {
        name,
        phone,
        service: service.title,
        message: query || `Interested in ${service.title} checklist filing guide.`
      });

      if (res.data.success) {
        onShowToast('Inquiry Filed successfully!', 'success');

        // Compile context-specific WhatsApp prefilled message
        setTimeout(() => {
          const messageText = encodeURIComponent(
            `*Cyber Hub Services Context Inquiry*\n\n` +
            `*Client Name:* ${name}\n` +
            `*Contact No:* ${phone}\n` +
            `*Queried Service:* ${service.title}\n` +
            `*Details:* ${query || 'Require checklist guidance.'}\n\n` +
            `Please verify eligible bank offers or update queues.`
          );
          window.open(`https://wa.me/919891067013?text=${messageText}`, '_blank');
        }, 1200);

        setName('');
        setPhone('');
        setQuery('');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to file inquiry log', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-body pt-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-accent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider">Loading Service Parameters...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-body pt-16 px-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-premium-sm border border-slate-100 flex flex-col items-center gap-5">
          <ShieldCheck className="w-12 h-12 text-slate-300" />
          <h3 className="font-display font-extrabold text-xl text-dark-blue">Service Profile Not Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">The requested service route or catalog might have been modified by office administrators.</p>
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 bg-dark-blue hover:bg-dark-blue-light text-white font-semibold text-xs rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  const prefilledWaMsg = encodeURIComponent(`Hello Cyber Hub Services, mujhe aapki service "${service.title}" ke baare me checklist inquiry karni hai.`);
  const directWaLink = `https://wa.me/919891067013?text=${prefilledWaMsg}`;

  return (
    <div className="min-h-screen bg-slate-50 font-body pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Back Link */}
        <Link to="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-dark-blue transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details & Checklist */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-premium-sm">
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <span className={`w-3.5 h-3.5 rounded-full ${
                  service.category === 'loans' ? 'bg-gold-accent' : 'bg-teal-accent'
                }`}></span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{service.category.replace('-', ' & ')}</span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-dark-blue tracking-tight mb-4">{service.title}</h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">{service.description}</p>
              
              {/* Badges details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100 mb-8">
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-teal-accent shadow-premium-sm">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-400">Processing Time</h4>
                    <p className="text-sm font-bold text-dark-blue mt-0.5">{service.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-teal-accent shadow-premium-sm">
                    <Coins className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-400">Estimated Charges</h4>
                    <p className="text-sm font-bold text-dark-blue mt-0.5">{service.serviceCharge}</p>
                  </div>
                </div>
              </div>

              {/* Document Lists Checklist */}
              <h3 className="font-display font-bold text-sm tracking-wide text-dark-blue mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-accent" />
                <span>Required Documents Checklist</span>
              </h3>

              <div className="border border-slate-100 bg-slate-50/20 rounded-xl p-6">
                <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                  {service.requiredDocuments && service.requiredDocuments.length > 0 ? (
                    service.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-[10px] mt-0.5">✓</span>
                        <span className="leading-relaxed font-medium">{doc}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs italic">No specific documents specified. Please consult our operators.</p>
                  )}
                </ul>
              </div>

            </div>

            {/* Service embedded FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="bg-white border border-slate-150 rounded-2xl p-6 sm:p-8 shadow-premium-sm">
                <h3 className="font-display font-bold text-sm tracking-wide text-dark-blue mb-5">Frequently Queries for {service.title}</h3>
                
                <div className="space-y-3">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                        className="w-full px-5 py-3.5 flex items-center justify-between text-left font-display cursor-pointer"
                      >
                        <span className="font-bold text-xs sm:text-sm text-dark-blue">{faq.question}</span>
                        <span className="text-slate-400 font-bold">{faqOpen === idx ? '−' : '+'}</span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-200 ${
                        faqOpen === idx ? 'max-h-[200px] border-t border-slate-100' : 'max-h-0'
                      }`}>
                        <p className="p-5 text-xs text-slate-500 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Context Inquiry Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-premium-lg">
              <h3 className="font-display font-bold text-base text-gold-accent mb-2 tracking-wide font-extrabold">Instant Assistance</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-6">File a digital checklist inquiry to receive verified support from Mayur Vihar operators.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name *</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Mobile Number *</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit phone"
                    pattern="[0-9]{10}"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Specific Query</label>
                  <textarea 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows="3"
                    placeholder={`e.g. Spelling error details...`}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-teal-accent text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-accent hover:bg-gold-accent-hover text-dark-blue font-display font-semibold text-xs py-3 rounded-lg shadow-premium-sm transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <span>Logging details...</span>
                  ) : (
                    <>
                      <span>File Inquiry Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="border-t border-white/5 pt-5 mt-5">
                <a
                  href={directWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] hover:bg-[#25d366] hover:text-white font-display font-semibold text-xs py-3 rounded-lg shadow-premium-sm transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ServiceDetail;
