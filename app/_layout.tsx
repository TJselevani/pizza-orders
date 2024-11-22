import { Tabs } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getStoredAuth } from './utils/auth';
import React from 'react';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, [segments]);

  const checkAuth = async () => {
    const auth = await getStoredAuth();
    const isAuthGroup = segments[0] === '(auth)';

    if (!auth && !isAuthGroup) {
      router.replace('/');
    } else if (auth && isAuthGroup) {
      router.replace('/orders');
    }
  };

  return (
    <PaperProvider>
      <Tabs screenOptions={{ 
        headerShown: true,
        tabBarStyle: { display: segments[0] === '(auth)' ? 'none' : 'flex' }
      }}>
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="order-details"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clipboard-list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}