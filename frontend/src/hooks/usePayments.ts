import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPayment, deletePayment, getPayments } from "../services/payment";

export function usePayments() {
  const queryClient = useQueryClient();
  const refreshFinancialData = () => {
    queryClient.invalidateQueries({ queryKey: ["payments"] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    queryClient.invalidateQueries({ queryKey: ["ledger"] });
  };
  const paymentsQuery = useQuery({ queryKey: ["payments"], queryFn: getPayments });
  const createMutation = useMutation({ mutationFn: createPayment, onSuccess: refreshFinancialData });
  const deleteMutation = useMutation({ mutationFn: deletePayment, onSuccess: refreshFinancialData });
  return {
    ...paymentsQuery,
    createPayment: createMutation.mutateAsync,
    deletePayment: deleteMutation.mutateAsync,
  };
}
