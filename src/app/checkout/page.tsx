'use client';

import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowLeft, Truck, Store, CheckCircle, MapPin, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createOrder } from './actions';
import CartTimer from '@/components/CartTimer';

export default function CheckoutPage() {
    const { items, addItem, decreaseItem, removeItem, clearCart, total, finishOrder } = useCartStore();
    const [deliveryType, setDeliveryType] = useState<'RETIRADA' | 'ENTREGA'>('RETIRADA');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [isLoadingZip, setIsLoadingZip] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const subtotal = total();
    const freight = deliveryType === 'ENTREGA' ? 15.0 : 0.0;
    const finalTotal = subtotal + freight;

    const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setZipCode(value);

        if (value.length === 8) {
            setIsLoadingZip(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setAddress(data.logradouro);
                    setNeighborhood(data.bairro);
                    setCity(data.localidade);
                    setState(data.uf);
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            } finally {
                setIsLoadingZip(false);
            }
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocalização não é suportada pelo seu navegador.');
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    if (data && data.address) {
                        setAddress(data.address.road || '');
                        setNeighborhood(data.address.suburb || data.address.neighbourhood || '');
                        setCity(data.address.city || data.address.town || data.address.village || '');
                        setState(data.address.state || '');
                        
                        if (data.address.postcode) {
                            setZipCode(data.address.postcode.replace(/\D/g, ''));
                        }
                    } else {
                        alert('Não foi possível encontrar o endereço para esta localização.');
                    }
                } catch (error) {
                    console.error("Erro ao buscar localização:", error);
                    alert('Erro ao buscar endereço da localização.');
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                console.error("Erro de geolocalização:", error);
                alert('Não foi possível acessar sua localização. Verifique as permissões do navegador.');
                setIsFetchingLocation(false);
            }
        );
    };

    const handlePayment = async () => {
        if (!customerName || !customerPhone) {
            alert('Por favor, preencha nome e telefone para identificação.');
            return;
        }

        if (deliveryType === 'ENTREGA' && (!address || !zipCode || !number || !neighborhood)) {
            alert('Por favor, preencha o endereço completo para entrega.');
            return;
        }

        const fullAddress = deliveryType === 'ENTREGA' 
            ? `${address}, ${number} - ${neighborhood}, ${city}/${state}` 
            : 'Retirada na Padaria';

        setIsSubmitting(true);
        const result = await createOrder({
            customerName,
            customerPhone,
            deliveryType,
            address: fullAddress,
            zipCode,
            totalAmount: finalTotal,
            items: items.map(i => ({
                batchId: i.id,
                quantity: i.quantity,
                pricePaid: i.price
            }))
        });

        if (result.success && result.paymentUrl) {
            window.location.href = result.paymentUrl;
        } else {
            alert(result.error || 'Erro ao processar pedido. Tente novamente.');
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-12 shadow-sm border border-[#E8E0D5]">
                    <h2 className="font-serif text-3xl font-medium text-[#1E1A17] mb-4">Seu cesto está vazio</h2>
                    <p className="text-[#5C5552] mb-8">Que tal escolher um pão quentinho para começar?</p>
                    <Link href="/" className="bg-[#D6C1AE] text-[#1E1A17] px-8 py-4 font-bold hover:bg-[#c9af96] transition-all uppercase tracking-widest text-xs">
                        Voltar para a Padaria
                    </Link>
                </div>
            </div>
        );
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, '($1');
        }
        setCustomerPhone(value);
    };

    return (
        <div className="min-h-screen bg-[#F5F2EC] py-16 md:py-24 px-6 md:px-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center">
                        <Link href="/#top" className="flex items-center gap-2 text-[#A89078] font-bold uppercase text-[10px] tracking-widest hover:text-[#1E1A17] transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </Link>
                        <button 
                            onClick={() => {
                                if(confirm("Deseja realmente esvaziar seu cesto?")) clearCart();
                            }}
                            className="flex items-center gap-2 text-red-400 hover:text-red-600 font-bold uppercase text-[10px] tracking-widest transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Esvaziar Carrinho
                        </button>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <h1 className="font-serif text-[40px] md:text-[56px] font-medium text-[#1E1A17] leading-tight">Finalizar Pedido</h1>
                        <div className="mb-2">
                            <CartTimer />
                        </div>
                    </div>

                    <div className="bg-white p-8 shadow-sm border border-[#E8E0D5]">
                        <h2 className="font-serif text-2xl font-medium text-[#1E1A17] mb-6">Identificação</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest">Seu Nome</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Nome Completo"
                                    className="bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest">WhatsApp</label>
                                <input
                                    type="text"
                                    value={customerPhone}
                                    onChange={handlePhoneChange}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                    className="bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 shadow-sm border border-[#E8E0D5]">
                        <h2 className="font-serif text-2xl font-medium text-[#1E1A17] mb-8 border-b border-[#F5F2EC] pb-4">Seu Cesto</h2>
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                    <div className="relative w-24 h-24 bg-[#F5F2EC] flex-shrink-0">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[#1E1A17] text-lg">{item.name}</h3>
                                        <p className="text-[10px] text-[#A89078] font-bold uppercase tracking-widest mt-1">{item.isHot ? 'Pronta Entrega' : 'Fornada Agendada'}</p>
                                        <p className="font-medium text-sm mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-[#F5F2EC] px-4 py-2">
                                        <button onClick={() => decreaseItem(item.id)} className="text-[#1E1A17] hover:text-[#A89078]"><Minus className="w-4 h-4" /></button>
                                        <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                                        <button onClick={() => addItem(item)} className="text-[#1E1A17] hover:text-[#A89078]"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 shadow-sm border border-[#E8E0D5]">
                        <h2 className="font-serif text-2xl font-medium text-[#1E1A17] mb-8">Como deseja receber?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <button onClick={() => setDeliveryType('RETIRADA')} className={`flex items-center gap-6 p-6 border transition-all ${deliveryType === 'RETIRADA' ? 'border-[#1E1A17] bg-[#F5F2EC]' : 'border-[#E8E0D5] bg-white'}`}>
                                <Store className="w-6 h-6" />
                                <div className="text-left">
                                    <span className="block font-bold text-[11px] uppercase tracking-widest">Retirada</span>
                                    <span className="text-[10px] text-[#A89078] uppercase font-bold">Na Padaria - Grátis</span>
                                </div>
                            </button>
                            <button onClick={() => setDeliveryType('ENTREGA')} className={`flex items-center gap-6 p-6 border transition-all ${deliveryType === 'ENTREGA' ? 'border-[#1E1A17] bg-[#F5F2EC]' : 'border-[#E8E0D5] bg-white'}`}>
                                <Truck className="w-6 h-6" />
                                <div className="text-left">
                                    <span className="block font-bold text-[11px] uppercase tracking-widest">Entrega</span>
                                    <span className="text-[10px] text-[#A89078] uppercase font-bold">Taxa Fixa R$ 15,00</span>
                                </div>
                            </button>
                        </div>

                        {deliveryType === 'ENTREGA' && (
                            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F5F2EC] p-4 rounded-xl border border-[#E8E0D5]">
                                    <h3 className="text-[11px] font-bold text-[#1E1A17] uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-[#A89078]" />
                                        Endereço de Entrega
                                    </h3>
                                    <button
                                        onClick={handleGetLocation}
                                        type="button"
                                        disabled={isFetchingLocation}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#1E1A17] hover:text-white text-[#1E1A17] px-5 py-3 border border-[#E8E0D5] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-sm"
                                    >
                                        {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin"/> : <MapPin className="w-4 h-4" />}
                                        ENVIE SUA LOCALIZAÇÃO
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1 border-r border-[#F5F2EC]">
                                        <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest mb-2 block">CEP</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={zipCode}
                                                onChange={handleZipCodeChange}
                                                placeholder="00000000"
                                                maxLength={8}
                                                className="w-full bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                            />
                                            {isLoadingZip && <div className="absolute right-3 top-4"><Loader2 className="w-4 h-4 animate-spin text-[#A89078]" /></div>}
                                        </div>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest mb-2 block">Endereço (Rua/Logradouro)</label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Ex: Rua das Flores"
                                            className="w-full bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest mb-2 block">Número</label>
                                        <input
                                            type="text"
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                            placeholder="123"
                                            className="w-full bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest mb-2 block">Bairro</label>
                                        <input
                                            type="text"
                                            value={neighborhood}
                                            onChange={(e) => setNeighborhood(e.target.value)}
                                            placeholder="Centro"
                                            className="w-full bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-3">
                                        <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest mb-2 block">Cidade</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="São Paulo"
                                            className="w-full bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[#A89078] uppercase tracking-widest mb-2 block">Estado (UF)</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="SP"
                                            maxLength={2}
                                            className="w-full bg-[#F5F2EC] border-0 px-4 py-4 text-sm focus:ring-1 focus:ring-[#A89078] uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-[#1E1A17] text-white p-10 shadow-2xl sticky top-24">
                        <h2 className="font-serif text-2xl font-medium mb-8 border-b border-white/10 pb-4">Resumo</h2>
                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between text-sm opacity-60"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                            <div className="flex justify-between text-sm opacity-60"><span>Frete</span><span>{freight === 0 ? 'Grátis' : `R$ ${freight.toFixed(2).replace('.', ',')}`}</span></div>
                            <div className="flex justify-between text-2xl font-medium pt-6 border-t border-white/10"><span>Total</span><span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span></div>
                        </div>
                        <button
                            onClick={handlePayment}
                            disabled={isSubmitting}
                            className="w-full bg-[#D6C1AE] text-[#1E1A17] py-5 font-bold text-[13px] tracking-[0.2em] uppercase hover:bg-[#c9af96] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'PROCESSANDO...' : 'CONFIRMAR PEDIDO'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

