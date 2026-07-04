'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import RevenueDashboard from './RevenueDashboard';

export default function AdminPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateQRCode = async () => {
    if (!tableNumber) return;
    try {
      // In production, this would be the actual deployed URL
      const url = `${window.location.origin}/menu?table=${tableNumber}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `table-${tableNumber}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-secondary pb-12">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground p-4 md:p-6 shadow-md rounded-b-3xl mb-8 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
            <p className="text-primary-foreground/80 mt-1 text-sm md:text-base">Manage restaurant revenue and table QR codes</p>
          </div>
        </div>
      </header>
      
      <main className="px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-card p-6 rounded-2xl shadow-sm border max-w-md">
          <h2 className="text-xl font-bold mb-4">Generate Table QR Code</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Table Number</label>
              <input 
                type="number" 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="e.g. 12"
              />
            </div>
            
            <button 
              onClick={generateQRCode}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 active:scale-95 transition-all duration-300 shadow-sm shadow-primary/20"
            >
              Generate QR
            </button>
          </div>

          {qrCodeUrl && (
            <div className="mt-8 text-center border-t pt-8">
              <p className="text-sm font-medium mb-4">QR Code for Table {tableNumber}</p>
              <img src={qrCodeUrl} alt="Table QR" className="mx-auto rounded-xl shadow-md border p-2 bg-white mb-4" />
              <button 
                onClick={downloadQR}
                className="bg-secondary text-secondary-foreground border px-6 py-2 rounded-lg font-bold hover:bg-secondary/80 active:scale-95 transition-all"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>

        <RevenueDashboard />
      </main>
    </div>
  );
}
