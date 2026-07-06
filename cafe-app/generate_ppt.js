const pptxgen = require('pptxgenjs');

async function createPresentation() {
  let pres = new pptxgen();

  // Slide 1: Title
  let slide1 = pres.addSlide();
  slide1.addText('Godavari Cafe App', { x: 1, y: 2, w: 8, fontSize: 44, bold: true, align: 'center', color: '8B0000' });
  slide1.addText('Next-Generation Dining Experience', { x: 1, y: 3, w: 8, fontSize: 24, align: 'center', color: '333333' });
  slide1.addText('Client Presentation', { x: 1, y: 4.5, w: 8, fontSize: 18, align: 'center', color: '666666' });

  // Slide 2: Overview
  let slide2 = pres.addSlide();
  slide2.addText('Project Overview', { x: 0.5, y: 0.5, w: 9, fontSize: 32, bold: true, color: '8B0000' });
  slide2.addText([
    { text: 'A premium, multi-facility web application built for modern dining.', options: { bullet: true } },
    { text: 'Combines Godavari Restaurant, Rooms, and Sky Lounge into one seamless portal.', options: { bullet: true } },
    { text: 'Digital-first approach to ordering, payments, and customer interaction.', options: { bullet: true } }
  ], { x: 0.5, y: 1.5, w: 9, h: 3, fontSize: 20, color: '333333' });

  // Slide 3: Key Features
  let slide3 = pres.addSlide();
  slide3.addText('Key Features', { x: 0.5, y: 0.5, w: 9, fontSize: 32, bold: true, color: '8B0000' });
  slide3.addText([
    { text: 'AI Virtual Waiter:', options: { bold: true, bullet: true } },
    { text: ' Powered by Google GenAI for contextual menu recommendations.' },
    { text: 'Multilingual Digital Menu:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' English, Telugu, Hindi, and Kannada support.' },
    { text: 'Live Order Tracking & PDF Bills:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' QR codes and downloadable invoices.' },
    { text: 'Mock Payments & Checkout:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' Streamlined end-to-end checkout flow.' }
  ], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 18, color: '333333' });

  // Slide 4: Operations & Admin
  let slide4 = pres.addSlide();
  slide4.addText('Operations & Admin', { x: 0.5, y: 0.5, w: 9, fontSize: 32, bold: true, color: '8B0000' });
  slide4.addText([
    { text: 'Kitchen Display System (KDS):', options: { bold: true, bullet: true } },
    { text: ' Real-time order sync for chefs to prepare food efficiently.' },
    { text: 'Admin Dashboard:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' Comprehensive view of daily revenue.' },
    { text: 'Data Visualizations:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' Interactive charts using Recharts library.' }
  ], { x: 0.5, y: 1.5, w: 9, h: 3, fontSize: 18, color: '333333' });

  // Slide 5: Tech Stack
  let slide5 = pres.addSlide();
  slide5.addText('The Technology Stack', { x: 0.5, y: 0.5, w: 9, fontSize: 32, bold: true, color: '8B0000' });
  slide5.addText([
    { text: 'Next.js (App Router):', options: { bold: true, bullet: true } },
    { text: ' For robust routing, API endpoints, and server-side rendering.' },
    { text: 'React 19 & Tailwind CSS:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' For a highly responsive, animated (Framer Motion), and modern UI.' },
    { text: 'Supabase:', options: { bold: true, bullet: true, breakLine: true } },
    { text: ' For scalable database and backend capabilities.' }
  ], { x: 0.5, y: 1.5, w: 9, h: 3, fontSize: 18, color: '333333' });

  // Slide 6: Conclusion
  let slide6 = pres.addSlide();
  slide6.addText('Thank You', { x: 1, y: 2, w: 8, fontSize: 44, bold: true, align: 'center', color: '8B0000' });
  slide6.addText('Ready for Deployment & Scalability', { x: 1, y: 3.5, w: 8, fontSize: 24, align: 'center', color: '333333' });

  // Save the Presentation
  await pres.writeFile({ fileName: 'Godavari_App_Presentation.pptx' });
  console.log('Presentation created successfully!');
}

createPresentation();
