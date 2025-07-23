export interface PaymentResponse {
  data: {
    id: string;
    status: string;           // PENDING, APPROVED, DECLINED…
    amount_in_cents: number;
    reference: string;
    payment_method_type: string;
    // …otros campos del payload de W
  };
}
