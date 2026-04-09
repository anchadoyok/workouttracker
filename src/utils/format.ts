export const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat("id-ID");

export const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

export const formatNumber = (value: number) => numberFormatter.format(value || 0);
