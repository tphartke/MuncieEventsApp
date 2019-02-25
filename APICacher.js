import { AsyncStorage } from 'react-native';
export default class APICacher{

    async _cacheJSONFromAPIAsync(key, url){
        console.log("begin caching")
        APIData = await fetch(url)  
        .then(response => response.json())
        .then(responseJson => AsyncStorage.setItem(key, JSON.stringify(responseJson.data)) )
        .then(console.log("done caching"))
        .catch(error => console.log(error)); 
    }

    async _hasAPIData(key){
        await AsyncStorage.getItem(key, (err, result) => {
            console.log("HasAPIData: " + (result != null))
            hasAPIData = result != null
        });
        return hasAPIData;
    }

    async _getStringFromStorage(key){
        hasData = await this._hasAPIData(key)
        if(hasData){
            await AsyncStorage.getItem(key, (err, result) =>{
                data = result;
            })
        }
        return data;
    }

    async _getJSONFromStorage(key){
        JSONString = await this._getStringFromStorage(key)
        return JSON.parse(JSONString);
    }

}