import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Order, OrderItem } from "../constants/types";
import generateReceiptString from "./ReceiptString";

interface ReceiptProps {
  order: Order;
  onExport?: (receiptString: string) => void; // Optional callback for exporting
}

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


const Receipt: React.FC<ReceiptProps> = ({ order, onExport }) => {
  const consolidatedItems = consolidateItems(order.line_items);
  const receiptString = generateReceiptString(order);

  // Trigger the export callback with the receipt string
  useEffect(() => {
    if (onExport) {
      onExport(receiptString);
    }
  }, [onExport, receiptString]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt</Text>
      <Text style={styles.divider}>
        -------------------------------------------------
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>#{order.id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{order.date_created}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer:</Text>
        <Text style={styles.value}>
          {order.billing.first_name} {order.billing.last_name}
        </Text>
      </View>

      <Text style={styles.label}>Items:</Text>
      {consolidatedItems.map((item) => (
        <View key={`${item.name}-${item.price}`} style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            Qty: {item.quantity} × £{item.price}
          </Text>
          <Text style={styles.itemDetails}>Subtotal: £{item.total}</Text>
        </View>
      ))}

      <View style={styles.row}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>£{order.total}</Text>
      </View>

      <Text style={styles.divider}>
        -------------------------------------------------
      </Text>
      <Text style={styles.footer}>Thank you for your business!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    marginTop: 16,
    padding: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Roboto-Medium",
    marginBottom: 8,
  },
  divider: {
    textAlign: "center",
    color: "#4A4A4A",
    fontFamily: "Roboto-Light",
  },
  label: {
    fontFamily: "Roboto-Regular",
    textAlign: "left",
    flex: 1,
    marginVertical: 4,
  },
  value: {
    fontFamily: "Roboto-Regular",
    textAlign: "left",
    fontSize: 16,
    flex: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 4,
  },
  itemContainer: {
    marginVertical: 8,
  },
  itemName: {
    fontFamily: "Roboto-Regular",
    textAlign: "left",
  },
  itemDetails: {
    fontFamily: "Roboto-Regular",
    textAlign: "left",
    marginLeft: 20, // Indentation for multi-line values
  },
  footer: {
    textAlign: "center",
    color: "#6B6B6B",
    fontFamily: "Roboto-Italic",
    marginTop: 8,
  },
});

export default Receipt;
