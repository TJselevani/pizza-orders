import { View, StyleSheet } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { Order } from '../types';
import React from 'react';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const getOrderStatusColor = (status: string) => {
    return status === 'processing' ? '#4CAF50' : '#9E9E9E';
  };

  return (
    <Card
      style={[styles.card, { borderLeftColor: getOrderStatusColor(order.status), borderLeftWidth: 4 }]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.orderHeader}>
          <Text variant="titleMedium">
            #{order.id} - {order.billing.first_name} {order.billing.last_name}
          </Text>
          <Chip
            style={{ backgroundColor: getOrderStatusColor(order.status) }}
            textStyle={{ color: 'white' }}
          >
            {order.status}
          </Chip>
        </View>
        <Text variant="bodyMedium">
          {format(new Date(order.date_created), 'PPpp')}
        </Text>
        <Text variant="bodyLarge" style={styles.amount}>
          £{order.total}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});