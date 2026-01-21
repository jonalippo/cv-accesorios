
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.imagen} 
          alt={product.nombre} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={() => setLiked(!liked)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform hover:scale-110 ${liked ? 'bg-pink-500 text-white' : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-pink-500'}`}>
            <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>
        {product.stock <= 3 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
              ¡ Últimas {product.stock} !
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest text-pastel-pink font-semibold">{product.categoria}</span>
          <h3 className="text-lg font-serif text-gray-800 leading-tight group-hover:text-pastel-pink transition-colors">{product.nombre}</h3>
        </div>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-1">{product.descripcion}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">${product.precio}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-pastel-pink text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-pink-400 transition transform hover:-translate-y-1 active:scale-95 shadow-md">
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
