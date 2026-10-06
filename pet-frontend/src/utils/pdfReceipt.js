import { jsPDF } from "jspdf";

/**
 * Generates and downloads a simple adoption/purchase receipt PDF.
 * @param {{orderId:string, amount:number, currency:string, date:string, customerEmail:string, items:Array<{name:string, quantity:number, price:number}>}} data
 */
export function downloadReceiptPdf(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 64;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(61, 110, 93); // forest-500
  doc.text("Pet Adoption Receipt", marginX, y);

  y += 28;
  doc.setDrawColor(61, 110, 93);
  doc.setLineWidth(1);
  doc.line(marginX, y, 547, y);

  y += 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(22, 36, 31);
  doc.text(`Receipt / Order ID: ${data.orderId}`, marginX, y);
  y += 18;
  doc.text(`Date: ${data.date}`, marginX, y);
  y += 18;
  doc.text(`Customer: ${data.customerEmail}`, marginX, y);

  y += 32;
  doc.setFont("helvetica", "bold");
  doc.text("Item", marginX, y);
  doc.text("Qty", 340, y);
  doc.text("Price", 400, y);
  doc.text("Subtotal", 470, y);
  y += 8;
  doc.setLineWidth(0.5);
  doc.line(marginX, y, 547, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  (data.items || []).forEach((item) => {
    doc.text(item.name, marginX, y);
    doc.text(String(item.quantity), 340, y);
    doc.text(`Rs ${item.price.toFixed(2)}`, 400, y);
    doc.text(`Rs ${(item.price * item.quantity).toFixed(2)}`, 470, y);
    y += 20;
  });

  y += 8;
  doc.line(marginX, y, 547, y);
  y += 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Total Paid: ${data.currency || "INR"} ${data.amount.toFixed(2)}`, marginX, y);

  y += 40;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for giving a pet a loving home.", marginX, y);

  doc.save(`adoption-receipt-${data.orderId}.pdf`);
}
