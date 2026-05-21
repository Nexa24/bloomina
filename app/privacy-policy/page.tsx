"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: "We may collect the following types of personal information when you visit our website, make a purchase, or interact with our services:",
      list: [
        { label: "Contact Information", desc: "Including your name, email address, phone number, and physical shipping/billing addresses." },
        { label: "Account Credentials", desc: "If you create a user account, we securely process your username, password, and authentication data." },
        { label: "Demographic Data", desc: "Such as age, gender, and personal clothing/sizing preferences." },
        { label: "Order and Transaction History", desc: "Complete details of garments, apparel, or products you have viewed, carted, or purchased from our website, along with payment success/failure statuses." },
        { label: "Device and Usage Information", desc: "Including your IP address, browser type, operating system, geolocation data, and analytics regarding how you navigate our pages." }
      ]
    },
    {
      title: "How We Use Your Information",
      content: "We utilize the collected information for specific, legitimate business purposes:",
      list: [
        { label: "Order Fulfillment", desc: "To process and complete transactions, manage shipping and logistics, communicate transit milestones, and handle customer support requests." },
        { label: "Account and Security Management", desc: "To register, authenticate, and safely manage your user profile, including secure OTP delivery and password resets." },
        { label: "Personalization & UI Optimization", desc: "To tailor content, size guides, and apparel recommendations on our storefront to better align with your shopping preferences." },
        { label: "Automated Notifications & Marketing", desc: "To send transactional alerts (order confirmations, delivery updates, and utility notifications) via SMS, email, or WhatsApp, as well as optional promotional campaigns and newsletters (which you can opt out of at any time)." },
        { label: "Analytics and Infrastructure Growth", desc: "To monitor system performance, track consumer conversion metrics, and consistently scale our web services." }
      ]
    },
    {
      title: "Information Sharing and Disclosure",
      content: "We respect your personal data and do not sell, rent, or trade it to third parties for their independent marketing practices. We share required information only with trusted service ecosystems that make our business operations possible:",
      list: [
        { label: "Payment Processing Infrastructure", desc: "Safely processing real-time payments through our verified partner gateway (Razorpay)." },
        { label: "Logistics and Delivery Partners", desc: "Sharing destination details with shipping aggregators (Shiprocket) to ensure accurate delivery." },
        { label: "Communication Gateways", desc: "Directing transactional variables through standard, secure cloud communication APIs (such as Amazon SES, Resend, or the Meta WhatsApp Business platform) to keep you informed." },
        { label: "Legal and Regulatory Compliance", desc: "When strictly mandated by Indian law or telecom/DLT frameworks to prevent fraud, protect digital infrastructure, or fulfill tax liabilities." }
      ]
    },
    {
      title: "Data Security",
      content: "We implement appropriate technical and organizational security protocols to shield your personal records from unauthorized access, loss, disclosure, alteration, or unexpected destruction. Sensitive backend databases are kept strictly confidential and accessed only via encrypted channels."
    },
    {
      title: "Your Rights",
      content: "Under applicable Indian data protection guidelines, you have distinct rights regarding your information:",
      list: [
        { label: "Access & Correction", desc: "The right to access, update, or correct inaccuracies in your stored account files." },
        { label: "Erasure & Deletion", desc: "The right to request the deletion or erasure of your personal transaction account records." },
        { label: "Consent Withdrawal", desc: "The right to withdraw consent or object to specific data processing pathways (such as opting out of promotional messaging feeds)." }
      ],
      footer: "To exercise any of these permissions or to submit specific privacy inquiries, please connect with our administrative support queue using the official information listed below."
    },
    {
      title: "Updates to This Policy",
      content: "We may routinely modify this privacy structure to accommodate changes in our operations, technical integrations, or legal guidelines in India. Any structural updates will be broadcast directly by updating the revised policy on this page."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Privacy Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Bloomina Sanctuary</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2">Effective Date: May 20, 2026</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-16 border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider leading-relaxed">
            These Terms of Service, Privacy Policy, and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.
          </p>
          <p className="text-surface-on-variant leading-relaxed text-sm font-light">
            Bloomina (the &quot;Website&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is owned and operated by <strong>LIVE WEAR APPARELS PRIVATE LIMITED</strong>, a company incorporated under the laws of India, with its registered office at 8/256 Pushpagiri, Koodaranhi, Kozhikode, Kerala - 673604. We are committed to protecting your privacy and providing you with a safe and secure online shopping experience.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-16">
          {sections.map((section, idx) => (
            <section key={idx} className="bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <h2 className="text-xl font-display font-semibold text-surface-on mb-6 flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                  {idx + 1}
                </span>
                {section.title}
              </h2>
              
              <p className="text-stone-600 leading-relaxed text-sm font-light mb-6">
                {section.content}
              </p>

              {section.list && (
                <ul className="space-y-4 pl-4 border-l-2 border-stone-100">
                  {section.list.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm">
                      <span className="font-semibold text-stone-800 block md:inline md:mr-2">
                        • {item.label}:
                      </span>
                      <span className="text-stone-500 font-light leading-relaxed">
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-stone-500 leading-relaxed text-xs italic mt-6 pt-6 border-t border-stone-50 font-light">
                  {section.footer}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Contact Info (Section 7) */}
        <div className="mt-16 bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-display font-semibold text-surface-on mb-6 flex items-center gap-4">
            <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-xs font-bold">
              7
            </span>
            Contact Us
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm font-light mb-8">
            For any legal clarity, account queries, data access requests, or privacy concerns, please contact our administrative desk:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-stone-50">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Email Contact</p>
                <a href="mailto:info@bloomina.in" className="text-sm font-medium text-primary hover:underline">
                  info@bloomina.in
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Corporate Identity Number (CIN)</p>
                <p className="text-sm font-semibold text-stone-800">U14101KL2025PTC097577</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Registered Address</p>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                LIVE WEAR APPARELS PRIVATE LIMITED,<br />
                8/256 Pushpagiri, Koodaranhi,<br />
                Kozhikode, Kerala, India - 673604.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-stone-100 flex justify-center">
            <Link 
              href="/contact"
              className="px-10 py-4 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Contact Support Queue
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
