import HomeScreen from './pages/Home';
import AdvancedSearch from './pages/AdvancedSearch';
import GoToDate from './pages/GoToDate';
import AddEditEvents from './pages/AddEditEvents';
import About from './pages/About';
import Contact from './pages/Contact';
import LogInRegister from './pages/LogInRegister';
import Widgets from './pages/Widgets';
import SearchOutput from './pages/SearchOutput'
import {createDrawerNavigator} from 'react-navigation';

const App = createDrawerNavigator({
    Home: { screen: HomeScreen },
    AdvancedSearch: { screen: AdvancedSearch },
    GoToDate: {screen: GoToDate},
    AddEditEvents: {screen: AddEditEvents},
    About: {screen: About},
    Contact: {screen: Contact},
    LogInRegister: {screen: LogInRegister},
    Widgets: {screen: Widgets},
  });
  
  export default App;
