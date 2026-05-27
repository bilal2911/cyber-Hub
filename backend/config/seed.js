const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const SiteSettings = require('../models/SiteSettings');

// Load env variables
dotenv.config();

const seedData = async () => {
  try {
    console.log('📡 Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cyberhub');
    console.log('📡 Connected successfully.');

    // Clear existing entries
    console.log('🧹 Clearing old collections...');
    await Admin.deleteMany({});
    await Service.deleteMany({});
    await FAQ.deleteMany({});
    await Testimonial.deleteMany({});
    await SiteSettings.deleteMany({});
    console.log('🧹 Wiped collections.');

    // 1. Seed Default Admin
    console.log('🔒 Seeding Admin...');
    await Admin.create({
      username: 'admin',
      password: 'adminpassword123'
    });
    console.log('🔒 Admin seeded successfully. Credentials: admin / adminpassword123');

    // 2. Seed Site Settings
    console.log('⚙️ Seeding Site Settings...');
    await SiteSettings.create({
      businessName: 'Cyber Hub Services',
      tagline: 'Loan se lekar Cyber Work tak, sab kuch ek hi chhat ke neeche',
      phoneNumbers: ['9891067013', '8736909000'],
      whatsappNumber: '9891067013',
      address: '101 A, Street No. 13, Pratap Nagar, Mayur Vihar Phase-1, Delhi',
      emailNotifications: 'cyberhubservicesdelhi@gmail.com',
      openingHours: {
        weekdays: '09:30 AM - 08:30 PM',
        saturday: '09:30 AM - 08:30 PM',
        sunday: '10:00 AM - 02:00 PM'
      }
    });
    console.log('⚙️ Site Settings seeded.');

    // 3. Seed FAQs
    console.log('❓ Seeding FAQs...');
    const sampleFAQs = [
      { question: 'What are the shop opening and closing hours?', answer: 'We are open Monday to Saturday from 09:30 AM to 08:30 PM. Sundays are open half-day from 10:00 AM to 02:00 PM.', category: 'General' },
      { question: 'How many days does it take to update Aadhaar biometrics?', answer: 'Once we submit the biometric scan request, UIDAI usually processes updates in 5 to 10 working days.', category: 'Aadhaar' },
      { question: 'Do you charge any upfront commission fee for bank loans?', answer: 'No, we do not charge any upfront commission fees to check bank eligibility or file dossiers.', category: 'Loans' },
      { question: 'Can I WhatsApp my files to print before I arrive?', answer: 'Yes! Send files to 9891067013. We will print them out and keep them ready to minimize waiting.', category: 'General' }
    ];
    await FAQ.insertMany(sampleFAQs);
    console.log('❓ FAQs seeded.');

    // 4. Seed Testimonials
    console.log('💬 Seeding Testimonials...');
    const sampleTestimonials = [
      { name: 'Ramesh Negi', location: 'Pratap Nagar, Delhi', rating: 5, reviewText: 'Mere Aadhaar Card me date of birth galat thi. Main bahut pareshan tha. Cyber Hub Services ne sirf 10 minute me form fill karke update karwa diya!' },
      { name: 'Priya Sharma', location: 'Mayur Vihar Ph-1, Delhi', rating: 5, reviewText: 'I visited them for a Personal Loan for my shop expansion. The loan process was completely transparent, and I got my approval in 5 working days!' },
      { name: 'Amit Singh', location: 'Pocket-IV, Mayur Vihar, Delhi', rating: 5, reviewText: 'Inke paas high-speed laser printing ki suvidha hai. Maine pure project ke documents scan aur print karaye, rate bilkul sahi hai aur behavior cooperative hai.' }
    ];
    await Testimonial.insertMany(sampleTestimonials);
    console.log('💬 Testimonials seeded.');

    // 5. Seed 13 Services
    console.log('🛠️ Seeding Services...');
    const sampleServices = [
      {
        title: 'Aadhaar DOB Correction',
        slug: 'aadhaar-dob',
        category: 'aadhaar-pan',
        description: 'Correct your Date of Birth (DOB) parameters to match birth certificates or secondary education board sheets.',
        iconName: 'icon-aadhaar',
        estimatedTime: '5-7 Working Days',
        serviceCharge: '₹100',
        requiredDocuments: ['Aadhaar Card (Original)', 'Birth Certificate OR 10th Class Marksheet'],
        faqs: [
          { question: 'Can we change DOB multiple times?', answer: 'UIDAI allows DOB correction only once in ordinary cases. Subsequent changes require regional head approvals.' }
        ]
      },
      {
        title: 'Aadhaar Name Update',
        slug: 'aadhaar-name',
        category: 'aadhaar-pan',
        description: 'Legally change or rectify spellings, surnames, or initials on your Aadhaar card with appropriate verification certificates.',
        iconName: 'icon-aadhaar',
        estimatedTime: '5-10 Working Days',
        serviceCharge: '₹100',
        requiredDocuments: ['Old Aadhaar Card (Copy)', 'Identity Proof (Voter ID/PAN/Passport)', 'Address Proof (Utility Bills)'],
        faqs: [
          { question: 'What standard proofs are allowed?', answer: 'Standard proofs include Voter Cards, Passports, Bank Passbooks with Photo, and Gazetted officer certificates.' }
        ]
      },
      {
        title: 'Aadhaar Photo Update',
        slug: 'aadhaar-photo',
        category: 'aadhaar-pan',
        description: 'Appointment booking and document preparation for updating facial photo or outdated fingerprint biometrics.',
        iconName: 'icon-aadhaar',
        estimatedTime: '5 Working Days',
        serviceCharge: '₹100',
        requiredDocuments: ['Aadhaar Card (Original)'],
        faqs: [
          { question: 'Is any photo print proof required?', answer: 'No photo prints are needed. The operator will capture your biometric photo live at the update station.' }
        ]
      },
      {
        title: 'Aadhaar Card Correction',
        slug: 'aadhaar-correction',
        category: 'aadhaar-pan',
        description: 'Quick guidance and portal assistance to correct wrong details in your official biometric Aadhaar Card database.',
        iconName: 'icon-aadhaar',
        estimatedTime: '5-7 Working Days',
        serviceCharge: '₹100',
        requiredDocuments: ['Aadhaar Card (Original)', 'Matching Supporting Identity Proof'],
        faqs: []
      },
      {
        title: 'New PAN Card',
        slug: 'new-pan',
        category: 'aadhaar-pan',
        description: 'Apply for a brand new Permanent Account Number (PAN) Card, vital for financial, banking, and tax reporting requirements.',
        iconName: 'icon-pan',
        estimatedTime: '7-12 Working Days',
        serviceCharge: '₹150',
        requiredDocuments: ['Aadhaar Card (Linked with active mobile)', '2 Passport Size Photos', 'Signature specimen'],
        faqs: [
          { question: 'Can we get an e-PAN immediately?', answer: 'Yes! If your Aadhaar is linked to your mobile, an e-PAN can be generated in PDF form within 2 hours.' }
        ]
      },
      {
        title: 'PAN Card Correction',
        slug: 'pan-correction',
        category: 'aadhaar-pan',
        description: 'Rectify spelling errors, update father\'s name, change signature, or reissue damaged PAN card records.',
        iconName: 'icon-pan',
        estimatedTime: '10-15 Working Days',
        serviceCharge: '₹150',
        requiredDocuments: ['Old PAN Card copy', 'Aadhaar Card with matching updated details'],
        faqs: []
      },
      {
        title: 'Home Loan',
        slug: 'home-loan',
        category: 'loans',
        description: 'Low-interest home financing and top-ups with leading nationalized/private bank tie-ups and simplified approval.',
        iconName: 'icon-loan',
        estimatedTime: '5-7 Working Days',
        serviceCharge: 'Zero Upfront Fees',
        requiredDocuments: ['Aadhaar Card & PAN Card', 'Last 6 Months Salary Slips', 'Last 6 Months Bank Statement', 'Property Registry documents'],
        faqs: [
          { question: 'What is the standard interest rate?', answer: 'Rates vary based on CIBIL profiles, but standard rates float between 8.4% and 9.5% per annum.' }
        ]
      },
      {
        title: 'Car/Bike Loan',
        slug: 'vehicle-loan',
        category: 'loans',
        description: 'Supercharge your vehicular dreams. Minimal documentation, lightning quick processing, and maximum loan valuation.',
        iconName: 'icon-loan',
        estimatedTime: '2-3 Working Days',
        serviceCharge: 'Zero Upfront Fees',
        requiredDocuments: ['Aadhaar & PAN Card', 'Last 6 Months Bank Statement', 'Income proof (ITR / Form 16)'],
        faqs: []
      },
      {
        title: 'Business/Personal Loan',
        slug: 'business-loan',
        category: 'loans',
        description: 'Boost business scale or fulfill immediate personal financial obligations with un-collateralized flexible capital loans.',
        iconName: 'icon-loan',
        estimatedTime: '3-5 Working Days',
        serviceCharge: 'Zero Upfront Fees',
        requiredDocuments: ['Aadhaar & PAN Card', 'GST Registration Proof (for Business)', 'Current Bank statements'],
        faqs: []
      },
      {
        title: 'Loan Against Property',
        slug: 'property-loan',
        category: 'loans',
        description: 'Leverage the true market equity value of your residential, commercial, or industrial lands at prime low HSL rates.',
        iconName: 'icon-loan',
        estimatedTime: '7-10 Working Days',
        serviceCharge: 'Zero Upfront Fees',
        requiredDocuments: ['Original Registry Deed', 'Aadhaar & PAN Card', 'Last 3 Years ITR filings'],
        faqs: []
      },
      {
        title: 'Insurance Services',
        slug: 'insurance-services',
        category: 'loans',
        description: 'Secure instant renewals for Motorbike, Car, Health, and Term Life Policies from top-tier trusted companies.',
        iconName: 'icon-insurance',
        estimatedTime: 'Same Day Renewal',
        serviceCharge: 'Actual premium rate',
        requiredDocuments: ['Old Insurance Policy copy', 'RC Book (Registration Certificate)', 'Aadhaar Card copy'],
        faqs: []
      },
      {
        title: 'Printing & Scanning',
        slug: 'printing-scanning',
        category: 'cyber',
        description: 'Ultra-crisp black & white/color printouts, heavy document scanning, PDF creations, and direct lamination works.',
        iconName: 'icon-cyber',
        estimatedTime: 'Instant (In-Shop)',
        serviceCharge: 'Based on page count',
        requiredDocuments: ['PDF/Image Files sent on email or WhatsApp'],
        faqs: []
      },
      {
        title: 'Online Form Filling',
        slug: 'online-forms',
        category: 'cyber',
        description: 'Expert application submission for Government Jobs, College Admissions, Voter Cards, Driving License, etc.',
        iconName: 'icon-cyber',
        estimatedTime: 'Same Day Submission',
        serviceCharge: '₹50 - ₹100 service charge',
        requiredDocuments: ['Academic Certificates', 'Passport Size Photo scan', 'Aadhaar Card copy'],
        faqs: []
      }
    ];
    await Service.insertMany(sampleServices);
    console.log('🛠️ Services seeded.');

    console.log('✅ Seeding complete! Database successfully populated.');
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  }
};

seedData();
