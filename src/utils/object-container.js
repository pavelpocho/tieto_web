import HttpCommunicator from './http-communicator';
import Animator from './animator';
import CookieManager from './cookie-manager';


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

}

ObjectContainer.httpCommunicator = new HttpCommunicator();