import { LegalPageWrapper } from '../components/legal/LegalPageWrapper';
import { LegalPageHeader } from '../components/legal/LegalPageHeader';
import { LegalSection } from '../components/legal/LegalSection';

const TERMS_SECTIONS = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By accessing or using Tekkie Store ("Sole Town"), creating an account, or purchasing footwear and apparel through our platform, you agree to be bound by these Terms of Service and all policies referenced herein. If you do not agree, please refrain from using our services.',
  },
  {
    heading: '2. Use of the Service',
    body: 'You agree to use our website only for lawful purposes in accordance with these Terms. You may not disrupt website functionality, attempt unauthorized access to server infrastructure, scrape product data, or impersonate other individuals or entities.',
  },
  {
    heading: '3. Account Registration',
    body: 'When creating an account, you must provide true, accurate, and complete information. You are responsible for safeguarding your login credentials and for all activities that take place under your account. Notify us immediately if you suspect unauthorized account access.',
  },
  {
    heading: '4. Orders & Payment',
    body: 'All orders placed through Tekkie Store are subject to product availability and order confirmation. We reserve the right to refuse or cancel orders due to pricing inaccuracies or suspected fraudulent activity. Prices are listed in South African Rand (ZAR) and include applicable taxes unless indicated otherwise.',
  },
  {
    heading: '5. Shipping & Delivery',
    body: 'Delivery timelines provided at checkout are estimates. While we partner with reputable courier providers to ensure prompt delivery, Tekkie Store is not liable for unavoidable transit delays caused by customs, severe weather, or external logistical bottlenecks.',
  },
  {
    heading: '6. Returns & Refunds',
    body: 'We want you to love your kicks. Eligible items may be returned within 30 days of receipt, provided they are in unworn condition with original tags attached and original box packaging intact. Refunds will be credited to the original payment method upon inspection.',
  },
  {
    heading: '7. Intellectual Property',
    body: 'All brand marks, imagery, logos, website layout, graphics, and code are the intellectual property of Tekkie Store or its respective brand partners (Nike, Adidas, Puma, etc.). Unauthorized reproduction, distribution, or public display of website assets is strictly prohibited.',
  },
  {
    heading: '8. Limitation of Liability',
    body: 'To the maximum extent permitted by applicable law, Tekkie Store and its operators shall not be liable for any indirect, punitive, incidental, or consequential damages resulting from your use of the website or purchased merchandise.',
  },
  {
    heading: '9. Governing Law',
    body: 'These Terms of Service shall be governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising in connection with these terms shall be subject to the jurisdiction of the competent courts of South Africa.',
  },
  {
    heading: '10. Changes to These Terms',
    body: 'We reserve the right to revise and modify these Terms at our discretion. Significant updates will be communicated on our website or by email. Your continued use of Tekkie Store following changes constitutes your agreement to the amended Terms.',
  },
];

export const TermsOfService = () => {
  return (
    <LegalPageWrapper>
      <LegalPageHeader
        title="Terms of Service"
        subtitle="Last updated: September 5, 2026"
      />
      {TERMS_SECTIONS.map((section) => (
        <LegalSection
          key={section.heading}
          heading={section.heading}
          body={section.body}
        />
      ))}
    </LegalPageWrapper>
  );
};
