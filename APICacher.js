import AsyncStorage from 'react-native';
export default class APICacher{

    async _cacheJSONFromAPIAsync(key, url){
        APIData = await fetch(url)  
        .then(response => response.json())
        .then(responseJson => AsyncStorage.setItem(key, JSON.stringify(responseJson.data)) )
        .catch(error => console.log(error)); 
        _hasAPIData = _hasAPIData.bind(this)
    }

    async _hasAPIData(key){
        await AsyncStorage.getItem(key, (err, result) => {
            return result != null
        });
    }

    async _getStringFromStorage(key){
        hasData = await this._hasAPIData(key)
        if(hasData){
            await AsyncStorage.getItem(key, (err, result) =>{
                return result;
            })
        }
    }

    async _getJSONFromStorage(key){
        JSONString = await this._getStringFromStorage(key)
        return JSON.parse(JSONString);
    }

}