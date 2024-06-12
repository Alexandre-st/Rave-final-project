import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  TabHome: undefined;
  Home: undefined;
  Search: undefined;
  DetailArtist: undefined;
  DetailMusic: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type HomeProps = {
  navigation: HomeScreenNavigationProp;
};
