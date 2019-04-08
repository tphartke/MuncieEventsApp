import HomeScreen from './pages/Home';
import AdvancedSearch from './pages/AdvancedSearch';
import GoToDate from './pages/GoToDate';
import AddEditEvents from './pages/AddEditEvents';
import About from './pages/About';
import Contact from './pages/Contact';
import LogInRegister from './pages/LogInRegister';
import Widgets from './pages/Widgets';
import SearchResults from './pages/SearchResults'
import SearchResultsPasser from './pages/SearchResultsPasser';
import {createDrawerNavigator} from 'react-navigation';
import ExpandedView from './pages/ExpandedView';

const App = createDrawerNavigator({
  Home: { screen: HomeScreen },
  "Advanced Search": { screen: AdvancedSearch },
  "Go To Date": {screen: GoToDate},
  "Add Event": {screen: AddEditEvents},
  About: {screen: About},
  Contact: {screen: Contact},
  "My Profile": {screen: LogInRegister},
  Widgets: {screen: Widgets},
  "Search Results": {screen: SearchResults, navigationOptions: {drawerLabel: () => null}},
  "Search Results Passer": {screen: SearchResultsPasser, navigationOptions: {drawerLabel: () => null}},
  "Expanded View":{screen: ExpandedView, navigationOptions: {drawerLabel: () => null}}},
  {
    initialRouteName:"Home"
  }
);
  
export default App;