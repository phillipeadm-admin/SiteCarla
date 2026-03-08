/**
 * Formata um número de telefone para o padrão WhatsApp (apenas números, com DDI 55 se necessário)
 */
export function formatPhoneForWhatsApp(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 10) {
        return `55${cleaned}`;
    }
    return cleaned;
}

/**
 * Gera um link de WhatsApp para notificação de fornada
 */
export function generateWhatsAppLink(phone: string, customerName: string, productName: string): string {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const message = encodeURIComponent(`Olá ${customerName}, o ${productName} que você pediu para ser avisado já está disponível!`);
    return `https://wa.me/${formattedPhone}?text=${message}`;
}
