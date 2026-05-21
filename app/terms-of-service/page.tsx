"use client";

import React from 'react';
import Link from 'next/link';

const TermsOfServicePage = () => {
  const sections = [
    {
      title: "Access and Account",
      content: "By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, and you have given us your consent to allow any of your minor dependents to use the Services on devices you own, purchase, or manage.",
      extra: "To use the Services, including accessing or browsing our online store or purchasing any of the products or services we offer, you may be asked to provide certain information, such as your email address, billing, payment, and shipping information. You represent and warrant that all the information you provide in our store is correct, current, and complete and that you have all rights necessary to provide this information. You are solely responsible for maintaining the security of your account credentials (including secure verification data or passwords) and for all of your account activity. You may not transfer, sell, assign, or license your account to any other person."
    },
    {
      title: "Our Products",
      content: "We have made every effort to provide an accurate representation of our products and services—specifically ready-made garments, apparel, and innerwear—in our online store. However, please note that colors, fabric textures, or product appearance may differ from how they appear on your screen due to the type of device you use to access the store and your device settings and configuration.",
      extra: "We do not warrant that the appearance or quality of any products or services purchased by you will meet your expectations or be exactly as rendered in our online store. All descriptions of products are subject to change at any time without notice at our sole discretion. We reserve the right to discontinue any product at any time and may limit the quantities of any products that we offer to any person, geographic region, or jurisdiction, on a case-by-case basis."
    },
    {
      title: "Orders and Acceptance",
      content: "When you place an order, you are making an offer to purchase. Bloomina reserves the right to accept or decline your order for any reason at its discretion. Your order is not accepted until we confirm acceptance via email or automated digital notification. We must receive and process your payment through our payment gateway ecosystem before your order is accepted.",
      extra: "Please review your order carefully before submitting, as we may be unable to accommodate cancellation requests after an order is accepted. In the event that we do not accept, make a change to, or cancel an order, we will attempt to notify you by contacting the e‑mail, billing address, and/or phone number provided at the time the order was made. Your purchases are subject to return or exchange solely in accordance with our Return and Refund Policy. You represent and warrant that your purchases are for your own personal or household use and not for commercial resale or export."
    },
    {
      title: "Prices and Billing",
      content: "Prices, discounts, and promotions are subject to change without notice. The price charged for a product or service will be the price in effect at the time the order is placed and will be set out in your order confirmation. Unless otherwise expressly stated, posted prices do not include applicable taxes (GST), shipping, or handling charges, which will be calculated at checkout.",
      extra: "You agree to provide current, complete, and accurate purchase, payment, and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and payment details, so that we can complete your transactions and contact you as needed. You represent and warrant that: the payment infrastructure credentials you provide are true, correct, and complete; you are duly authorized to use such accounts or cards for the purchase; charges incurred by you will be honored by your financial institution or card gateway; and you will pay charges incurred by you at the posted prices, including shipping and handling charges and all applicable statutory taxes, if any."
    },
    {
      title: "Shipping and Delivery",
      content: "We coordinate with reliable domestic logistics aggregators to fulfill order distribution. However, we are not liable for shipping and delivery delays. All delivery times are estimates only and are not guaranteed.",
      extra: "We are not responsible for delays caused by shipping carriers, logistics disruptions, weather, or events outside our control. Once we transfer products to the transit carrier, title and risk of loss passes to you."
    },
    {
      title: "Intellectual Property",
      content: "Our Services, including but not limited to the brand name BLOOMINA, trademarks, text, custom source code, displays, images, graphics, interface architecture, audio, and video, are owned by LIVE WEAR APPARELS PRIVATE LIMITED, its affiliates, or licensors and are protected by Indian and international copyright, trademark, and other intellectual property regulations.",
      extra: "These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, republish, download, store, or transmit any of the structural material on our Services without our prior written consent. Unauthorized use of the Services may be a violation of applicable intellectual property statutes."
    },
    {
      title: "Integrated Third-Party Tools",
      content: "The Services utilize advanced integrations and optional client tools offered by third-party systems (such as logistics infrastructure, communication channels, and payment gateways) which are provided on an “as is” and “as available” basis without any operational warranties or endorsements from our side.",
      extra: "We shall have no liability whatsoever arising from or relating to your use of optional third-party integrations. Any use of such integrations is entirely at your own risk."
    },
    {
      title: "Errors and Inaccuracies",
      content: "Occasionally there may be information within our interface that contains typographical errors, inaccuracies, or omissions that may relate to product descriptions, sizing guides, pricing, promotional campaigns, shipping weights, transit windows, and local availability.",
      extra: "We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information or cancel orders if any information is inaccurate at any time without prior notice (including after you have submitted your order)."
    },
    {
      title: "Prohibited Uses",
      content: "You may access and use the Services for lawful purposes only. You may not access or use the Services, directly or indirectly:",
      list: [
        "For any unlawful or malicious purpose.",
        "To violate any local, state, national, or international regulations, rules, or laws.",
        "To infringe upon or violate our intellectual property rights or the rights of others.",
        "To transmit false, automated, or misleading information.",
        "To upload or transmit viruses, malware, or any other type of malicious code that could impact the functionality of the system or database infrastructure.",
        "To scrape, crawl, spider, or systematically extract data from the storefront."
      ],
      footer: "We reserve the right to suspend, disable, or permanently terminate your account and access privileges without notice if we determine you have violated any part of these Prohibited Uses."
    },
    {
      title: "Disclaimer of Warranties; Limitation of Liability",
      content: "The information presented on or through the Services is made available solely for general information purposes. We do not warrant that your use of our service will be uninterrupted, completely secure, or error-free.",
      extra: "EXCEPT AS EXPRESSLY STATED BY US, THE SERVICES AND ALL PRODUCTS DELIVERED TO YOU THROUGH THE STORE ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' FOR YOUR CONSUMPTION, WITHOUT ANY REPRESENTATION, WARRANTIES, OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, DURABLE QUALITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO CASE SHALL LIVE WEAR APPARELS PRIVATE LIMITED, OUR DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, CONTRACTORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INJURY, LOSS, CLAIM, OR ANY DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, SPECIAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING, WITHOUT LIMITATION, LOST PROFITS, LOST REVENUE, LOSS OF DATA, REPLACEMENT COSTS, OR ANY SIMILAR DAMAGES, WHETHER BASED IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, ARISING FROM YOUR USE OF ANY OF THE SERVICES OR ANY PRODUCTS PROCURED USING THE SERVICES."
    },
    {
      title: "Governing Law",
      content: "These Terms of Service, any separate operating guidelines, and agreements whereby we provide you Services shall be governed by, interpreted, and construed in accordance with the laws of India.",
      extra: "Any legal disputes, claims, or proceedings arising out of these terms shall be subject to the exclusive venue and jurisdiction of the appropriate courts located in Kozhikode, Kerala, India."
    },
    {
      title: "Changes to Terms of Service",
      content: "You can review the most current version of the Terms of Service at any time on this page. We reserve the right, in our sole discretion, to update, change, or replace any part of these Terms of Service by posting updates directly to our website storefront.",
      extra: "It is your responsibility to check our website periodically for updates. Your continued use of or access to the website following the posting of modifications constitutes binding acceptance of those changes."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Terms of Service</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Bloomina Agreement</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2">Effective Date: May 20, 2026</p>
        </div>

        {/* Overview & Welcome */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-16 border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-6">
          <h2 className="text-xl font-display font-semibold text-surface-on">Overview</h2>
          <p className="text-surface-on-variant leading-relaxed text-sm font-light">
            Welcome to Bloomina! The terms &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to Bloomina. Bloomina operates this store and website, including all related information, content, features, tools, products, and services in order to provide you, the customer, with a curated shopping experience (the &quot;Services&quot;).
          </p>
          <p className="text-surface-on-variant leading-relaxed text-sm font-light">
            The website and storefront are owned and operated by <strong>LIVE WEAR APPARELS PRIVATE LIMITED</strong>, a company incorporated under the laws of India, with its registered office at 8/256 Pushpagiri, Koodaranhi, Kozhikode, Kerala - 673604.
          </p>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider leading-relaxed">
            The below terms and conditions, together with any policies referenced herein (these &quot;Terms of Service&quot; or &quot;Terms&quot;) describe your rights and responsibilities when you use the Services. Please read these Terms of Service carefully, as they include important information about your legal rights and cover areas such as warranty disclaimers and limitations of liability.
          </p>
          <p className="text-surface-on-variant leading-relaxed text-sm font-light pt-2">
            By visiting, interacting with, or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these Terms of Service or Privacy Policy, you should not use or access our Services.
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
              
              <p className="text-stone-600 leading-relaxed text-sm font-light mb-4">
                {section.content}
              </p>

              {section.extra && (
                <p className="text-stone-500 leading-relaxed text-sm font-light mb-4">
                  {section.extra}
                </p>
              )}

              {section.list && (
                <ul className="space-y-2 pl-6 list-disc text-stone-500 font-light text-sm mb-4">
                  {section.list.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item}
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

        {/* Contact Info (Section 13) */}
        <div className="mt-16 bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-display font-semibold text-surface-on mb-6 flex items-center gap-4">
            <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-xs font-bold">
              13
            </span>
            Contact Information
          </h2>
          <p className="text-stone-600 leading-relaxed text-sm font-light mb-8">
            Questions regarding these Terms of Service or operational orders should be directed to our administration team at:
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Corporate Entity Name</p>
                <p className="text-sm font-semibold text-stone-800">LIVE WEAR APPARELS PRIVATE LIMITED</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Registered Office Address</p>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
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

export default TermsOfServicePage;
