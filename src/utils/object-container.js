import HttpCommunicator from './http-communicator';
import Animator from './animator';
import CookieManager from './cookie-manager';
import TripManager from './trip-manager';


export default class ObjectContainer {

    static getHttpCommunicator() {
        return ObjectContainer.httpCommunicator;
    }

    static getAnimator() {
        return new Animator();
    }

    static getCookieManager() {
        return new CookieManager();
    }

    static getTripManager() {
        return new TripManager();
    }

    static isDarkTheme() {
        return this.darkMode;
    }

    static toggleDarkMode() {
        this.darkMode = !this.darkMode;
        if (this.darkMode) {
            CookieManager.setCookie("theme", "dark", 10000);
        }
        else {
            CookieManager.setCookie("theme", "light", 10000);
        }
    }

    static isAnimations() {
        return this.animations;
    }

    static toggleAnimations() {
        this.animations = !this.animations;
        if (this.animations) {
            CookieManager.setCookie("animations", "yes", 10000);
        }
        else {
            CookieManager.setCookie("animations", "no", 10000);
        }
    }

    static isIgnoreWelcome() {
        return this.ignoreWelcome;
    }

    static setIgnoreWelcome() {
        this.ignoreWelcome = true;
    }

    static frameCallback() {
        ObjectContainer.testNumber ++;
        if (Date.now() < ObjectContainer.startTime + 500) {
            window.requestAnimationFrame(ObjectContainer.frameCallback);
        }
        else {
            console.log("Performance Test FPS:");
            console.log(ObjectContainer.testNumber);
            if (ObjectContainer.testNumber < 20) {
                CookieManager.setCookie("animations", "no", 10000);
                ObjectContainer.animations = false;
            }
            else {
                CookieManager.setCookie("animations", "yes", 10000);
                ObjectContainer.animations = true;
            }
        }
    }

    static checkPerformance() {
        this.startTime = Date.now();
        this.testNumber = 0;
        window.requestAnimationFrame(this.frameCallback);
    }

}

ObjectContainer.darkMode = CookieManager.getCookie("theme") == "dark";
if (CookieManager.getCookie("animations") == "") {
    ObjectContainer.checkPerformance();
}
else {
    ObjectContainer.animations = CookieManager.getCookie("animations") == "yes";
}
ObjectContainer.httpCommunicator = new HttpCommunicator();