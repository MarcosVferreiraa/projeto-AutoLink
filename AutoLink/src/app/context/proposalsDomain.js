export const normalizeProposalDraft = (data) => {
  const proposalType = data?.proposalType || "cash";
  const financing = proposalType === "financing"
    ? {
        downPayment: Number(data?.financing?.downPayment || 0),
        months: Number(data?.financing?.months || 0),
        interestRate: Number(data?.financing?.interestRate || 0),
        monthlyPayment: Number(data?.financing?.monthlyPayment || 0),
        financedAmount: Number(data?.financing?.financedAmount || 0),
        totalInterest: Number(data?.financing?.totalInterest || 0),
        totalAmount: Number(data?.financing?.totalAmount || 0)
      }
    : null;

  return {
    ...data,
    proposalType,
    financing,
    originalPrice: Number(data?.originalPrice || 0),
    price: Number(data?.price || 0),
    status: "pending",
    createdAt: new Date().toISOString()
  };
};

export const normalizeProposalStatus = (rawStatus) => {
  const value = String(rawStatus || "").trim().toLowerCase();

  if (["approved", "aprovada", "aprovado"].includes(value)) {
    return "approved";
  }

  if (["rejected", "recusada", "recusado"].includes(value)) {
    return "rejected";
  }

  if (["pending", "pendente"].includes(value)) {
    return "pending";
  }

  return "pending";
};

export const validateProposalApproval = (proposal) => {
  if (!proposal) {
    return { valid: false, reason: "Proposta inválida." };
  }

  const requestedValue = Number(proposal.price || 0);
  const originalPrice = Number(proposal.originalPrice || 0);
  if (requestedValue <= 0 || originalPrice <= 0) {
    return { valid: false, reason: "Valores da proposta/preço do veículo inválidos." };
  }

  if (proposal.proposalType === "financing") {
    const financing = proposal.financing || {};
    const hasInvalidFinanceData =
      Number(financing.months || 0) <= 0 ||
      Number(financing.monthlyPayment || 0) <= 0 ||
      Number(financing.financedAmount || 0) <= 0;

    if (hasInvalidFinanceData) {
      return { valid: false, reason: "Dados de financiamento incompletos para aprovação." };
    }
  }

  return { valid: true, reason: "ok" };
};

export const sortProposalsForReview = (a, b) => {
  const statusA = normalizeProposalStatus(a.status);
  const statusB = normalizeProposalStatus(b.status);
  if (statusA === "pending" && statusB !== "pending") return -1;
  if (statusA !== "pending" && statusB === "pending") return 1;

  const dateA = Date.parse(a.createdAt || 0) || 0;
  const dateB = Date.parse(b.createdAt || 0) || 0;
  return dateB - dateA;
};

export const getProposalOwnerId = (proposal) => proposal?.buyerId || proposal?.userId;