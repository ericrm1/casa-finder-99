/**
 * Configuração centralizada da imobiliária.
 * Valores sensíveis/ambiente vêm de variáveis VITE_* (ver .env.example).
 */
export interface AgencyConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
}

const env = import.meta.env;

export const agency: AgencyConfig = {
  name: env['VITE_AGENCY_NAME'] ?? "Cerrado Imóveis",
  tagline: "Imobiliária em Alto Paraíso e região",
  phone: env['VITE_AGENCY_PHONE'] ?? "(62) 99999-0000",
  whatsappNumber: env['VITE_WHATSAPP_NUMBER'] ?? "5562999990000",
  email: env['VITE_AGENCY_EMAIL'] ?? "contato@cerradoimoveis.com.br",
  address: env['VITE_AGENCY_ADDRESS'] ?? "Av. Ary Valadão Filho, 250 — Alto Paraíso de Goiás/GO",
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${agency.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function propertyInterestMessage(publicCode: string): string {
  return `Olá! Tenho interesse no imóvel ${publicCode}. Gostaria de receber mais informações.`;
}
