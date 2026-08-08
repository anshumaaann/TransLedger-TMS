import api from "./api";

export type PaymentParty = "customer" | "broker";

export interface Payment {
  id: string;
  booking_id: string;
  customer_id?: string;
  broker_id?: string;
  party_type: PaymentParty;
  payment_date: string;
  amount: number;
  tds_amount: number;
  payment_method?: string;
  reference_number?: string;
  remarks?: string;
  created_at: string;
}

export interface CreatePaymentPayload {
  booking_id: string;
  party_type: PaymentParty;
  payment_date: string;
  amount: number;
  tds_amount?: number;
  payment_method?: string;
  reference_number?: string;
  remarks?: string;
}

export interface LedgerEntry {
  entry_date: string;
  booking_id?: string;
  payment_id?: string;
  booking_number?: string;
  description: string;
  debit: number;
  credit: number;
  running_balance: number;
}

export interface Ledger {
  party_id: string;
  party_name: string;
  party_type: PaymentParty;
  outstanding_amount: number;
  entries: LedgerEntry[];
}

export const getPayments = async () => (await api.get<Payment[]>("/payments/")).data;
export const createPayment = async (data: CreatePaymentPayload) => (await api.post<Payment>("/payments/", data)).data;
export const deletePayment = async (id: string) => (await api.delete(`/payments/${id}`)).data;
export const getCustomerLedger = async (id: string) => (await api.get<Ledger>(`/ledgers/customers/${id}`)).data;
export const getBrokerLedger = async (id: string) => (await api.get<Ledger>(`/ledgers/brokers/${id}`)).data;
