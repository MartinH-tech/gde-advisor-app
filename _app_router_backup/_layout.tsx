import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(reports)/school-visit" />
      <Stack.Screen name="(reports)/priority-visit" />
    </Stack>
  );
}