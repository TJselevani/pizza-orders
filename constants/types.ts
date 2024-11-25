export interface AuthResponse {
  endpoint: string;
  consumerKey: string;
  secretKey: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  total: string;
}

export interface Order {
  id: number;
  status: string;
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

export interface Printer {
  id: string;
  name: string;
  connected: boolean;
}

export interface PrinterDevice {
  deviceName: string;
  macAddress: string;
}
