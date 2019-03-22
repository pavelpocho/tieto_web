export default class Location {
    
    constructor(id, isCrossing, crossingFrom, crossingTo, inboundTravelType, city, arrival, departure, food) {
        this.id = id;
        this.isCrossing = isCrossing;
        this.crossingFrom = crossingFrom;
        this.crossingTo = crossingTo;
        this.inboundTravelType = inboundTravelType; //integer [0 - 5]
        this.city = city;
        this.arrival = arrival;
        this.departure = departure;
        this.food = food; //Object
    }

}