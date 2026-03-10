'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Utensils, ClipboardList, LayoutDashboard, ArrowLeft, LogOut, Image, Bell } from 'lucide-react';
import { getPendingNotificationsCount } from '../app/admin/actions';

export default function AdminSidebar() {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const count = await getPendingNotificationsCount();
            setPendingCount(count);
        };
        fetchCount();
        
        // Polling de 2 segundos para o alerta aparecer "instantaneamente"
        const interval = setInterval(fetchCount, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <div className="w-64 bg-[#3B2B23] text-[#FDFBF7] h-screen fixed left-0 top-0 flex flex-col p-6 shadow-xl z-55">
            <div className="mb-10 flex items-center gap-3">
                <div className="bg-[#E66A46] p-2 rounded-lg">
                    <Utensils className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-serif text-xl font-bold tracking-tight">Romagnolle <br /><span className="text-xs uppercase text-[#B9A38C] tracking-widest">Painel Admin</span></h1>
            </div>

            <nav className="flex-1 space-y-1">
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group hover:translate-x-2">
                    <LayoutDashboard className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Dashboard</span>
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group hover:translate-x-2">
                    <ClipboardList className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Pedidos</span>
                </Link>
                <Link href="/admin/batches" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group hover:translate-x-2">
                    <Package className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Fornadas</span>
                </Link>
                <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group hover:translate-x-2">
                    <Utensils className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Produtos</span>
                </Link>
                <Link href="/admin/notifications" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group relative hover:translate-x-2">
                    <div className="w-5 h-5 flex items-center justify-center relative">
                        <Bell className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                        {pendingCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E66A46] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E66A46] border-2 border-[#3B2B23] animate-pulse"></span>
                            </span>
                        )}
                    </div>
                    <span className="font-medium text-sm">Notificações</span>
                </Link>
            </nav>

            <div className="pt-6 border-t border-white/10 mt-auto space-y-4">
                <Link href="/admin/gallery" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group hover:translate-x-2">
                    <Image className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Galeria (Vitrine)</span>
                </Link>
                <Link href="/" target="_blank" className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 opacity-80 hover:opacity-100 italic hover:translate-x-2">
                    <ArrowLeft className="w-4 h-4" /> Ver Site Inicial
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-red-300 hover:text-red-100 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sair do Painel
                </button>
            </div>
        </div>
    );
}
