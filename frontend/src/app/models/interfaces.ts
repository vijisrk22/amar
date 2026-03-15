export interface Book {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
  short_description: string;
  cover_image: string;
  detail_images: string[];
  category_id: number;
  category_name: string;
  category_slug: string;
  series: string;
  status: 'available' | 'out_of_stock' | 'pre_order';
  edition_type: 'standard' | 'limited';
  featured: number;
  is_new: number;
  sort_order: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta_text: string;
  cta_link: string;
}

export interface AboutSection {
  id: number;
  section_key: string;
  title: string;
  content: string;
  image: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  id: number;
  book_id: number;
  title: string;
  subtitle: string;
  slug: string;
  price: number;
  currency: string;
  cover_image: string;
  quantity: number;
  status: string;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  count: number;
}

export interface Order {
  id: number;
  order_number: string;
  email: string;
  name: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  book_id: number;
  title: string;
  price: number;
  quantity: number;
  cover_image: string;
  slug: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  shipping_cost: string;
  free_shipping_threshold: string;
  tax_rate: string;
  [key: string]: string;
}
