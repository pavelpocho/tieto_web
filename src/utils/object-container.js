import HttpCommunicator from './http-communicator';


export default class ObjectContainer {

    static getHttpCommunicator() {
        return new HttpCommunicator();
    }

}