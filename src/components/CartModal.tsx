
import React from 'react';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER, MP_ALIAS, CUENTA_DNI_ALIAS } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, updateQuantity, removeItem }) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const handleCheckout = () => {
    const message = `¡Hola CV Accesorios! 👋\n\nQuiero realizar un pedido:\n${items
      .map((item) => `- ${item.nombre} x${item.quantity} ($${item.precio * item.quantity})`)
      .join('\n')}\n\n*Total: $${total}*\n\n¿Me podrías confirmar disponibilidad para realizar la transferencia?`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-serif text-gray-800">Tu Carrito</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tu carrito está vacío.</p>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.imagen} alt={item.nombre} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.nombre}</h4>
                    <p className="text-sm text-gray-500">${item.precio}</p>
                    <div className="flex items-center mt-2 space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                      <span className="text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-xl font-serif">
              <span>Total</span>
              <span className="font-bold text-pastel-pink">${total}</span>
            </div>
            
            <div className="text-xs text-gray-600 bg-white p-3 rounded border border-pastel-pink border-dashed">
              <p className="font-semibold mb-1 uppercase tracking-wider">Instrucciones de Pago:</p>
              <p>1. Transferencia por Mercado Pago: <strong>Alias: {MP_ALIAS}</strong></p>
              <p>2. Transferencia Cuenta DNI: <strong>Alias: {CUENTA_DNI_ALIAS}</strong></p>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Enviar comprobante por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
