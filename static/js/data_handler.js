let dataHandler = {
    keyInLocalStorage: 'starwars-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function () {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        this._data = JSON.parse(localStorage.getItem(this.keyInLocalStorage));
        console.log(this._data);
    },
    _saveData: function () {
        // it is not called from outside
        // saves the data from this._data to local storage
        let dataToBeSaved = JSON.stringify(this._data);
        localStorage.setItem(this.keyInLocalStorage, dataToBeSaved);

    },
    init: function () {
        this._loadData();
    },
    getPlanets: function (callback) {
        let url = 'https://swapi.co/api/planets/';
        callback(url);
    }
};