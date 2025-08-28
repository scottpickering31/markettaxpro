import PDFDocument from "pdfkit";

export function buildSummaryPdf({
  userEmail,
  year,
  grossPence,
  expensesPence,
  profitRealPence,
  profitAllowancePence,
  recommended,
}: {
  userEmail: string;
  year: string;
  grossPence: number;
  expensesPence: number;
  profitRealPence: number;
  profitAllowancePence: number;
  recommended: "expenses" | "allowance";
}) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c as Buffer));
  const done = new Promise<Buffer>((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  );

  function gbp(p: number) {
    return `£${(p / 100).toFixed(2)}`;
  }

  doc.fontSize(20).text("Self-Employment Summary", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#555").text(`Tax year: ${year}`);
  doc.text(`User: ${userEmail}`);
  doc.moveDown();

  // Cards
  doc.fillColor("black").fontSize(12);
  doc.text(`Gross sales: ${gbp(grossPence)}`);
  doc.text(`Expenses (real): ${gbp(expensesPence)}`);
  doc.text(`Profit (real): ${gbp(profitRealPence)}`);
  doc.text(`Profit (with £1,000 allowance): ${gbp(profitAllowancePence)}`);
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .text(
      `Recommended: ${
        recommended === "expenses"
          ? "Use real expenses"
          : "Use £1,000 allowance"
      }`
    );
  doc.font("Helvetica");
  doc.moveDown();

  doc.text(
    "When filing online with HMRC (Self-Employment short pages), you’ll typically enter:"
  );
  doc.list([
    `Turnover (gross sales): ${gbp(grossPence)}`,
    `Total allowable expenses: ${gbp(
      expensesPence
    )}  (only if using real expenses)`,
    `OR: claim the £1,000 trading allowance instead`,
  ]);

  doc.moveDown();
  doc
    .fontSize(9)
    .fillColor("#777")
    .text("This document is guidance only and not tax advice.", {
      align: "left",
    });

  doc.end();
  return done;
}
