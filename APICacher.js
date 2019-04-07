import { AsyncStorage } from 'react-native';
export default class APICacher{

    async _cacheJSONFromAPIAsync(key, url){
        console.log("Beginning fetch for " + key + ", the url is: " + url)
        try{
            await fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this._cacheStringAsync(key, JSON.stringify(responseJson.data))
            })
            .then(console.log("Fetch completed for " + key))
        }
        catch(error){
            throw error;
        }
    }

    async _cacheJSONFromAPIWithExpDate(key, url){
        try{
            await this._cacheJSONFromAPIAsync(key, url);
            await this._cacheExpirationDate(key);
        }
        catch(error){
            throw error;
        }

    }

    async _cacheStringAsync(key, string){
        console.log("Caching the string with the key " + key)
        await AsyncStorage.setItem(key, string)
    }

    async _cacheStringWithExpDate(key, string){
        await this._cacheStringAsync(key, string);
        await this._cacheExpirationDate(key);
    }

    async _cacheExpirationDate(key){
        expirationDate = this.createExpirationDate();
        expDateKey = this.createExpirationDateKey(key);
        await this._cacheStringAsync(expDateKey, expirationDate);
    }

    createExpirationDate(){
        timeInMinutes = 30
        expirationDate = new Date()        
        expirationDate.setMinutes(expirationDate.getMinutes() + timeInMinutes)
        return expirationDate
    }

    createExpirationDateKey(key){
        return key + "ExpDate"
    }

    async _hasAPIData(key){
        await AsyncStorage.getItem(key, (err, result) => {
            hasAPIData = result != null
        });
        return hasAPIData;
    }

    async _hasExpired(key){
        expDateKey = this.createExpirationDateKey(key)
        expirationDate = await this._getStringFromStorage(expDateKey)
        expirationDate = Date.parse(expirationDate)
        currentDate = new Date()
        return expirationDate <= currentDate
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

    async _refreshJSONFromStorage(key, url){
        console.log("Refreshing " + key)
        hasExpired = await this._hasExpired(key)
        if(hasExpired){
            console.log("The data for " + key + " has expired!")
            try{
                await this._cacheJSONFromAPIWithExpDate(key, url)
            }
            catch(error){
                throw error;
            }
        }
        return await this._getJSONFromStorage(key)
    }

    async _removeDataFromStorage(key){
        console.log("Removing " + key + " from storage.")
        await AsyncStorage.removeItem(key)
        .then(console.log(key + " has been removed."))
    }
}