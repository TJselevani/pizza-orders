import axios from 'axios';
import { Order } from '../types/order';

export const fetchOrders = async (
  endpoint: string,
  consumerKey: string,
  secretKey: string,
  page: number = 1
) => {
  try {
    const response = await axios.get(`${endpoint}/wp-json/wc/v3/orders`, {
      params: {
        consumer_key: consumerKey,
        consumer_secret: secretKey,
        status: 'processing',
        per_page: 20,
        page,
      },
    });

    return {
      orders: response.data as Order[],
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1'),
    };
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
};