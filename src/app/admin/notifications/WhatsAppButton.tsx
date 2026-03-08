'use client';

import { markNotificationAsRead } from '../actions';

interface WhatsAppButtonProps {
    id: string;
    customerPhone: string;
    customerName: string;
    productName: string;
}

export default function WhatsAppButton({ id, customerPhone, customerName, productName }: WhatsAppButtonProps) {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const message = `Olá ${customerName}, o ${productName} que você pediu para ser avisado já está disponível!`;
    const href = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async () => {
                await markNotificationAsRead(id);
            }}
            className="text-[10px] font-bold uppercase bg-[#25D366] text-white px-4 py-2 rounded-xl hover:bg-[#128C7E] transition-colors"
        >
            Chamar no WhatsApp
        </a>
    );
}
