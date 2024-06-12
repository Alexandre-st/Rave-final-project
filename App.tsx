import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
// import Detail from './components/Detail';
// import DetailArtist from './components/DetailArtist';
// import DetailMusic from './components/DetailMusic';
import Home from './screens/Home';
import Rave from './screens/Rave';
import Record from './screens/Record';
import { RootStackParamList } from './types/typesFile';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <Image
                style={{ width: size, height: size, aspectRatio: .8, resizeMode: 'contain' }}
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
          tabBarIcon: ({ size, focused, color}) => {
            return (
              <Image 
                style={{ width: size, height: size, aspectRatio: .8, resizeMode: 'contain' }}
                source={require('./assets/search.png')}
              />
            )
          }
        }}
      />
      <Tab.Screen 
        name="Rave" 
        component={Rave} 
        options={{
          tabBarIcon: ({ size, focused, color}) => {
            return (
              <Image 
                style={{ width: size, height: size, aspectRatio: .8, resizeMode: 'contain' }}
                source={require('./assets/favorites.png')}
              />
            )
          }
        }}
      />
    </Tab.Navigator>
  );
};

const  App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Navigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;