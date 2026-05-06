"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ApiService } from "@/lib/api-service";

const fmt = (n: number) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LoanApprovedPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentFields, setPaymentFields] = useState<Record<string, string> | null>(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositPct, setDepositPct] = useState(10);
  const [installmentTerm, setInstallmentTerm] = useState(6);

useEffect(() => {
  const savedUrl = localStorage.getItem("installment_payment_url");
  if (savedUrl) setPaymentUrl(savedUrl);

  const fetchOrder = async () => {
    try {
      const res = await ApiService.fetchWithAuth(`/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);

        // Always prioritize DB values — most reliable across devices
        if (data.deposit_amount) {
          setDepositAmount(data.deposit_amount);
        } else {
          // Fallback to localStorage if DB empty
          const savedDeposit = localStorage.getItem("installment_deposit");
          if (savedDeposit) setDepositAmount(parseFloat(savedDeposit));
        }

        if (data.deposit_percentage) {
            setDepositPct(data.deposit_percentage);
        } else {
            const savedDepositPct = localStorage.getItem("installment_deposit_pct");
            if (savedDepositPct) setDepositPct(parseInt(savedDepositPct));
        }
            if (data.installment_term) setInstallmentTerm(data.installment_term);
        }
        } catch (err) {
            console.error("Failed to fetch order:", err);
        } finally {
            setLoading(false);
        }
    };

  fetchOrder();
}, [orderId]);

  const handlePayDeposit = () => {
    if (!paymentUrl) return;
    localStorage.removeItem("installment_payment_url");
    localStorage.removeItem("installment_deposit");
    localStorage.removeItem("installment_deposit_pct");
    window.location.href = paymentUrl;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your order...</p>
      </div>
    );
  }

  const total = order
    ? order.total_amount +
      (order.floor?.charges || 0) +
      (order.zone?.delivery_charges || 0) -
      (order.discount_amount || 0)
    : 0;

  const creditAmount = total - depositAmount;
  const term = 12; // default term
  const monthlyPayment = creditAmount / installmentTerm;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Success Banner */}
        <div className="mb-8 rounded-xl bg-green-50 border border-green-200 p-6 text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            🎉 Your Loan Has Been Approved!
          </h1>
          <p className="text-green-600 text-sm">
            Order #{orderId.slice(0, 8).toUpperCase()} — Pay your deposit to confirm your order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Order Details */}
          {order && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="border border-gray-200 rounded-xl p-5 space-y-3 text-sm">
                <SummaryRow label="Products Total" value={`£${fmt(order.total_amount)}`} />
                {order.floor?.charges > 0 && (
                  <SummaryRow label="Floor Delivery" value={`£${fmt(order.floor.charges)}`} />
                )}
                {order.zone?.delivery_charges > 0 && (
                  <SummaryRow label="Shipping" value={`£${fmt(order.zone.delivery_charges)}`} />
                )}
                {order.discount_amount > 0 && (
                  <SummaryRow label="Discount" value={`-£${fmt(order.discount_amount)}`} className="text-green-600" />
                )}
                <div className="border-t pt-3">
                  <SummaryRow label="Order Total" value={`£${fmt(total)}`} bold />
                </div>
              </div>
            </div>
          )}

          {/* Right: Installment Summary + Pay Deposit */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Installment Summary</h2>
            <div className="border border-gray-200 rounded-xl p-5 space-y-3 text-sm">
              <SummaryRow label={`Deposit (${depositPct}%)`} value={`£${fmt(depositAmount)}`} />
              <SummaryRow label="Credit Amount" value={`£${fmt(creditAmount)}`} />
              <SummaryRow label="Representative APR" value="0%" />
              <SummaryRow label="Interest" value="£0.00" />
              <SummaryRow label="Monthly Payments" value={`£${fmt(monthlyPayment)}`} />
              <SummaryRow label="Installment Term" value={`${installmentTerm} Months`} />
              <div className="border-t pt-3">
                <SummaryRow label="Total Amount Payable" value={`£${fmt(total)}`} bold />
              </div>

              {paymentUrl ? (
                <>
                  <div className="pt-2">
                    <button
                      onClick={handlePayDeposit}
                      className="w-full cursor-pointer rounded-full bg-green-600 px-8 py-4 font-semibold text-white shadow-md hover:bg-green-700 active:scale-[0.98] transition-all"
                    >
                      Pay Deposit — £{fmt(depositAmount)}
                    </button>
                  </div>
                  <p className="text-xs text-center text-gray-400 pt-1">
                    You will be redirected to our secure payment page.
                  </p>
                </>
              ) : (
                <div className="pt-2 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <p className="text-sm text-yellow-800 text-center">
                    Payment session expired. Please contact us at{" "}
                    <a href="tel:+447306127481" className="font-medium underline">
                      +44 7306 127481
                    </a>{" "}
                    to complete your deposit payment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
  className = "",
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-bold text-gray-900" : "text-gray-600"} ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}