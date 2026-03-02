export const envPublic = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Company",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? "",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  defaultWaNumber: process.env.NEXT_PUBLIC_DEFAULT_WA_NUMBER ?? "",
  defaultWaTemplate:
    process.env.NEXT_PUBLIC_DEFAULT_WA_TEMPLATE ??
    "Hi, I'd like to request a quote for [Machine Name] ([Machine ID]).",
};
