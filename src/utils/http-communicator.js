import CookieManager from './cookie-manager';

export default class HttpCommunicator {

    constructor() {
        this.url = (window.location.href.includes("pre/") ? window.location.href.split("pre/")[0] : window.location.href) + "api/";
        this.genUrl = this.url.substring(0, this.url.length - 4);
        this.buffer = [];
        this.firing = false;
    }

    prep(callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = ((xhttp) => {
            if (xhttp.readyState == 4) {
                try {
                    if (JSON.parse(xhttp.response).token != undefined) CookieManager.setCookie("token", "Bearer " + JSON.parse(xhttp.response).token, 10000);
                    if (JSON.parse(xhttp.response).refreshToken != undefined) CookieManager.setCookie("refreshToken", JSON.parse(xhttp.response).refreshToken, 10000);
                    if (JSON.parse(xhttp.response).tokenExpirationUTC != undefined) CookieManager.setCookie("tokenExpirationUTC", new Date(JSON.parse(xhttp.response).tokenExpirationUTC).getTime(), 10000);
                }
                catch (e) {
                }
                var jsonGo = false;
                try {
                    JSON.parse(xhttp.response);
                    jsonGo = true;
                }
                catch (SyntaxError) {
                       
                }
                if (!jsonGo) {
                    callback(xhttp.response, xhttp.status);
                }
                else {
                    callback(JSON.parse(xhttp.response), xhttp.status);
                }
                //Performance?
                this.fireNext();
            }
        }).bind(undefined, xhttp);
        return xhttp;
    }

