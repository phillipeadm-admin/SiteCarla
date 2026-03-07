'use client';

import { useToastStore } from '@/store/useToastStore';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast() {
    const { isVisible, message, type } = useToastStore();
    const [render, setRender] = useState(false);

    useEffect(() => {
        if (isVisible) setRender(true);
        else {
            const timeout = setTimeout(() => setRender(false), 300); // tempo de animacao
            return () => clearTimeout(timeout);
        }
    }, [isVisible]);

    if (!render) return null;

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertCircle className="w-5 h-5 text-orange-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-4 w-full flex justify-center pointer-events-none">
            <div className={`bg-white text-[#3B2B23] px-6 py-4 rounded-2xl shadow-2xl border border-[#EBE6DF] flex flex-col md:flex-row items-center gap-4 max-w-lg transition-all duration-300 pointer-events-auto ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
                <div className="flex-shrink-0 bg-[#FAF5EF] p-2 rounded-full">
                    {icons[type]}
                </div>
                <p className="text-sm font-medium leading-relaxed text-center md:text-left">
                    {message}
                </p>
            </div>
        </div>
    );
}
