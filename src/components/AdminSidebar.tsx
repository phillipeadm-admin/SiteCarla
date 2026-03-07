'use client';

import Link from 'next/link';
import { Package, Utensils, ClipboardList, LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react';

export default function AdminSidebar() {
    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <div className="w-64 bg-[#3B2B23] text-[#FDFBF7] h-screen fixed left-0 top-0 flex flex-col p-6 shadow-xl z-50">
            <div className="mb-10 flex items-center gap-3">
                <div className="bg-[#E66A46] p-2 rounded-lg">
                    <Utensils className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-serif text-xl font-bold tracking-tight">Romagnolle <br /><span className="text-xs uppercase text-[#B9A38C] tracking-widest">Painel Admin</span></h1>
            </div>

            <nav className="flex-1 space-y-2">
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                    <LayoutDashboard className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Dashboard</span>
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                    <ClipboardList className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Pedidos</span>
                </Link>
                <Link href="/admin/batches" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                    <Package className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Fornadas</span>
                </Link>
                <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                    <Utensils className="w-5 h-5 text-[#B9A38C] group-hover:text-white" />
                    <span className="font-medium text-sm">Produtos</span>
                </Link>
            </nav>

            <div className="pt-6 border-t border-white/10 mt-auto space-y-4">
                <Link href="/" className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                    <ArrowLeft className="w-4 h-4" /> Ver Site
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-widest text-red-300 hover:text-red-100 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sair
                </button>
            </div>
        </div>
    );
}
