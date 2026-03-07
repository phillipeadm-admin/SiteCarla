'use client';

import { useState } from 'react';
import { Utensils } from 'lucide-react';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Chamada para uma API route ou Server Action para validar e setar o cookie
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            window.location.href = '/admin';
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF5EF] flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-[#EBE6DF] w-full max-w-md text-center">
                <div className="bg-[#3B2B23] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Utensils className="w-8 h-8 text-white" />
                </div>

                <h1 className="font-serif text-3xl font-black text-[#3B2B23] mb-2 tracking-tight">Romagnolle</h1>
                <p className="text-[#8B6E5B] text-xs font-bold uppercase tracking-widest mb-10">Acesso Restrito ao Painel</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-left">
                        <label className="text-[10px] font-bold text-[#8B6E5B] uppercase px-1 mb-2 block">Senha Administrativa</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Digite a sua senha"
                            className={`w-full bg-[#FAF5EF] border-2 ${error ? 'border-red-300' : 'border-transparent'} rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#3B2B23] transition-all`}
                        />
                        {error && <p className="text-red-500 text-[10px] font-bold mt-2 px-1 uppercase tracking-wider">Senha incorreta. Tente novamente.</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3B2B23] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#5C4D44] transition-all active:scale-95"
                    >
                        ENTRAR NO PAINEL
                    </button>
                </form>

                <p className="mt-8 text-[10px] text-[#A39184] font-medium leading-relaxed">
                    Este painel contém dados sensíveis de vendas. <br />
                    Em caso de perda de acesso, consulte o arquivo .env
                </p>
            </div>
        </div>
    );
}
