import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Divider,
  ActivityIndicator,
  FAB,
  Button,
  Icon,
} from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { format } from "date-fns";
import { Order } from "../../constants/types";
import { fetchOrders } from "../../utils/api";
import MyThermalPrinter from "../../components/MyThermalPrinter";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AccordionComponent from "../../components/MyAccordion";
import Receipt from "../../components/Receipt";
import generateReceiptString from "../../components/ReceiptString";

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printing, setPrinting] = useState(false);
  const isPrinterConnected = MyThermalPrinter.isPrinterConnected();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { orders } = await fetchOrders();
      const foundOrder = orders.find((o) => o.id.toString() === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const printOrder = async (order) => {
    if (!order) return;

    try {
      setPrinting(true);
      const receiptString = generateReceiptString(order);
      console.log(receiptString);

      await MyThermalPrinter.printText(receiptString);

      Alert.alert("Success", "Order receipt printed successfully.");
    } catch (error) {
      console.error("Printing failed:", error);
      Alert.alert("Error", "Failed to print the receipt.");
    } finally {
      setPrinting(false);
    }
  };

  const markAsCompleted = async () => {
    try {
      setLoading(true);
      // await updateOrderStatus(orderId, "completed");
      router.replace("/orders");
    } catch (error) {
      setError("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Title title="Customer Details" />
          <Card.Content>
            <Text variant="titleMedium">
              {order.billing.first_name} {order.billing.last_name}
            </Text>
            <Text variant="bodyMedium">{order.billing.email}</Text>
            <Text variant="bodyMedium">{order.billing.phone}</Text>
            <Text variant="bodyMedium">{order.billing.address_1}</Text>
            <Text variant="bodyMedium">
              {order.billing.city}, {order.billing.postcode}
            </Text>
            <Text variant="bodyMedium">{order.billing.country}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Order Details" />
          <Card.Content>
            <Text variant="bodyMedium">
              Date: {format(new Date(order.date_created), "PPpp")}
            </Text>
            <Text variant="titleLarge" style={styles.total}>
              Total: £{order.total}
            </Text>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.itemsTitle}>
              Items
            </Text>
            {order.line_items.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text variant="bodyLarge">{item.name}</Text>
                <Text variant="bodyMedium">
                  Quantity: {item.quantity} × £{item.price}
                </Text>
                <Text variant="bodyMedium">Subtotal: £{item.total}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Print Button */}
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <TouchableOpacity
            onLongPress={() => router.push("/printer")} // Always navigate on long press
            onPress={() => printOrder(order)} // Normal print action
            disabled={!isPrinterConnected} // Disabled state for print button
          >
            <Ionicons
              name="print-outline"
              size={28}
              color={isPrinterConnected ? "green" : "gray"}
            />
          </TouchableOpacity>
          <Text style={{ color: isPrinterConnected ? "green" : "gray" }}>
            {isPrinterConnected ? "Print Receipt" : "Printer not connected"}
          </Text>
        </View>

        <View style={{ marginHorizontal: 20 }}>
          <AccordionComponent title="Order Receipt">
            <Receipt order={order} />
          </AccordionComponent>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={markAsCompleted}
          style={styles.completeButton}
        >
          Mark as Completed
        </Button>
      </View>

      {/* <FAB
        icon="printer"
        style={styles.fab}
        onPress={printOrder}
        loading={printing}
        disabled={printing}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 16,
  },
  divider: {
    marginVertical: 16,
  },
  total: {
    marginTop: 8,
    fontWeight: "bold",
  },
  itemsTitle: {
    marginBottom: 8,
  },
  item: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    top: 0,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  completeButton: {
    marginBottom: 16,
  },
});
