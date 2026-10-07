export const bookingUrl = 'https://cal.com/skcapital/free-financial-breakdown';
export const emailAddress = 'advisory@skcapital.co.in';
export const enquiryUrl = (subject: string) => `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`;
export const offers = [
  { name: 'Margin Check', description: 'See what each sale leaves after its direct costs.', prices: { INR: 2000, USD: 25, AED: 95 }, features: ['Share prices and direct costs for up to 10 products, services or projects in our template.', 'Get a margin comparison and one simple price-or-cost scenario.', 'Receive a one-page summary with up to three points to investigate.'] },
  { name: 'Four-Week Cash Snapshot', description: 'See when expected receipts and payments could leave cash tight.', prices: { INR: 3500, USD: 45, AED: 165 }, features: ['Share your opening cash balance and up to 20 expected receipts and payments, with dates, in our template.', 'Get a four-week cash forecast and one delayed-payment scenario.', 'Receive a one-page summary highlighting potential shortfalls and questions to resolve.'] },
  { name: 'Plan vs Actual Review', description: 'Understand where recent results differed from your plan.', prices: { INR: 5000, USD: 59, AED: 219 }, features: ['Share an existing budget and matching monthly actuals for up to three months and 15 income or expense categories.', 'Get a comparison highlighting the three largest differences by value.', 'Receive a one-page summary of possible drivers and questions to investigate with your team.'] },
];
