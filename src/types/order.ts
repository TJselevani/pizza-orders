export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  date_created: string;
  total: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
  line_items: OrderItem[];
}