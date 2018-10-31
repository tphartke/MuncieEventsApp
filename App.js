import HomeScreen from './pages/Home';
import AdvancedSearch from './pages/AdvancedSearch';
import {createStackNavigator} from 'react-navigation';

const App = createStackNavigator({
    Home: { screen: HomeScreen },
    AdvancedSearch: { screen: AdvancedSearch },
  });
  
  export default App;
