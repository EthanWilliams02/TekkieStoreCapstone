import { LegalPageWrapper } from '../components/legal/LegalPageWrapper';
import { LegalPageHeader } from '../components/legal/LegalPageHeader';
import { LegalSection } from '../components/legal/LegalSection';

const PRIVACY_SECTIONS = [
  {
    heading: '1. Information We Collect',
    body: 'When you browse Tekkie Store, create an account, or place an order, we collect information you provide directly to us. This includes your name, email address, phone number, shipping address, billing address, and payment transaction details. We also automatically gather device information, browsing actions, and IP addresses through standard server logs.',
  },
  {
    heading: '2. How We Use Your Information',
    body: 'We use the information we collect to fulfill orders, process payments, coordinate deliveries, and provide customer support. Additionally, your data helps us personalize your shopping experience, prevent fraud, optimize our website performance, and deliver promotional updates that align with your sneaker preferences (which you can opt out of at any time).',
  },
  {
    heading: '3. Cookies & Tracking',
    body: 'Tekkie Store uses cookies and similar tracking technologies to remember items in your cart, retain your login sessions, and analyze website traffic. You can adjust your browser settings to decline cookies, though certain functionalities like persistent carts and checkout may not operate as intended without them.',
  },
  {
    heading: '4. Data Sharing & Third Parties',
    body: 'We do not sell your personal data to third parties. We share your information strictly with trusted service providers necessary to operate our business, such as payment gateways, courier delivery partners, and Cloudinary media hosting. All partners are contractually obligated to safeguard your data in compliance with relevant data privacy laws.',
  },
  {
    heading: '5. Your Rights & Choices',
    body: 'You have the right to access, rectify, or request deletion of your personal details stored on our servers. You may update your profile information directly through your account dashboard or contact our privacy team to exercise your data subject rights, including opting out of direct marketing communications.',
  },
  {
    heading: '6. Data Security',
    body: 'We implement rigorous technical and organizational safeguards, including SSL/TLS encryption, salted password hashing, and tokenized session management, to protect your personal information against unauthorized access, loss, or misuse.',
  },
  {
    heading: '7. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory adjustments. We will notify you of any material modifications by revising the "Last updated" date at the top of this page or providing direct notice through your registered account.',
  },
  {
    heading: '8. Contact Us',
    body: 'If you have questions, feedback, or concerns regarding our privacy practices or wish to submit a data request, please reach out to our team at support@tekkiestore.co.za or visit our Contact Us page.',
  },
];

export const PrivacyPolicy = () => {
  return (
    <LegalPageWrapper>
      <LegalPageHeader
        title="Privacy Policy"
        subtitle="Last updated: September 5, 2026"
      />
      {PRIVACY_SECTIONS.map((section) => (
        <LegalSection
          key={section.heading}
          heading={section.heading}
          body={section.body}
        />
      ))}
    </LegalPageWrapper>
  );
};
