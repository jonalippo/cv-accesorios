export interface Producto {
    id: string;
    nombre: string;
    categoria: string;
    imagen: string;
    descripcion: string;
    destacado?: boolean;
    subcategoria?: string;
  }