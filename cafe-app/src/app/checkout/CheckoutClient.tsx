'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Receipt, CreditCard, Download, Star } from 'lucide-react';
import jsPDF from 'jspdf';

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableId = searchParams.get('table');

  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending');
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

  const handlePayment = async () => {
    setPaymentStatus('processing');
    // Mock Razorpay delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('success');
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
        doc.text(`${item.quantity}x ${item.menu_item_name}`, 20, yPos);
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
      <div className="min-h-screen bg-secondary p-4 flex flex-col items-center justify-center">
        <div className="bg-card p-8 rounded-3xl shadow-lg max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <Receipt size={40} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-foreground/60">Thank you. Your bill has been paid.</p>
          
          <button 
            onClick={downloadReceipt}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <Download size={20} /> Download Receipt
          </button>
          
          <div className="pt-6 border-t mt-6">
            {!isReviewSubmitted ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground/80">How was your food?</p>
                <div className="flex justify-center gap-2 text-yellow-400 mb-4">
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
                      placeholder="Share your experience (optional)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                    />
                    <button 
                      onClick={() => setIsReviewSubmitted(true)}
                      className="w-full mt-3 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors text-sm"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-in zoom-in duration-300 py-4">
                <p className="text-green-600 font-bold text-lg">Thank you for your feedback! 💖</p>
                <button 
                  onClick={() => router.push(`/?table=${tableId}`)}
                  className="mt-4 text-primary font-semibold underline text-sm"
                >
                  Return to Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-4 flex flex-col items-center pt-12">
      <div className="bg-card p-6 rounded-3xl shadow-sm border max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Bill Details</h1>
        
        <div className="space-y-3 text-sm text-foreground/80 border-b pb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="font-semibold">₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge (5%)</span>
            <span className="font-semibold">₹{serviceCharge.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between text-xl font-bold text-foreground pt-2">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button 
          onClick={handlePayment}
          disabled={paymentStatus === 'processing'}
          className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-70"
        >
          <CreditCard size={20} />
          {paymentStatus === 'processing' ? 'Processing...' : `Pay ₹${total.toFixed(2)} via Razorpay`}
        </button>
      </div>
    </div>
  );
}
