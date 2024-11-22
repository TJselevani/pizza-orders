import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Divider, ActivityIndicator, FAB, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { format } from 'date-fns';
import { Order } from './types';
import { fetchOrders, updateOrderStatus } from './utils/api';
import React from 'react';

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { orders } = await fetchOrders();
      const foundOrder = orders.find(o => o.id.toString() === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // const printOrder = async () => {
  //   if (!order) return;

  //   try {
  //     setPrinting(true);
  //     await BluetoothEscposPrinter.printerInit();
  //     await BluetoothEscposPrinter.printText("ORDER #" + order.id + "\n\n");
  //     await BluetoothEscposPrinter.printText("Customer: " + order.billing.first_name + " " + order.billing.last_name + "\n");
  //     await BluetoothEscposPrinter.printText("Date: " + format(new Date(order.date_created), 'PPpp') + "\n\n");
      
  //     await BluetoothEscposPrinter.printText("Items:\n");
  //     for (const item of order.line_items) {
  //       await BluetoothEscposPrinter.printText(
  //         item.name + "\n" +
  //         "Qty: " + item.quantity + " x £" + item.price + "\n" +
  //         "Subtotal: £" + item.total + "\n\n"
  //       );
  //     }
      
  //     await BluetoothEscposPrinter.printText("Total: £" + order.total + "\n\n");
  //     await BluetoothEscposPrinter.printText("--------------------------------\n");
  //   } catch (error) {
  //     console.error('Printing failed:', error);
  //   } finally {
  //     setPrinting(false);
  //   }
  // };

  const markAsCompleted = async () => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, 'completed');
      router.replace('/orders');
    } catch (error) {
      setError('Failed to update order status');
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
            <Text variant="bodyMedium">
              {order.billing.address_1}
            </Text>
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
              Date: {format(new Date(order.date_created), 'PPpp')}
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
                <Text variant="bodyMedium">
                  Subtotal: £{item.total}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
  },
  divider: {
    marginVertical: 16,
  },
  total: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  itemsTitle: {
    marginBottom: 8,
  },
  item: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  completeButton: {
    marginBottom: 16,
  },
});