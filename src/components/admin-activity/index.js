import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import SaveIndicator from '../save-indicator';
import CookieManager from '../../utils/cookie-manager';

export default class AdminActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            countries: [],
            configuration: [],
            pendingRequests: 0
        }

        this.saveIndicator = React.createRef();
    }

    componentDidMount() {
        let h = ObjectContainer.getHttpCommunicator();
        h.getCountryList((r, s) => {
            if (s == 200) {
                //Success
                console.log("Countries?");
                console.log(r);
                this.setState({
                    countries: r
                })
            }
            else {
                console.log("Failed countries");
                //Failed...
            }
        });
        h.getConfigurationList((r, s) => {
            if (s == 200) {
                //Success
                this.setState({
                    configuration: r
                })
            }
            else {
                console.log("Failed config list");
                //Failed...
            }
        });
    }

    checkNumber(target) {
        var string = target.value;
        string = string.replace(",", ".");
        if (isNaN(string)) {
            var foundDot = false;
            for (var i = string.length; i >=0; i--) {
                if (string[i] == "." && foundDot) {
                    string = string.replace(string.charAt(i), "");
                }
                else if (string[i] == ".") {
                    foundDot = true;
                }
                else if (isNaN(string[i])) {
                    string = string.replace(string.charAt(i), "");
                }
            }
        }
        target.value = string;
    }

    saveAllowance(target) {
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var objectId = target.getAttribute("allowanceid");
        var objectCurrency = target.getAttribute("allowancecurrency");
        var newMoney = parseFloat(target.value);
        var allowance = {
            id: objectId,
            currency: objectCurrency,
            moneyAmount: newMoney
        }

        var h = ObjectContainer.getHttpCommunicator();
        h.saveCountryAllowance(allowance, (r, s) => {
            if (s == 200) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    saveConfig(target) {
        var id = target.getAttribute("configid");
        var name = target.getAttribute("configname");

        var reduced = target.getAttribute("reduced");

        var config = { id, name, value: reduced == "true" ? target.value * 3600000 : target.value };

        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var h = ObjectContainer.getHttpCommunicator();
        h.saveConfiguration(config, (r, s) => {
            if (s == 200) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        })

    }

    setCurrency(target) {
        var ids = target.getAttribute("allowanceids").split(";");
        var moneyValues = target.getAttribute("moneyvalues").split(";");
        var currency = target.getAttribute("currency");

        this.saveIndicator.current.setStatus(1);

        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var allowances = [];

        for (var i = 0; i < ids.length; i++) {
            allowances[i] = { id: ids[i], moneyAmount: moneyValues[i], currency: currency }
        }

        var h = ObjectContainer.getHttpCommunicator();
        h.saveCountryAllowances(allowances, (r, s) => {
            if (s == 200) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
                this.setState({
                    countries: r
                })
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    signOut() {
        CookieManager.deleteCookie("token");
        window.location.reload();
    }

    render() {
        var countries = this.state.countries.map((c, i) => {
            return (
                <div key={i} className="aa-country-item">
                    <p>{c.name}</p>
                    <input allowanceid={c.rate100.id} allowancecurrency={c.rate100.currency} defaultValue={c.rate100.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance(e.target)}} />
                    <input allowanceid={c.rate66.id} allowancecurrency={c.rate66.currency} defaultValue={c.rate66.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance(e.target)}} />
                    <input allowanceid={c.rate33.id} allowancecurrency={c.rate33.currency} defaultValue={c.rate33.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance(e.target)}} />
                    <div className="aa-currency-wrap">
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 2 ? " aa-cb-selected" : "")} currency={2}>CZK</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 0 ? " aa-cb-selected" : "")} currency={0}>EUR</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 4 ? " aa-cb-selected" : "")} currency={4}>GBP</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 3 ? " aa-cb-selected" : "")} currency={3}>CHF</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 1 ? " aa-cb-selected" : "")} currency={1}>USD</button>
                        {
                            /*
                              0 = EUR,
                              1 = USD,
                              2 = CZK,
                              3 = CHF,
                              4 = GBP
                            */
                        }
                    </div>
                </div>
            )
        });

        var config = this.state.configuration.map((c, i) => {
            return (
                <div key={i} className="aa-config-wrap">
                    <p>{c.name}</p>
                    <input reduced={(c.value > 1000000).toString()} configid={c.id} configname={c.name} defaultValue={c.value > 1000000 ? c.value / 3600000 : c.value} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveConfig(e.target)}}/>
                </div>
            )
        })
        return (
            <Fragment>
                <div className="aa-top-bar">
                    <button ripplecolor="gray" onClick={() => {this.signOut()}} className="back-button"><i className="material-icons back-icon">exit_to_app</i>Log Out</button>
                    <SaveIndicator ref={this.saveIndicator} parent={this} name={"Country Allowance Rates"} />
                </div>
                <div className="aa-wrap">
                    {
                        config
                    }
                    {
                        countries
                    }
                </div>
            </Fragment>
        )
    }

}