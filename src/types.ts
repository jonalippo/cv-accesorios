
export interface Product {
    id: number;
    nombre: string;
    categoria: 'Moños' | 'Vinchas' | 'Hebillas' | 'Colitas';
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export interface ContactFormData {
    nombre: string;
    apellido: string;
    email: string;
    consulta: string;
  }
  