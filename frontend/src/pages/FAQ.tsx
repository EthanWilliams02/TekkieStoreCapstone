import { useState } from 'react';
import { FaqPageWrapper } from '../components/faq/FaqPageWrapper';
import { FaqHeader } from '../components/faq/FaqHeader';
import { FaqCategoryPills } from '../components/faq/FaqCategoryPills';
import { FaqAccordionItem } from '../components/faq/FaqAccordionItem';
import { FaqContactCallout } from '../components/faq/FaqContactCallout';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  'All',
  'Orders',
  'Shipping & Returns',
  'Sizing',
  'Payments',
  'Account',
];

const FAQ_DATA: FAQItem[] = [
  {
    id: 'ord-1',
    category: 'Orders',
    question: 'How do I track the status of my order?',
    answer:
      'Once your order has been dispatched, you will receive an email and SMS containing your parcel tracking number and a link to trace your delivery in real-time through our courier portal.',
  },
  {
    id: 'ord-2',
    category: 'Orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'Because we begin processing sneakers promptly to ensure rapid fulfillment, modifications or cancellations are only possible within 30 minutes of placing your order. Please contact customer support immediately for urgent changes.',
  },
  {
    id: 'ord-3',
    category: 'Orders',
    question: 'Where can I find my order confirmation receipt?',
    answer:
      'A confirmation email with an itemized invoice is dispatched automatically following a successful payment. You can also view and download past invoices from your Account profile page.',
  },
  {
    id: 'ship-1',
    category: 'Shipping & Returns',
    question: 'How long does standard delivery take in South Africa?',
    answer:
      'Standard delivery to major metro hubs (Cape Town, Johannesburg, Durban, Pretoria) typically takes 2 to 4 business days. Regional and outlying areas may take 4 to 6 business days.',
  },
  {
    id: 'ship-2',
    category: 'Shipping & Returns',
    question: 'What is your returns and exchange policy?',
    answer:
      'We accept returns and exchanges on unworn shoes within 30 days of delivery. The footwear must be in brand new condition, including all tags, spare laces, and the original undamaged shoe box.',
  },
  {
    id: 'ship-3',
    category: 'Shipping & Returns',
    question: 'Which courier services do you partner with?',
    answer:
      'We partner with premier nationwide couriers including Aramex, DHL Express, and The Courier Guy to ensure your sneakers arrive securely and on schedule.',
  },
  {
    id: 'size-1',
    category: 'Sizing',
    question: 'Are sizes displayed in UK or US measurements?',
    answer:
      'All shoe sizes on Tekkie Store are listed in standard UK sizing unless explicitly specified otherwise on the product page. Refer to our size guide table on product pages for US and EU conversions.',
  },
  {
    id: 'size-2',
    category: 'Sizing',
    question: 'What should I do if the sneakers fit too tight or loose?',
    answer:
      'No stress! If your pair does not fit comfortably, initiate an exchange within 30 days through our returns center, and we will swap it for the proper size subject to warehouse stock availability.',
  },
  {
    id: 'pay-1',
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer:
      'We accept major credit and debit cards (Visa, Mastercard), Instant EFT via Ozow/SiD, and standard electronic funds transfers. All transactions are securely encrypted.',
  },
  {
    id: 'pay-2',
    category: 'Payments',
    question: 'Is my card payment secure?',
    answer:
      'Yes, completely. All payments are processed through PCI-DSS Level 1 certified payment gateways. We never store or log your raw credit card numbers or CVV codes on our servers.',
  },
  {
    id: 'acc-1',
    category: 'Account',
    question: 'How do I update my delivery address or phone number?',
    answer:
      'You can update your personal contact details, saved delivery addresses, and preferences at any time by signing in and navigating to your Profile dashboard.',
  },
  {
    id: 'acc-2',
    category: 'Account',
    question: 'How do I reset my account password?',
    answer:
      'Click on the "Forgot Password?" link on the sign-in page, enter your registered email address, and follow the instructions sent to your inbox to reset your password safely.',
  },
];

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === activeCategory);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <FaqPageWrapper>
      <FaqHeader />

      <FaqCategoryPills
        categories={FAQ_CATEGORIES}
        activeCategory={activeCategory}
        onSelect={(category) => {
          setActiveCategory(category);
          setOpenId(null);
        }}
      />

      <div>
        {filteredFaqs.map((faq) => (
          <FaqAccordionItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openId === faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>

      <FaqContactCallout />
    </FaqPageWrapper>
  );
};
