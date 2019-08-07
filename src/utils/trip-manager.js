export default class TripManager {

    calculateTotal(trip, allInfo) {
        var usd = {amount: 0};
        var eur = {amount: 0};
        var gbp = {amount: 0};
        var chf = {amount: 0};
        var czk = {amount: 0, rate: 1};

        if (trip.exchange != null) {
            for (var i = 0; i < trip.exchange.rates.length; i++) {
                if (trip.exchange.rates[i].currencyCode == 0) {
                    this.set(trip.exchange.rates[i], eur);
                }
                else if (trip.exchange.rates[i].currencyCode == 1) {
                    this.set(trip.exchange.rates[i], usd);
                }
                else if (trip.exchange.rates[i].currencyCode == 3) {
                    this.set(trip.exchange.rates[i], chf);
                }
                else if (trip.exchange.rates[i].currencyCode == 4) {
                    this.set(trip.exchange.rates[i], gbp);
                }
            }
        }

        if (trip.daySections) {
            for (var i = 0; i < trip.daySections.length; i++) {
                var a = trip.daySections[i].allowance;
                if (a == null) continue;
                if (a.currency == 0) {
                    if (eur.amount == undefined || eur.amount == null) {
                        eur.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        eur.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 1) {
                    if (usd.amount == undefined || usd.amount == null) {
                        usd.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        usd.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 2) {
                    if (czk.amount == undefined || czk.amount == null) {
                        czk.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        czk.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 3) {
                    if (chf.amount == undefined || chf.amount == null) {
                        chf.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        chf.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 4) {
                    if (gbp.amount == undefined || gbp.amount == null) {
                        gbp.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        gbp.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
            }
        }
        var total = Math.round((eur.amount * eur.rate + usd.amount * usd.rate + gbp.amount * gbp.rate + chf.amount * chf.rate + czk.amount) * 100) / 100;
        if (isNaN(total)) {
            total = 0;
        }

        if (!allInfo) {
            return total;
        }
        else {
            return {
                total,
                czk,
                chf,
                gbp,
                eur,
                usd
            }
        }
    }

    setProp(property, input, output) {
        if (property == "altered") {
            output[property] = input[property];
        }
        else {
            output[property] = Math.round(input[property] * 100) / 100;
        }
    }

    set(input, output) {
        this.setProp("rate", input, output);
        this.setProp("defaultRate", input, output);
        this.setProp("altered", input, output);
    }

}