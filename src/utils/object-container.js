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
        if (Date.now() < ObjectContainer.startTime + 5000) {
            if (Date.now() - ObjectContainer.startTime < 500) {
                ObjectContainer.background.style.opacity = (Date.now() - ObjectContainer.startTime) / 500;
            }
            else if (Date.now() - ObjectContainer.startTime > 4500) {
                ObjectContainer.background.style.opacity = 1 - (Date.now() - ObjectContainer.startTime - 4500) / 500;
            }
            for (var i = 0; i < 100; i++) {
                ObjectContainer.elements[i].style.transform = "rotate(" + (Date.now() - ObjectContainer.startTime) / 5 + "deg)";
            }
            ObjectContainer.elements[0].style.marginLeft = (Date.now() - ObjectContainer.startTime) / 10 + "px";
            window.requestAnimationFrame(ObjectContainer.frameCallback);
        }
        else {
            document.body.removeChild(ObjectContainer.background);
            if (ObjectContainer.testNumber < 250) {
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
        this.elements = [];
        this.background = document.createElement("div");
        this.background.setAttribute("class", "perfTestBackground" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
        this.text = document.createElement("p");
        this.text.innerHTML = "Testing Performance";
        this.text.setAttribute("id", "perfTestText");
        this.text.setAttribute("class", ObjectContainer.isDarkTheme() ? " dark" : "");
        document.body.appendChild(this.background);
        for (var i = 0; i < 100; i++) {
            this.elements.push(document.createElement("div"));
            this.elements[i].setAttribute("class", "perfTestElement" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
            this.elements[i].style.transformOrigin = "center";
            this.elements[i].style.marginTop = 40 + "px";

            this.background.appendChild(this.elements[i]);
        }
        this.background.appendChild(this.text);
        this.background.style.opacity = "0";
        this.startTime = Date.now();
        this.testNumber = 0;
        window.requestAnimationFrame(this.frameCallback);
    }

}

ObjectContainer.darkMode = CookieManager.getCookie("theme") == "dark";

/*if (CookieManager.getCookie("animations") == "") {
    ObjectContainer.checkPerformance();
}
else {
    ObjectContainer.animations = CookieManager.getCookie("animations") == "yes";
}*/

//ObjectContainer.checkPerformance();

ObjectContainer.httpCommunicator = new HttpCommunicator();