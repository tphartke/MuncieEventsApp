import HomeScreen from './pages/Home';
import AdvancedSearch from './pages/AdvancedSearch';
import GoToDate from './pages/GoToDate';
import AddEditEvents from './pages/AddEditEvents';
import About from './pages/About';
import Contact from './pages/Contact';
import LogInRegister from './pages/LogInRegister';
import Widgets from './pages/Widgets';
import {createDrawerNavigator} from 'react-navigation';

const App = createDrawerNavigator({
    Home: { screen: HomeScreen },
    "Advanced Search": { screen: AdvancedSearch },
    "Go To Date": {screen: GoToDate},
    "Add Event": {screen: AddEditEvents},
    About: {screen: About},
    Contact: {screen: Contact},
    "My Profile": {screen: LogInRegister},
    Widgets: {screen: Widgets},
  });
  
  export default App;
