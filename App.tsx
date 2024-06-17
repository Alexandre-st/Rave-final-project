import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Image } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './screens/Home';
import Rave from './screens/Rave';
import Record from './screens/Record';
import { persistor, store } from './store';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Navigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size, aspectRatio: 0.8, resizeMode: 'contain' }}
                source={require('./assets/Home.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name='Record'
        component={Record}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size, aspectRatio: 0.8, resizeMode: 'contain' }}
                source={require('./assets/search.png')}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name='Rave'
        component={Rave}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size, aspectRatio: 0.8, resizeMode: 'contain' }}
                source={require('./assets/favorites.png')}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access notifications was denied');
      return;
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;

