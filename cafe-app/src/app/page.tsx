import { redirect } from "next/navigation";

export default function Home() {
  // Automatically redirect to the customer menu for a demo table
  // In a real scenario, the QR code points directly to /menu?table=ID
  redirect('/menu?table=12');
}
