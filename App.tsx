
import React, { useState, useEffect, useMemo } from 'react';
import type { Product, CartItem, ContactFormData } from './src/types';
import { PRODUCTS, WHATSAPP_NUMBER, CONTACT_EMAIL } from './src/constants';
import ProductCard from './src/components/ProductCard';
import CartModal from './src/components/CartModal';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Home');
  const [contactForm, setContactForm] = useState<ContactFormData>({ nombre: '', apellido: '', email: '', consulta: '' });
  const [showContactSuccess, setShowContactSuccess] = useState(false);

  // Persistence
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
    console.log('Sending to:', CONTACT_EMAIL, contactForm);
    setShowContactSuccess(true);
    setContactForm({ nombre: '', apellido: '', email: '', consulta: '' });
    setTimeout(() => setShowContactSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
                className={`hover:text-pastel-pink transition ${activeCategory === cat ? 'text-pastel-pink border-b-2 border-pastel-pink pb-1' : ''}`}>
                {cat}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-pastel-pink transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-pastel-pink text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        {activeCategory === 'Home' && (
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-pastel-pink/20">
            <div className="absolute inset-0 z-0 opacity-40">
              <img 
                src="https://picsum.photos/seed/cvhero/1920/1080" 
                alt="Hero Background" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h2 className="text-5xl md:text-7xl font-serif text-gray-800 mb-6 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
                Diseños Únicos <br/><span className="italic text-pastel-pink">Hechos con Amor</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
                Accesorios artesanales para el pelo que resaltan tu belleza natural con elegancia y delicadeza.
              </p>
              <button 
                onClick={() => {
                   const section = document.getElementById('productos');
                   section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-pastel-pink text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-pink-400 transition-all hover:scale-105 opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
                Ver Catálogo
              </button>
            </div>
            {/* Decor Flowers */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-green-50 rounded-full blur-3xl opacity-60"></div>
          </section>
        )}

        {/* Products Grid */}
        <section id="productos" className="py-20 container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-pastel-pink uppercase tracking-widest text-xs font-bold">Catálogo Seleccionado</span>
              <h2 className="text-4xl font-serif text-gray-800">{activeCategory === 'Home' ? 'Nuestros Productos' : activeCategory}</h2>
            </div>
            <div className="flex gap-2 bg-gray-50 p-1 rounded-full">
               {['Home', 'Moños', 'Binchas', 'Hebillas'].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-4 py-2 rounded-full text-xs font-medium transition ${activeCategory === cat ? 'bg-white shadow-sm text-pastel-pink' : 'text-gray-400 hover:text-gray-600'}`}>
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* About Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative group">
                <div className="absolute inset-0 bg-pastel-pink rounded-2xl rotate-3 group-hover:rotate-0 transition duration-500"></div>
                <img 
                  src="https://picsum.photos/seed/about/800/800" 
                  alt="Sobre Nosotros" 
                  className="relative rounded-2xl shadow-xl w-full object-cover h-96 transition duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2" 
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <span className="text-pastel-pink uppercase tracking-widest text-xs font-bold">Nuestra Historia</span>
              <h2 className="text-4xl font-serif text-gray-800 italic">Confeccionado con Amor y Dedicación</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                En <strong>CV Accesorios</strong> creamos diseños únicos hechos a mano, pensados para acompañarte en tu día a día o en momentos especiales. Cada accesorio está confeccionado con amor, dedicación y atención al detalle.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestra pasión es transformar telas de alta calidad y bordados artesanales en piezas que cuenten una historia. Buscamos la armonía entre lo clásico y lo moderno para ofrecerte lo mejor.
              </p>
              <div className="pt-4 flex gap-8">
                <div>
                  <h4 className="text-2xl font-serif text-gray-800">100%</h4>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Artesanal</p>
                </div>
                <div>
                  <h4 className="text-2xl font-serif text-gray-800">+1k</h4>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Clientas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contacto" className="py-20 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-pastel-pink uppercase tracking-widest text-xs font-bold">Contacto</span>
            <h2 className="text-4xl font-serif text-gray-800 mt-2">¿Tenes alguna consulta?</h2>
            <p className="text-gray-500 mt-4">Escribinos y te responderemos lo antes posible.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre</label>
              <input 
                required
                type="text" 
                value={contactForm.nombre}
                onChange={e => setContactForm({...contactForm, nombre: e.target.value})}
                placeholder="Tu nombre" 
                className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-pastel-pink transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Apellido</label>
              <input 
                required
                type="text" 
                value={contactForm.apellido}
                onChange={e => setContactForm({...contactForm, apellido: e.target.value})}
                placeholder="Tu apellido" 
                className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-pastel-pink transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email</label>
              <input 
                required
                type="email" 
                value={contactForm.email}
                onChange={e => setContactForm({...contactForm, email: e.target.value})}
                placeholder="tu@email.com" 
                className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-pastel-pink transition" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Consulta</label>
              <textarea 
                required
                rows={4} 
                value={contactForm.consulta}
                onChange={e => setContactForm({...contactForm, consulta: e.target.value})}
                placeholder="¿En qué podemos ayudarte?" 
                className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-pastel-pink transition" 
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-black transition-all hover:shadow-lg">
                Enviar Mensaje
              </button>
            </div>
            {showContactSuccess && (
              <div className="md:col-span-2 p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium animate-bounce">
                ¡Gracias! Tu mensaje ha sido enviado con éxito.
              </div>
            )}
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center text-white font-bold text-xl font-serif">CV</div>
                <h3 className="text-2xl font-serif font-bold">CV Accesorios</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Accesorios artesanales hechos con amor en Argentina. Diseños únicos y exclusivos para vos.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-pastel-pink uppercase tracking-widest text-xs">Categorías</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><button onClick={() => setActiveCategory('Moños')} className="hover:text-white transition">Moños</button></li>
                <li><button onClick={() => setActiveCategory('Binchas')} className="hover:text-white transition">Binchas</button></li>
                <li><button onClick={() => setActiveCategory('Hebillas')} className="hover:text-white transition">Hebillas</button></li>
                <li><button onClick={() => setActiveCategory('Colitas')} className="hover:text-white transition">Colitas</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-pastel-pink uppercase tracking-widest text-xs">Navegación</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="hover:text-white transition">Inicio</button></li>
                <li><button onClick={() => setActiveCategory('Home')} className="hover:text-white transition">Catálogo</button></li>
                <li><button onClick={() => document.getElementById('contacto')?.scrollIntoView({behavior:'smooth'})} className="hover:text-white transition">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-pastel-pink uppercase tracking-widest text-xs">Síguenos</h4>
              <div className="flex gap-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pastel-pink transition">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.3.045-.694.074-1.133-.074-.282-.095-.623-.232-1.071-.433-1.902-.852-3.136-2.788-3.231-2.914-.095-.126-.777-1.035-.777-1.97 0-.936.48-1.396.65-1.593.17-.197.372-.246.497-.246.125 0 .25.014.358.016.115.002.268-.043.42.327.152.37.52 1.268.566 1.359.046.092.077.198.016.323-.061.125-.091.203-.182.308-.09.105-.19.233-.271.314-.093.093-.19.194-.082.381.109.187.484.802 1.038 1.298.714.637 1.312.835 1.499.923.188.089.298.074.407-.05.109-.124.464-.54.588-.724.125-.184.25-.154.42-.092.17.062 1.082.51 1.27.603.188.093.312.138.358.216.046.079.046.455-.098.86zM12 0a12 12 0 100 24 12 12 0 000-24z"/></svg>
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pastel-pink transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} CV Accesorios. Todos los derechos reservados.</p>
            <button 
              onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
              className="mt-4 text-pastel-pink hover:underline uppercase tracking-widest">
              Volver al inicio
            </button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl animate-float hover:bg-green-600 transition-colors">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>

      {/* Modals */}
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
