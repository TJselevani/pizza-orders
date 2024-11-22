import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { format } from "date-fns";
import { fetchOrders } from "../services/woocommerce";
import { getStoredAuth } from "../services/auth";
import { Order } from "../types/order";
import { MainStackParamList } from "../NavigationParamList";

type OrdersScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Orders">;
};

export function OrdersScreen({ navigation }: OrdersScreenProps) {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const auth = await getStoredAuth();
      if (!auth) {
        navigation.navigate("Login");
        return;
      }

      const { orders: newOrders, totalPages: total } = await fetchOrders(
        auth.endpoint,
        auth.consumerKey,
        auth.secretKey,
        page
      );

      setOrders(newOrders);
      setTotalPages(total);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrders();
  }, [page]);

  const handleOrderPress = (order: Order) => {
    navigation.navigate("OrderDetails", { order });
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-xl font-bold mb-4">Processing Orders</label>

      <scrollView>
        {orders.map((order) => (
          <stackLayout
            key={order.id}
            style={styles.orderCard}
            onTap={() => handleOrderPress(order)}
          >
            <label style={styles.customerName}>
              {order.billing.first_name} {order.billing.last_name}
            </label>
            <label style={styles.orderDate}>
              {format(new Date(order.date_created), "PPpp")}
            </label>
            <label style={styles.orderAmount}>
              Amount: ${order.total}
            </label>
          </stackLayout>
        ))}
      </scrollView>

      <flexboxLayout style={styles.pagination}>
        <button
          style={styles.pageButton}
          isEnabled={page > 1}
          onTap={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <label style={styles.pageInfo}>
          Page {page} of {totalPages}
        </label>
        <button
          style={styles.pageButton}
          isEnabled={page < totalPages}
          onTap={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </flexboxLayout>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 20,
  },
  orderCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderAmount: {
    fontSize: 16,
    marginTop: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  pageButton: {
    fontSize: 16,
    padding: 5,
    color: "#2e6ddf",
  },
  pageInfo: {
    fontSize: 14,
  },
});