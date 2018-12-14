import HttpCommunicator from './http-communicator';
import Animator from './animator';


export default class ObjectContainer {

    static getHttpCommunicator() {
        return new HttpCommunicator();
    }

    static getAnimator() {
        return new Animator();
    }

}