    send(bufferItem) {
        var xhttp = bufferItem.tried;
        xhttp.open(bufferItem.method, bufferItem.url);
        xhttp.setRequestHeader("Authorization", CookieManager.getCookie("token"));
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(bufferItem.method == "POST" ? bufferItem.body : null));
    }

    addPostToBuffer(url, callback, body) {
        this.buffer.push({tried: this.prep(callback), url: url, body: body, method: "POST"});
        if (!this.firing) this.fireNext();
    }

    addGetToBuffer(url, callback) {
        this.buffer.push({tried: this.prep(callback), url: url, method: "GET"});
        if (!this.firing) this.fireNext();
    }

    fireNext() {
        if (HttpCommunicator.authenticated && CookieManager.getCookie("tokenExpirationUTC") - 10000 < Date.now()) {
            this.refreshToken(() => {
                this.fireNextInner();
            }, () => {
                window.location.reload();
            });
        }
        else {
            this.fireNextInner();
        }
    }

    fireNextInner() {
        if (this.buffer.length == 0) {
            this.firing = false;
            return;
        }
        this.firing = true;
        this.send(this.buffer[0]);
        this.buffer.splice(0, 1);
    }


    refreshToken(callback, unauthorizedCallback) { 
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && (this.status == 200 || this.status == 204)) {
                HttpCommunicator.authenticated = true;
                if (JSON.parse(xhttp.response).token != undefined) CookieManager.setCookie("token", "Bearer " + JSON.parse(xhttp.response).token, 10000);
                if (JSON.parse(xhttp.response).refreshToken != undefined) CookieManager.setCookie("refreshToken", JSON.parse(xhttp.response).refreshToken, 10000);
                if (JSON.parse(xhttp.response).tokenExpirationUTC != undefined) CookieManager.setCookie("tokenExpirationUTC", new Date(JSON.parse(xhttp.response).tokenExpirationUTC).getTime(), 10000);
                callback();
            }
            else if (this.readyState == 4 && this.status == 401) {
                unauthorizedCallback();
            }
        }
        var cookie = CookieManager.getCookie("refreshToken");
        xhttp.open("POST", this.url + "user/refreshToken/" + cookie);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
    }


    sendFeedback(object, callback) { this.addPostToBuffer(this.url + "feedback/saveFeedback", callback, object) }

    getFeedbackList(callback) { this.addGetToBuffer(this.url + "feedback/getList", callback) }

    likeFeedback(id, callback) { this.addPostToBuffer(this.url + "feedback/like", callback, id) }

    getWelcomeDone(callback) { this.addGetToBuffer(this.url + "user/welcomeDone", callback) }

    setWelcomeDone() { this.addPostToBuffer(this.url + "user/welcomeDone", () => {}) }


    login(username, password, longSign, callback) { this.addPostToBuffer(this.url + "user/authenticate", callback, {Username: username, Password: password, LongSign: longSign}) }

    register(username, password, fullname, superiorEmail, callback) { this.addPostToBuffer(this.url + "user/register", callback, {Username: username, Password: password, FullName: fullname, SuperiorEmail: superiorEmail}) }

    checkEmail(email, callback) { this.addPostToBuffer(this.url + "user/checkEmail", callback, email) }

    resetPassword(email, callback) { this.addPostToBuffer(this.url + "user/resetPassword", callback, email) }

    getUserAccountData(callback) { this.addPostToBuffer(this.url + "user/getUserAccountData", callback) }

    setUserAccountData(fullName, superiorEmail, callback) { this.addPostToBuffer(this.url + "user/setUserAccountData", callback, { FullName: fullName, SuperiorEmail: superiorEmail }) }


    getTripList(callback) { this.addGetToBuffer(this.url + "trip/getTripList", callback) }

    saveTrip(trip, callback) { this.addPostToBuffer(this.url + "trip/saveTrip", callback, trip) }

    deleteTrip(tripId, callback) { this.addPostToBuffer(this.url + "trip/delete", callback, tripId) }

    duplicateTrip(duplicateObject, callback) { this.addPostToBuffer(this.url + "trip/duplicate", callback, duplicateObject) }


    getExportToken(tripId, callback) { this.addPostToBuffer(this.url + "trip/export/" + tripId, callback) }

    exportTrip(token, callback) { var w = window.open(this.url + "trip/getPdf/" + token, "_blank"); callback(w) }

    tripOpen(tripId, callback) { this.addPostToBuffer(this.url + "trip/tripOpen/" + tripId, callback) }

    saveTitle(tripId, title, callback) { this.addPostToBuffer(this.url + "trip/saveTitle/" + tripId, callback, title) }

    savePurpose(tripId, purpose, callback) { this.addPostToBuffer(this.url + "trip/savePurpose/" + tripId, callback, purpose) }

    saveProject(tripId, project, callback) { this.addPostToBuffer(this.url + "trip/saveProject/" + tripId, callback, project) }

    saveTask(tripId, task, callback) { this.addPostToBuffer(this.url + "trip/saveTask/" + tripId, callback, task) }

    saveComment(tripId, task, callback) { this.addPostToBuffer(this.url + "trip/saveComment/" + tripId, callback, task) }


    addLocation(index, tripId, callback) { this.addPostToBuffer(this.url + "trip/addLocation/" + index, callback, tripId) }

    saveCity(locationId, callback, saveCityDT) { this.addPostToBuffer(this.url + "location/saveCity/" + locationId, callback, saveCityDT) }

    saveCountry(locationId, callback, country) { this.addPostToBuffer(this.url + "location/setTransitCountryName/" + locationId, callback, country) }

    saveInboundTravel(locationId, callback, travelType) { this.addPostToBuffer(this.url + "location/saveInboundTravel/" + locationId, callback, travelType) }
    

    //If undefined is sent, the API recieves a 0 and interprets it as midnight or 1.1.1970
    catchUndefined(number) { return (number == undefined ? -1 : number) }

    saveArrivalTime(locationId, callback, time) { this.addPostToBuffer(this.url + "location/saveArrivalTime/" + locationId, callback, this.catchUndefined(time)) }
    
    saveDepartureTime(locationId, callback, time) { this.addPostToBuffer(this.url + "location/saveDepartureTime/" + locationId, callback, this.catchUndefined(time)) }

    saveArrivalDate(locationId, callback, date) { this.addPostToBuffer(this.url + "location/saveArrivalDate/" + locationId, callback, this.catchUndefined(date)) }
    
    saveDepartureDate(locationId, callback, date) { this.addPostToBuffer(this.url + "location/saveDepartureDate/" + locationId, callback, this.catchUndefined(date)) }

    saveCrossedAtTime(locationId, callback, time) { this.addPostToBuffer(this.url + "location/setBorderCrossTime/" + locationId, callback, this.catchUndefined(time)) }

    saveCrossedAtDate(locationId, callback, date) { this.addPostToBuffer(this.url + "location/setBorderCrossDate/" + locationId, callback, this.catchUndefined(date)) }

    changeOnlyLocation(locationId, callback) { this.addPostToBuffer(this.url + "location/changeOnlyLocation/", callback, locationId) }


    saveFood(locationId, dayIndex, foodIndex, select, callback) { this.addPostToBuffer(this.url + "location/saveFood/", callback, { locationId, dayIndex, foodIndex, select }) }

    deleteLocation(locationId, callback) { this.addPostToBuffer(this.url + "location/delete/", callback, locationId) }

    validateCity(city, callback) { this.addGetToBuffer(this.url + "maps/validateCity/" + city, callback) }

    validateCountry(country, callback) { this.addGetToBuffer(this.url + "maps/validateCountry/" + country, callback) }

    resetSectionModifications(locationId, callback) { this.addPostToBuffer(this.url + "location/resetSectionModifications/" + locationId, callback) }

    editExchangeRate(tripId, currencyCode, value, callback) { this.addPostToBuffer(this.url + "trip/editExchangeRate/" + tripId + "/" + currencyCode, callback, value) }

    resetExchangeRate(tripId, currencyCode, callback) { this.addPostToBuffer(this.url + "trip/resetExchangeRate/" + tripId + "/" + currencyCode, callback) }

    setNoExportWarnings(value, callback) { this.addPostToBuffer(this.url + "user/noExportWarnings/", callback, value) }


    tokenCheck(callback, unauthorizedCallback) {
        if (CookieManager.getCookie("refreshToken") == "") {
            unauthorizedCallback();
        }
        else if (CookieManager.getCookie("tokenExpirationUTC") == "" || parseInt(CookieManager.getCookie("tokenExpirationUTC")) < Date.now()) {
            this.refreshToken(() => {
                callback();
            }, () => {
                unauthorizedCallback();
            });
        }
        else {
            callback();
        }
    }


    getCountryList(callback) { this.addGetToBuffer(this.url + "country/list", callback) }

    getCountryList2020(callback) { this.addGetToBuffer(this.url + "country/list2020", callback) }

    saveCountryAllowance(allowance, callback) { this.addPostToBuffer(this.url + "country/update", callback, allowance) }

    saveCountryAllowances(allowances, callback) { this.addPostToBuffer(this.url + "country/updateArray", callback, allowances) }

    saveCountryAllowance2020(allowance, callback) { this.addPostToBuffer(this.url + "country/update2020", callback, allowance) }

    saveCountryAllowances2020(allowances, callback) { this.addPostToBuffer(this.url + "country/updateArray2020", callback, allowances) }

    getConfigurationList(callback) { this.addGetToBuffer(this.url + "configuration/list", callback) }

    getStatistics(callback) { this.addGetToBuffer(this.url + "app/statistics", callback) }

    saveConfiguration(config, callback) { this.addPostToBuffer(this.url + "configuration/update", callback, config) }

    
    getApiVersion(callback) { this.addGetToBuffer(this.url + "app/version", callback) }

    resetWelcomeDone(callback) { this.addPostToBuffer(this.url + "app/resetWelcomeDone", callback) }

    resolveFeedback(id, callback) { this.addPostToBuffer(this.url + "feedback/resolve", callback, id) }
    
    deleteFeedback(id, callback) { this.addPostToBuffer(this.url + "feedback/delete", callback, id) }

    addFeedbackReply(id, text, callback) { this.addPostToBuffer(this.url + "feedback/addReply/" + id, callback, text) }

}