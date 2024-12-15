import { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Text,
  ActivityIndicator,
  Searchbar,
  Button,
  SegmentedButtons,
} from "react-native-paper";
import { router } from "expo-router";
import { fetchOrders, updateOrderStatus } from "../../utils/api";
import { Order } from "../../constants/types";
import { getStoredAuth } from "../../utils/auth";
import React from "react";
import OrderCard from "../../components/OrderCard";
import generateReceiptString from "../../components/ReceiptString";
import thermalPrinter from "../../components/MyThermalPrinter";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [printing, setPrinting] = useState(false);
  const isPrinterConnected = thermalPrinter.isPrinterConnected();

  // Fetch orders
  const loadOrders = async () => {
    try {
      const auth = await getStoredAuth();
      if (!auth) {
        router.replace("/");
        return;
      }

      setLoading(true);
      setError("");
      const { orders: newOrders, totalPages } = await fetchOrders({
        page,
        status,
        searchQuery,
        searchType: "all",
      });
      setOrders((prevOrders) => {
        const newOrdersIds = new Set(newOrders.map((order) => order.id));
        return [
          ...newOrders,
          ...prevOrders.filter((order) => !newOrdersIds.has(order.id)),
        ];
      });
      setTotalPages(totalPages);
    } catch (err) {
      setError("Failed to load orders");
      if (err.message === "Not authenticated") {
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // Print unprinted orders
  const printUnprintedOrders = useCallback(async () => {
    if (!isPrinterConnected) {
      console.log("Printer not connected. Skipping printing.");
      return;
    }

    const unprintedOrders = orders.filter((order) => !order.isPrinted);
    setPrinting(true);

    for (const order of unprintedOrders) {
      try {
        console.log(`Printing order ${order.id}...`);
        const receiptString = await generateReceiptString(order);
        await thermalPrinter.printBill(receiptString);
        // await thermalPrinter.printBill(receiptString); //Used to print the Second Receipt

        // Update order status via PATCH request
        await updateOrderStatus(order.id, { isPrinted: true });

        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === order.id ? { ...o, isPrinted: true } : o
          )
        );

        console.log(`Order ${order.id} printed successfully.`);
      } catch (err) {
        console.error(`Failed to print order ${order.id}:`, err);
      }
    }

    setPrinting(false);
  }, [orders, isPrinterConnected]);

  // Fetch orders and print unprinted ones at intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadOrders().then(() => printUnprintedOrders());
    }, 5000); // Fetch and print every 5 seconds

    return () => clearInterval(intervalId);
  }, [printUnprintedOrders]);

  // Prevent device from sleeping on this screen
  useEffect(() => {
    loadOrders();

    return () => {};
  }, [page, status, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search orders by email, ID, or name..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <SegmentedButtons
          value={status}
          onValueChange={setStatus}
          buttons={[
            { value: "all", label: "All" },
            { value: "processing", label: "Processing" },
            { value: "completed", label: "Completed" },
          ]}
        />
      </View>

      {loading && !orders.length ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : error && !orders.length ? (
        <View style={styles.centered}>
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item: order }) => (
            <OrderCard
              order={order}
              onPress={() =>
                router.push({
                  pathname: "/details/order-details",
                  params: { orderId: order.id },
                })
              }
            />
          )}
          keyExtractor={(order) => order.id.toString()}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadOrders}
        />
      )}

      {printing && (
        <View style={styles.printingIndicator}>
          <ActivityIndicator size="small" />
          <Text>Printing transactions...</Text>
        </View>
      )}

      <View style={styles.pagination}>
        <Button
          mode="outlined"
          onPress={() => setPage((p) => p - 1)}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Button
          mode="outlined"
          onPress={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || loading}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    backgroundColor: "white",
    gap: 8,
  },
  searchBar: {
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  printingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
});
