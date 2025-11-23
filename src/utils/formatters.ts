/**
 * Utilitários de formatação
 */

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export const formatCPFCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 11) {
    // CPF: 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cleaned.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return value;
};

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length === 11) {
    // Celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    // Telefone: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return value;
};

export const formatMonthYear = (monthYear: string): string => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getDaysAgo = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getStatusColor = (
  status: string
): { bg: string; text: string; badge: string } => {
  const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
    // Status gerais
    ativo: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', badge: 'badge-success' },
    inativo: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', badge: 'badge badge-secondary' },

    // Pedidos
    pendente: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', badge: 'badge-warning' },
    aprovado: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', badge: 'badge-info' },
    faturado: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', badge: 'badge-success' },
    cancelado: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', badge: 'badge-danger' },
    entregue: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', badge: 'badge-success' },

    // Financeiro
    pago: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', badge: 'badge-success' },
    aberto: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', badge: 'badge-info' },
    vencido: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', badge: 'badge-danger' },
    inadimplente: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', badge: 'badge-danger' },

    // Notas fiscais
    emitida: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', badge: 'badge-info' },
    autorizada: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', badge: 'badge-success' },
    denegada: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', badge: 'badge-danger' },
  };

  return statusColors[status.toLowerCase()] || {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-800 dark:text-gray-200',
    badge: 'badge'
  };
};
