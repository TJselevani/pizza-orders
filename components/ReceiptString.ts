import { format } from "date-fns";
import { Order, OrderItem } from "../constants/types";

const consolidateItems = (items: OrderItem[]) => {
  const consolidated: { [key: string]: OrderItem } = {};

  items.forEach((item) => {
    const key = `${item.name}-${item.price}`; // Unique identifier based on name and price
    if (consolidated[key]) {
      consolidated[key].quantity += item.quantity; // Add quantity
      consolidated[key].total = (
        parseFloat(consolidated[key].total) + parseFloat(item.total)
      ).toFixed(2); // Update total
    } else {
      consolidated[key] = { ...item };
    }
  });

  return Object.values(consolidated);
};

const generateReceiptString = (order: Order): string => {
  const consolidatedItems = consolidateItems(order.line_items);
  return `
    Order Receipt
    ---------------------
    Customer: ${order.billing.first_name} ${order.billing.last_name}
    Email: ${order.billing.email}
    Phone: ${order.billing.phone}
    
    Items:
    \t${consolidatedItems
      .map(
        (item) =>
          `${item.name} x${item.quantity} - £${item.price} (Subtotal: £${item.total})`
      )
      .join("\n")}
    
    Total: £${order.total}
    Date: ${format(new Date(order.date_created), "PPpp")}
    ---------------------
    Thank you for your business!\n
  `;
};

export default generateReceiptString;
