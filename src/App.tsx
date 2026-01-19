
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, ContactFormData } from './types';
import { PRODUCTS, WHATSAPP_NUMBER, CONTACT_EMAIL } from './constants';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Home');
  const [contactForm, setContactForm] = useState<ContactFormData>({ nombre: '', apellido: '', email: '', consulta: '' });
  const [showContactSuccess, setShowContactSuccess] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cv_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cv_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Home') return PRODUCTS;
    return PRODUCTS.filter(p => p.categoria === activeCategory);
  }, [activeCategory]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContactSuccess(true);
    setContactForm({ nombre: '', apellido: '', email: '', consulta: '' });
    setTimeout(() => setShowContactSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveCategory('Home')}>
            <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center text-white font-bold text-xl font-serif">CV</div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-800 hidden sm:block">CV Accesorios</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest text-gray-500">
            {['Home', 'Moños', 'Binchas', 'Hebillas'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`hover:text-pastel-pink transition-all duration-300 ${activeCategory === cat ? 'text-pastel-pink border-b-2 border-pastel-pink pb-1' : ''}`}>
                {cat}
              </button>
            ))}
          </nav>

          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-pastel-pink transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-pastel-pink text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-md">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pt-20">
        {activeCategory === 'Home' && (
          <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-pastel-pink/20 to-white">
            <div className="container mx-auto px-4 text-center z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-gray-800 mb-6 animate-float">
                Diseños Únicos <br/><span className="italic text-pastel-pink text-3xl md:text-5xl font-normal">Hechos con Amor</span>
              </h2>
              <button 
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-pastel-pink text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-pink-400 hover:shadow-pink-200 transition-all transform hover:-translate-y-1">
                Ver Catálogo
              </button>
            </div>
          </section>
        )}

        <section id="productos" className="py-16 container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">{activeCategory === 'Home' ? 'Nuestros Productos' : activeCategory}</h2>
            <div className="h-1 w-16 bg-pastel-pink mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-serif mb-8 italic text-gray-800">Sobre Nosotros</h2>
            <p className="text-gray-600 leading-loose text-lg font-light italic">
              "En CV Accesorios creamos diseños únicos hechos a mano, pensados para acompañarte en tu día a día o en momentos especiales. Cada accesorio está confeccionado con amor, dedicación y atención al detalle."
            </p>
          </div>
        </section>

        <section id="contacto" className="py-20 container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-serif text-center mb-10 text-gray-800">Contacto</h2>
          <form onSubmit={handleContactSubmit} className="space-y-5 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input required type="text" placeholder="Nombre" className="p-4 border border-gray-100 bg-gray-50 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 transition" value={contactForm.nombre} onChange={e => setContactForm({...contactForm, nombre: e.target.value})} />
              <input required type="text" placeholder="Apellido" className="p-4 border border-gray-100 bg-gray-50 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 transition" value={contactForm.apellido} onChange={e => setContactForm({...contactForm, apellido: e.target.value})} />
            </div>
            <input required type="email" placeholder="Email" className="p-4 border border-gray-100 bg-gray-50 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 transition" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
            <textarea required placeholder="Consulta" className="p-4 border border-gray-100 bg-gray-50 rounded-xl w-full h-40 focus:outline-none focus:ring-2 focus:ring-pastel-pink/50 transition resize-none" value={contactForm.consulta} onChange={e => setContactForm({...contactForm, consulta: e.target.value})}></textarea>
            <button type="submit" className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-black shadow-lg transition-all active:scale-95">Enviar Mensaje</button>
            {showContactSuccess && <p className="text-green-600 text-center font-medium animate-pulse">¡Mensaje enviado con éxito! Te responderemos pronto.</p>}
          </form>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center text-white font-bold text-2xl font-serif mx-auto mb-4">CV</div>
            <h3 className="text-xl font-serif tracking-widest uppercase">CV Accesorios</h3>
          </div>
          <div className="flex justify-center flex-wrap gap-8 mb-12">
            <button onClick={() => setActiveCategory('Moños')} className="text-gray-400 hover:text-pastel-pink transition-colors">Moños</button>
            <button onClick={() => setActiveCategory('Binchas')} className="text-gray-400 hover:text-pastel-pink transition-colors">Binchas</button>
            <button onClick={() => setActiveCategory('Hebillas')} className="text-gray-400 hover:text-pastel-pink transition-colors">Hebillas</button>
            <button onClick={() => {document.getElementById('contacto')?.scrollIntoView({behavior:'smooth'})}} className="text-gray-400 hover:text-pastel-pink transition-colors">Contacto</button>
          </div>
          <div className="h-px w-full bg-gray-800 max-w-xs mx-auto mb-8"></div>
          <p className="text-gray-500 text-xs tracking-widest uppercase">© {new Date().getFullYear()} CV Accesorios. Tandil, Argentina.</p>
        </div>
      </footer>

      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
};

export default App;
