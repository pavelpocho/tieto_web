import CookieManager from './cookie-manager';

export default class HttpCommunicator {

    constructor() {
        this.testUrl = "http://localhost:49292/api/";
        this.prodUrl = "http://localhost:49292/api/";
        this.url = this.testUrl;
    }

    parseJson(string) {
        try {
            return JSON.parse(string);
        }
        catch (e) {
            return string;
        }
    }

    prep(callback, ...params) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                try {
                    if (JSON.parse(this.response).token != undefined) {
                        let t = JSON.parse(this.response).token;
                        CookieManager.setCookie("token", "Bearer " + t, 365);
                        //Edit the expiration days according to expiration of token (keep signed in or not)
                        HttpCommunicator.token = "Bearer " + t;
                    }   
                }
                catch (e) {
                }
                try {
                    callback(JSON.parse(this.response), this.status);
                }
                catch (e) {
                    callback(this.response, this.status);
                }
            }
        }
        var paramString = "?";
        for (var i = 0; i < params.length; i++) {
            if (i == params.length - 1) {
                paramString = paramString + params[i];
            }
            else {
                paramString = paramString + params[i] + "&";
            }
        }
        return [xhttp, paramString];
    }

    get(url, callback, ...params) {
        var tried = this.prep(callback, ...params);
        var xhttp = tried[0];
        xhttp.open("GET", url + tried[1]);
        if (HttpCommunicator.token != undefined) {
            xhttp.setRequestHeader("Authorization", HttpCommunicator.token);
        }
        else if (CookieManager.getCookie("token") != "") {
            xhttp.setRequestHeader("Authorization", CookieManager.getCookie("token"));
        }
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
    }

    post(url, callback, body, ...params) {
        var tried = this.prep(callback, ...params);
        var xhttp = tried[0];
        xhttp.open("POST", url + tried[1]);
        if (HttpCommunicator.token != undefined) {
            xhttp.setRequestHeader("Authorization", HttpCommunicator.token);
        }
        else if (CookieManager.getCookie("token") != "") {
            xhttp.setRequestHeader("Authorization", CookieManager.getCookie("token"));
        }
        //Take the token from the HttpCommunicator static property or the cookie, depending on what's available (after login, the static property is undefined)
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(body));
    }

    getExchangeRates(date, callback) {
        this.post(this.url + "trip/getExchangeRates", callback, date.toJSON());
    }

    saveTrip(trip, callback) {
        this.post(this.url + "trip/saveTrip", callback, trip);
    }

    saveTitle(tripId, title, callback) {
        this.post(this.url + "trip/saveTitle/" + tripId, callback, title);
    }

    savePurpose(tripId, purpose, callback) {
        this.post(this.url + "trip/savePurpose/" + tripId, callback, purpose);
    }

    saveProject(tripId, project, callback) {
        this.post(this.url + "trip/saveProject/" + tripId, callback, project);
    }

    saveTask(tripId, task, callback) {
        this.post(this.url + "trip/saveTask/" + tripId, callback, task);
    }

    saveCity(locationId, callback, names) {
        this.post(this.url + "location/saveCity/" + locationId, callback, names)
    }

    saveInboundTravel(locationId, callback, travelType) {
        this.post(this.url + "location/saveInboundTravel/" + locationId, callback, travelType)
    }
    
    saveArrivalTime(locationId, callback, time) {
        if (time == undefined) {
            time = -1;
            //If undefined is sent, the API recieves a 0 and interprets it as midnight
        }
        this.post(this.url + "location/saveArrivalTime/" + locationId, callback, time)
    }
    
    saveDepartureTime(locationId, callback, time) {
        if (time == undefined) {
            time = -1;
            //If undefined is sent, the API recieves a 0 and interprets it as midnight
        }
        this.post(this.url + "location/saveDepartureTime/" + locationId, callback, time)
    }

    saveArrivalDate(locationId, callback, date) {
        if (date == undefined) {
            //If undefined is sent, the API recieves a 0 and interprets it as 1.1.1970
            date = -1;
        }
        this.post(this.url + "location/saveArrivalDate/" + locationId, callback, date)
    }
    
    saveDepartureDate(locationId, callback, date) {
        if (date == undefined) {
            //If undefined is sent, the API recieves a 0 and interprets it as 1.1.1970
            date = -1;
        }
        this.post(this.url + "location/saveDepartureDate/" + locationId, callback, date)
    }

    saveAndReturnTrip(trip, callback) {
        this.post(this.url + "trip/saveAndReturnTrip/", callback, trip);
    }

    saveComment(tripId, task, callback) {
        this.post(this.url + "trip/saveComment/" + tripId, callback, task);
    }

    getTripList(callback) {
        this.get(this.url + "trip/getTripList", callback);
    }

    getTripDetails(tripId, callback) {
        this.get(this.url + "trip/" + tripId, callback);
    }

    deleteTrip(tripId, callback) {
        this.post(this.url + "trip/delete", callback, tripId);
    }

    getExportToken(tripId, callback) {
        this.post(this.url + "trip/export/" + tripId, callback);
    }

    exportTrip(token, callback) {
        var w = window.open(this.url + "trip/getPdf/" + token, "_blank");
        callback(w);
    }

    duplicateTrip(tripId, callback) {
        this.post(this.url + "trip/duplicate", callback, tripId);
    }

    getCountryList(callback) {
        this.get(this.url + "trip/countryList", callback);
    }

    login(username, password, callback) {
        this.post(this.url + "user/authenticate", callback, {Username: username, Password: password});
    }

    validateCity(city, callback) {
        this.get(this.url + "maps/validateCity/" + city, callback);
    }

    //Delete this
    getDateTime() {
        this.post(this.url + "location/getDateTime/", (d) => {
            console.log("Recieved this date:");
            console.log(d);
            console.log("new Date(d) -->");
            console.log(new Date(d));
        })
    }
    //But it shows how dates are recieved (default in JSON, can then create )
    //Delete this

    getCurrencyTable(date, callback) {
        if (date == "") {
            this.get("https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt", callback);
        }
        else {
            this.get("https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt?date=" + date, callback);
        }
    }

    tokenCheck(token, callback, unauthorizedCallback) {
        HttpCommunicator.token = token;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback();
            }
            else if (this.readyState == 4 && this.status == 401) {
                unauthorizedCallback();
            }
        }
        xhttp.open("GET", this.url + "user/tokenCheck");
        if (HttpCommunicator.token != undefined) {
            xhttp.setRequestHeader("Authorization", HttpCommunicator.token);
        }
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
    }

    getAppName() {
        return "trippi ;)";
    }

}