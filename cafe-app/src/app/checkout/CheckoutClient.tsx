'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Receipt, CreditCard, Download, Star, ChevronRight, Banknote } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import GodavariLogo from '@/components/GodavariLogo';

export default function CheckoutClient() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get('table');

  const loc = (obj: any, key: string) => {
    if (language === 'en') return obj[key];
    return obj[`${key}_${language}`] || obj[key];
  };

  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');
  const [processingMethod, setProcessingMethod] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tableId) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?table=${tableId}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders for checkout", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [tableId]);

  // Calculate actual total
  const activeOrders = orders.filter(o => o.status !== 'closed' && o.status !== 'paid');
  const subtotal = activeOrders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum: number, item: any) => {
      return itemSum + (item.price_at_order_time * item.quantity);
    }, 0);
  }, 0);
  
  const gst = subtotal * 0.05; // 5% GST
  const serviceCharge = subtotal * 0.05; // 5% optional service charge
  const total = subtotal + gst + serviceCharge;

  const handlePayment = async (method: 'upi' | 'card' | 'cash') => {
    setProcessingMethod(method);
    setPaymentStatus('processing');
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Process payment and create bill in backend
    try {
      await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          subtotal: subtotal * 100,
          gst_amount: gst * 100,
          service_charge_amount: serviceCharge * 100,
          total_amount: total * 100,
          payment_method: method
        })
      });
    } catch (err) {
      console.error("Failed to process payment", err);
    }

    setPaymentStatus('success');
    setProcessingMethod(null);
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Cafe Receipt", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Table Number: ${tableId}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    doc.line(20, 55, 190, 55);
    
    doc.text("Items:", 20, 65);
    let yPos = 75;
    activeOrders.forEach(order => {
      order.items.forEach((item: any) => {
        doc.text(`${item.quantity}x ${loc(item, 'menu_item_name')}`, 20, yPos);
        yPos += 10;
      });
    });
    
    doc.line(20, yPos, 190, yPos);
    
    doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 20, yPos + 10);
    doc.text(`GST (5%): Rs. ${gst.toFixed(2)}`, 20, yPos + 20);
    doc.text(`Service Charge (5%): Rs. ${serviceCharge.toFixed(2)}`, 20, yPos + 30);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: Rs. ${total.toFixed(2)}`, 20, yPos + 40);
    doc.setFont('helvetica', 'normal');
    
    doc.text("Thank you for dining with us!", 20, yPos + 60);
    
    doc.save(`receipt-table-${tableId}.pdf`);
  };

  if (!tableId) return <div className="p-8 text-center text-red-500">Invalid Table</div>;
  if (isLoading) return <div className="p-8 text-center">Loading bill...</div>;
  if (activeOrders.length === 0 && paymentStatus !== 'success') {
    return <div className="p-8 text-center text-foreground/70">No active orders found for this table.</div>;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen heritage-bg p-4 flex flex-col items-center justify-center font-sans">
        <div className="bg-[#fcfaf5] p-8 rounded-3xl shadow-lg border border-primary/20 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <Receipt size={40} />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-primary">{t('Payment Successful!')}</h1>
          <p className="text-primary/70">{t('Thank you. Your bill has been paid.')}</p>
          
          <button 
            onClick={downloadReceipt}
            className="w-full bg-[#faeedf] text-primary border border-primary/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors shadow-sm"
          >
            <Download size={20} /> {t('Download Receipt')}
          </button>
          
          <div className="pt-6 border-t border-primary/10 mt-6">
            {!isReviewSubmitted ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-primary/80">{t('How was your food?')}</p>
                <div className="flex justify-center gap-2 text-accent mb-4">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      onClick={() => setRating(star)}
                      fill={star <= rating ? "currentColor" : "none"}
                      className="cursor-pointer hover:scale-110 transition-transform" 
                    />
                  ))}
                </div>
                
                {rating > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <textarea 
                      placeholder={t('Share your experience (optional)...')}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-primary/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                    />
                    <button 
                      onClick={() => setIsReviewSubmitted(true)}
                      className="w-full mt-3 bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors text-sm"
                    >
                      {t('Submit Feedback')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in zoom-in duration-300 py-4">
                <p className="text-green-600 font-bold text-lg">{t('Thank you for your feedback! 💖')}</p>
                <button 
                  onClick={() => router.push(`/?table=${tableId}`)}
                  className="mt-4 text-primary font-semibold underline text-sm"
                >
                  {t('Return to Menu')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Common Lotus Decoration
  const LotusDivider = () => (
    <div className="flex items-center justify-center gap-2 my-6 text-accent">
      <span className="w-16 h-px bg-accent/40"></span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 19 18 19 12C19 6 12 2 12 2C12 2 5 6 5 12C5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C12 22 15.5 18 15.5 12C15.5 6 12 2 12 2C12 2 8.5 6 8.5 12C8.5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12C2 12 7 15 12 15C17 15 22 12 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="w-16 h-px bg-accent/40"></span>
    </div>
  );

  return (
    <div className="min-h-screen heritage-bg font-sans flex flex-col relative text-primary overflow-x-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621251397732-c610b80ef5b7?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundColor: 'rgba(249, 246, 240, 0.95)', backgroundBlendMode: 'lighten' }}>
      {/* HEADER */}
      <header className="w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center relative z-10 border-b border-primary/20 gap-4 bg-[#F9F6F0]/80 backdrop-blur-sm">
        {/* Top Border Ornament */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-[-13px] bg-background px-4 text-accent rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 19 18 19 12C19 6 12 2 12 2C12 2 5 6 5 12C5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22C12 22 15.5 18 15.5 12C15.5 6 12 2 12 2C12 2 8.5 6 8.5 12C8.5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12C2 12 7 15 12 15C17 15 22 12 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          <GodavariLogo size={48} className="rounded-full shadow-sm bg-white" />
          <div className="flex flex-col">
            <h1 className="font-playfair font-bold text-xl tracking-widest text-primary uppercase leading-tight">Godavari</h1>
            <div className="flex items-center gap-2">
              <span className="w-3 h-[1px] bg-accent"></span>
              <p className="text-[9px] tracking-[0.25em] text-accent font-bold uppercase">The House of Heritage Experiences</p>
              <span className="w-3 h-[1px] bg-accent"></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-[#4a1c17] text-[#f6ecd9] px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M5 6v12M19 6v12M5 10h14"/>
            </svg>
            {t('Table')} {tableId}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center p-4 z-10 pt-12 pb-24 relative">
        {/* Card */}
        <div className="bg-[#fcfaf5] rounded-[1.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.1)] max-w-[480px] w-full border border-[#d6c7b0] relative">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-accent/80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-0">
              <path d="M4 4v8a8 8 0 0 0 8 8h8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 4l8 8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute top-3 right-3 text-accent/80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90">
              <path d="M4 4v8a8 8 0 0 0 8 8h8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 4l8 8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 text-accent/80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-90">
              <path d="M4 4v8a8 8 0 0 0 8 8h8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 4l8 8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 text-accent/80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
              <path d="M4 4v8a8 8 0 0 0 8 8h8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 4l8 8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>

          <h2 className="text-center font-playfair text-[22px] font-bold text-primary uppercase tracking-[0.15em] mt-2">{t('Bill Details')}</h2>
          
          <LotusDivider />
          
          <div className="space-y-4 text-[15px] font-medium text-[#2d1212] mb-6 px-4">
            <div className="flex justify-between">
              <span>{t('Subtotal')}</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('GST (5%)')}</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('Service Charge (5%)')}</span>
              <span>₹{serviceCharge.toFixed(2)}</span>
            </div>
          </div>

          <LotusDivider />

          <div className="flex justify-between items-center text-xl font-bold text-primary mb-8 font-playfair px-4 tracking-wide">
            <span className="uppercase">{t('Total')}</span>
            <span className="text-[22px]">₹{total.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-center gap-3 text-[#4a1c17] font-bold text-[13px] tracking-widest mb-6 uppercase">
            <span className="text-accent/80 text-[10px]">◈</span>
            <span className="mt-[2px]">{t('Select Payment Method')}</span>
            <span className="text-accent/80 text-[10px]">◈</span>
          </div>

          <div className="space-y-4 px-2">
            <button 
              onClick={() => handlePayment('upi')}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-[#faeedf] text-[#4a1c17] py-[14px] px-5 rounded-xl font-bold flex items-center justify-between border border-[#e8d5c4] hover:bg-[#f1e1cd] transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-[34px] h-[34px] rounded-full border border-primary/40 bg-transparent flex items-center justify-center italic text-xs font-serif tracking-tighter shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                  UPI
                </div>
                <span className="font-bold">{paymentStatus === 'processing' && processingMethod === 'upi' ? t('Processing...') : `Pay ₹${total.toFixed(2)} via UPI`}</span>
              </div>
              <ChevronRight size={18} className="text-primary/70" />
            </button>

            <button 
              onClick={() => handlePayment('card')}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-[#faeedf] text-[#4a1c17] py-[14px] px-5 rounded-xl font-bold flex items-center justify-between border border-[#e8d5c4] hover:bg-[#f1e1cd] transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-[34px] h-[34px] rounded-full border border-primary/40 bg-transparent flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                  <CreditCard size={16} className="text-[#4a1c17]" />
                </div>
                <span className="font-bold">{paymentStatus === 'processing' && processingMethod === 'card' ? t('Processing...') : `Pay ₹${total.toFixed(2)} via Card`}</span>
              </div>
              <ChevronRight size={18} className="text-primary/70" />
            </button>

            <button 
              onClick={() => handlePayment('cash')}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-[#faeedf] text-[#4a1c17] py-[14px] px-5 rounded-xl font-bold flex items-center justify-between border border-[#e8d5c4] hover:bg-[#f1e1cd] transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-[34px] h-[34px] rounded-full border border-primary/40 bg-transparent flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                  <Banknote size={16} className="text-[#4a1c17]" />
                </div>
                <span className="font-bold">{paymentStatus === 'processing' && processingMethod === 'cash' ? t('Processing...') : `Pay ₹${total.toFixed(2)} with Cash`}</span>
              </div>
              <ChevronRight size={18} className="text-primary/70" />
            </button>
          </div>
          
        </div>
      </main>
      
      {/* Bottom decorative wave/lotus */}
      <div className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-center border-t border-accent/30 bg-[#F9F6F0]/80 backdrop-blur-md">
         <div className="absolute top-[-14px] bg-[#F9F6F0] px-3 text-accent rounded-full shadow-sm border border-accent/20">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[2px]">
              <path d="M12 22C12 22 19 18 19 12C19 6 12 2 12 2C12 2 5 6 5 12C5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C12 22 15.5 18 15.5 12C15.5 6 12 2 12 2C12 2 8.5 6 8.5 12C8.5 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12C2 12 7 15 12 15C17 15 22 12 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
         </div>
         {/* Subtle wavy lines SVG pattern */}
         <div className="w-full h-full opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20, 50 10 T 100 10' fill='none' stroke='%23C9A84C' stroke-width='1'/%3E%3C/svg%3E\")" }}></div>
      </div>
    </div>
  );
}
