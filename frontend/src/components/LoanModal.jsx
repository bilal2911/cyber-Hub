import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const LoanModal = ({ isOpen, onClose, onShowToast }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Delhi',
    loanType: 'Home Loan',
    amount: '₹5,00,000 - ₹15,00,000',
    occupation: 'Salaried'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [authChecked, setAuthChecked] = useState(true);

  if (!isOpen) return null;

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return formData.name.trim().length >= 2 && formData.phone.trim().length >= 10;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill out all required credentials correctly!');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authChecked) {
      alert('Please check the authorization checkbox!');
      return;
    }

    setSubmitting(true);
    
    try {
      // Build Multipart Form Data payload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('city', formData.city);
      data.append('loanType', formData.loanType);
      data.append('amount', formData.amount);
      data.append('occupation', formData.occupation);

      selectedFiles.forEach((file) => {
        data.append('documents', file);
      });

      const res = await api.post('/loans', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        onShowToast('Loan Request Filed!', 'success');
        
        // WhatsApp redirection pre-filled text compilation
        setTimeout(() => {
          const waMessage = encodeURIComponent(
            `*New Loan Inquiry Form Filed*\n\n` +
            `*Name:* ${formData.name}\n` +
            `*Phone:* ${formData.phone}\n` +
            `*Loan Type:* ${formData.loanType}\n` +
            `*Range:* ${formData.amount}\n` +
            `*Occupation:* ${formData.occupation}\n\n` +
            `Please review my file attachments and guide me further.`
          );
          window.open(`https://wa.me/919891067013?text=${waMessage}`, '_blank');
        }, 1200);

        handleReset();
        onClose();
      }
    } catch (error) {
      console.error(error);
      onShowToast(error.response?.data?.message || 'Failed to submit loan dossier files', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      phone: '',
      city: 'Delhi',
      loanType: 'Home Loan',
      amount: '₹5,00,000 - ₹15,00,000',
      occupation: 'Salaried'
    });
    setSelectedFiles([]);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[1000] flex items-center justify-center p-4 bg-dark-blue/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-cream-card rounded-2xl shadow-premium-lg border border-slate-100 overflow-hidden font-body animate-bounce-subtle">
        
        {/* Header bar */}
        <div className="bg-dark-blue px-6 py-5 flex items-center justify-between text-white border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-gold-accent rounded-lg flex items-center justify-center text-dark-blue font-bold">
              <ShieldCheck className="w-5 h-5 text-dark-blue" />
            </span>
            <div>
              <h3 className="font-display font-extrabold text-base tracking-wide text-gold-accent">PRE-ELIGIBILITY INQUIRY</h3>
              <p className="text-[10px] text-slate-300 tracking-wider">Fast Bank Tie-ups Eligibility Check</p>
            </div>
          </div>
          <button 
            onClick={() => { handleReset(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
            disabled={submitting}
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Wizard Progression dots indicator */}
        <div className="px-8 pt-6 flex items-center justify-between bg-slate-50/50 pb-2 border-b border-slate-100">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === step 
                  ? 'bg-teal-accent text-white shadow-premium-sm' 
                  : currentStep > step 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 text-slate-400'
              }`}>
                {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
              </span>
              <span className={`text-[10px] font-bold tracking-wider uppercase hidden sm:inline ${
                currentStep === step ? 'text-dark-blue' : 'text-slate-400'
              }`}>
                {step === 1 ? 'Personal' : step === 2 ? 'Loan Details' : 'Documents'}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard step contents */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">Applicant Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  placeholder="Enter name matching PAN/Aadhaar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-accent text-dark-blue"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">Active Contact Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleTextChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-accent text-dark-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">Residential City *</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleTextChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-accent text-dark-blue"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Loan Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">Select Loan Category</label>
                <select 
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleTextChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-accent text-dark-blue cursor-pointer"
                >
                  <option value="Home Loan">Home Loan (Housing Finance)</option>
                  <option value="Car/Bike Vehicle Loan">Car/Bike Vehicle Loan</option>
                  <option value="Business/Personal Loan">Business / Personal Loan</option>
                  <option value="Loan Against Property">Loan Against Property (LAP)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">Estimated Loan Amount</label>
                <select 
                  name="amount"
                  value={formData.amount}
                  onChange={handleTextChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-accent text-dark-blue cursor-pointer"
                >
                  <option value="₹1,00,000 - ₹5,00,000">₹1 Lakh to ₹5 Lakhs</option>
                  <option value="₹5,00,000 - ₹15,00,000">₹5 Lakhs to ₹15 Lakhs</option>
                  <option value="₹15,00,000 - ₹30,00,000">₹15 Lakhs to ₹30 Lakhs</option>
                  <option value="₹30,00,000 - ₹75,00,000">₹30 Lakhs to ₹75 Lakhs</option>
                  <option value="₹75,00,000+">₹75 Lakhs +</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">Employment Profile</label>
                <select 
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleTextChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-teal-accent text-dark-blue cursor-pointer"
                >
                  <option value="Salaried">Salaried (Private / Govt job)</option>
                  <option value="Self Employed">Self Employed (Business Owner)</option>
                  <option value="Agriculturist">Agriculturist / Farmer</option>
                  <option value="Unemployed / Other">Other Profiles</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: File Uploads */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-0.5">Attach Identification / Bank Docs</label>
              <p className="text-[10px] text-slate-400 leading-normal mb-2">Upload copy of Aadhaar, PAN, Bank Statement, or Salary Slips (Supported formats: PDF, PNG, JPG. Max size 10MB per file).</p>
              
              <div className="relative border-2 border-dashed border-slate-200 hover:border-teal-accent bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer transition-colors duration-200">
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.zip"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-xs text-dark-blue">Click or Drag Files Here to Upload</p>
                <p className="text-[9px] text-slate-400 mt-1">Files will be safely stored in secure servers</p>
              </div>

              {/* Uploaded File list queue */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto mt-3 pr-1">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-100 rounded-lg p-2.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate font-semibold">{file.name}</span>
                        <span className="text-[9px] text-slate-400 shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-rose-500 hover:text-rose-600 font-bold px-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Auth terms checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input 
                  type="checkbox"
                  id="authChecked"
                  checked={authChecked}
                  onChange={(e) => setAuthChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-accent focus:ring-teal-accent cursor-pointer"
                />
                <label htmlFor="authChecked" className="text-[10px] text-slate-400 leading-normal select-none cursor-pointer">
                  I authorize Cyber Hub Services Delhi representatives to process documents and check eligible bank offers.
                </label>
              </div>
            </div>
          )}

          {/* Form Actions footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-dark-blue font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                disabled={submitting}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div> // Spacing dummy
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-dark-blue hover:bg-dark-blue-light text-white font-semibold text-xs rounded-lg transition-all cursor-pointer ml-auto shadow-premium-sm"
              >
                <span>Continue Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-2 px-6 py-2.5 bg-gold-accent text-dark-blue hover:bg-gold-accent-hover font-semibold text-xs rounded-lg transition-all cursor-pointer ml-auto shadow-premium-sm ${
                  submitting ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <span>Submitting Dossiers...</span>
                ) : (
                  <>
                    <span>Finish & Submit</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default LoanModal;
