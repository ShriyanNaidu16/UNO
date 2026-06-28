'use client';

import { useState } from 'react';
import QRCode from 'qrcode';

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
    <div className="min-h-screen bg-secondary p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Admin Panel</h1>
      
      <div className="bg-card p-6 rounded-2xl shadow-sm border max-w-md">
        <h2 className="text-xl font-bold mb-4">Generate Table QR Code</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Table Number</label>
            <input 
              type="number" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background"
              placeholder="e.g. 12"
            />
          </div>
          
          <button 
            onClick={generateQRCode}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
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
              className="bg-secondary text-secondary-foreground border px-6 py-2 rounded-lg font-bold hover:bg-secondary/80 transition-colors"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
