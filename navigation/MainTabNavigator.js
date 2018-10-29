import { stackNavigator, drawerNavigator } from 'react-navigation';

import AdvancedSearch from '../pages/AdvancedSearch';

const AdvancedSearchStack = stackNavigator(
  {AdvancedSearch: {screen: AdvancedSearch}},
  {
    navigationOptions: () =>
    ({
      headerStyle: {backgroundColor: 'white'},
      title: 'Menu',
      headerTintColor: 'orange'
    })
  }

);


export default drawerNavigator({
  AdvancedSearchStack,
});
