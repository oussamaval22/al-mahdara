import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import IndexScreen from '../screens/IndexScreen';
import ReaderScreen from '../screens/ReaderScreen';
import AudioScreen from '../screens/AudioScreen';
import TasbihScreen from '../screens/TasbihScreen';
import InquiryScreen from '../screens/InquiryScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.greenDark },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '900' },
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'المحظرة', headerShown: false }} />
        <Stack.Screen name="Index" component={IndexScreen} options={{ title: 'فهرس القرآن' }} />
        <Stack.Screen name="Reader" component={ReaderScreen} options={{ title: 'المصحف' }} />
        <Stack.Screen name="Audio" component={AudioScreen} options={{ title: 'الاستماع' }} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'المحفوظات' }} />
        <Stack.Screen name="Tasbih" component={TasbihScreen} options={{ title: 'المسبحة' }} />
        <Stack.Screen name="Inquiry" component={InquiryScreen} options={{ title: 'الاستفسار' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppNavigator;
