import React from 'react';
import RegistrationActionCreator from '../actions/RegistrationActionCreator';
import ProvincesStore from '../stores/ProvincesStore';
import Alert from './Alert';
import $ from 'jquery';

function getProvincesList() {
    return {
        provinces: ProvincesStore.getProvincesList()
    }
}

function getCitiesList() {
    return {
        cities: ProvincesStore.getCitiesList()
    }
}

let Registration = {
    getInitialState: function() {
        return { provinces: null,
            cities: null,
            displayAlert: false,
            errorMessage: ""
        };
    },
    componentWillMount: function() {
        RegistrationActionCreator.getProvinces();
    },
    componentDidMount: function() {
        ProvincesStore.addChangeListener(this._onFetchedProvinces);
        ProvincesStore.addChangeListener(this._renderOnSelectedProvince);
    },
    // it is always a good idea to remove listener when unmounting
    componentWillUnmount: function() {
        ProvincesStore.removeChangeListener(this._onFetchedProvinces);
        ProvincesStore.removeChangeListener(this._renderOnSelectedProvince);
    },
    _onFetchedProvinces: function() {
        this.setState(getProvincesList());
    },
    _onSelectedProvince: function() {
        RegistrationActionCreator.getCitiesByProvinceId(this.refs.province.value);
    },
    _renderOnSelectedProvince: function() {
        this.setState(getCitiesList());
    },
    _onSubmit: function(e) {
        e.preventDefault();
        this.state.displayAlert = false;
        this.state.errorMessage = "";

        let formComponent = $('#form'), data = {};

        let company = this.refs.company.value.trim(),
        phoneNo = this.refs.phoneNo.value.trim(),
        companyWebsite = this.refs.companyWebsite.value.trim(),
        tin = this.refs.tin.value.trim(),
        fName = this.refs.fName.value.trim(),
        lName = this.refs.lName.value.trim(),
        userEmail = this.refs.userEmail.value.trim(),
        province = this.refs.province.value.trim(),
        city = this.refs.city.value.trim(),
        gender = this.refs.gender.value.trim(),
        password = this.refs.password.value.trim(),
        confirmPassword = this.refs.confirmPassword.value.trim(),
        captcha = this.refs.captcha.value.trim();

        if (province == 0) {
            this.state.errorMessage = "Please choose province.";
            this.state.displayAlert = true;
        }
        if (city == 0) {
            this.state.errorMessage = "Please choose city.";
            this.state.displayAlert = true;
        }
        if (gender === 0) {
            this.state.errorMessage = "Please choose your gender.";
            this.state.displayAlert = true;
        }
        if (company.length < 2) {
            this.state.errorMessage = "Invalid company name.";
            this.state.displayAlert = true;
        }
        if (phoneNo.length < 7) {
            this.state.errorMessage = "Invalid phone number.";
            this.state.displayAlert = true;
        }
        if (tin.length < 12) {
            this.state.errorMessage = "Invalid company TIN.";
            this.state.displayAlert = true;
        }
        if (fName.length < 2) {
            this.state.errorMessage = "Invalid first name.";
            this.state.displayAlert = true;
        }
        if (lName.length < 2) {
            this.state.errorMessage = "Invalid last name.";
            this.state.displayAlert = true;
        }
        if (password.length < 6) {
            this.state.errorMessage = "Password should be at least 6 alphanumeric characters.";
            this.state.displayAlert = true;
        }
        if (confirmPassword.length < 6) {
            this.state.errorMessage = "Password should be at least 6 alphanumeric characters.";
            this.state.displayAlert = true;
        }
        if (password !== confirmPassword) {
            this.state.errorMessage = "Password and confirm password are not the same.";
            this.state.displayAlert = true;
        }
        if (captcha.length < 5) {
            this.state.errorMessage = "Invalid captcha.";
            this.state.displayAlert = true;
        }

        formComponent.find('[name]').each(function(index, component) {
            data[component.name] = component.value;
        });

        if (this.state.displayAlert)
            this.forceUpdate();
        else
            RegistrationActionCreator.onSubmit(data);        
    },
	render: function() {
        let renderProvinces = null, renderCities = null;
        let AlertComponent = null;

        if (this.state.provinces) {
            renderProvinces = this.state.provinces.map((province, index) => {
                return (<option value={province.id} key={index}>{province.provinceName}</option>);
            });
        }
        if (this.state.cities) {
            renderCities = this.state.cities.map((city, index) => {
                return (<option value={city.id} key={index}>{city.cityName}</option>);
            });
        }

		return (<div className="container">
				<div className="row">
            <div className="col-sm-6">
                <h4 className="page_title">Register</h4>
                <hr />
                <h5>Company Details</h5> <hr />
                <p>Fill out the form completely to use the services.</p>
                
                <Alert message={this.state.errorMessage} />

                <form className="form-horizontal" id="form" method="post" action="#">
                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="company">Company name</label>
                        <div className="col-sm-9">
                            <input className="form-control" type="text" ref="company" id="company" name="company" placeholder="Company name" />
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="province">Province</label>
                        <div className="col-sm-9">
                            <select className="form-control" ref="province" name="province" onChange={this._onSelectedProvince}>
                                <option value="0">-- select --</option>
                                {renderProvinces}
                            </select>
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="city">City</label>
                        <div className="col-sm-9">
                            <select className="form-control" id="city" name="city" ref="city">
                                <option value="0">-- select --</option>
                                {renderCities}
                            </select>
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="address">Address</label>
                        <div className="col-sm-9">
                            <input className="form-control" type="text" id="address" name="address" placeholder="Address" ref="address" />
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="phoneNo">Phone number</label>
                        <div className="col-sm-9">
                            <input className="form-control" type="text" id="phoneNo" name="phoneNo" placeholder="Phone number" ref="phoneNo" />
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="companyWebsite">Company website</label>
                        <div className="col-sm-9">
                            <input className="form-control" type="text" id="companyEmail" name="companyWebsite" placeholder="Company website" ref="companyWebsite" />
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="tin">TIN</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="tin" name="tin" placeholder="12 digit TIN" ref="tin" />
                        </div>
                    </div>
                    <hr />
                    <h5>Administrator</h5> <hr />
                    <div className="form-group registerSubGroup">
                        <label className="col-sm-2 control-label" htmlFor="fName">First name</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" id="fName" name="fName" placeholder="First name" ref="fName" />
                        </div>
                        <label className="col-sm-2 control-label" htmlFor="lName">Last name</label>
                        <div className="col-sm-4">
                            <input type="text" className="form-control" id="lName" name="lName" placeholder="Last name" ref="lName" />
                        </div>
                    </div>
                    
                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="userEmail">Email</label>
                        <div className="col-sm-9">
                            <input type="email" className="form-control" id="userEmail" name="userEmail" placeholder="User email" ref="userEmail" />
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="gender">Gender</label>
                        <div className="col-sm-9">
                            <select className="form-control" id="gender" name="gender" ref="gender">
                                <option value="0">-- select --</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="password">Password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" id="password" name="password" placeholder="Password" ref="password" />
                        </div>
                    </div>
                    <div className="form-group registerSubGroup">
                        <label className="col-sm-3 control-label" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" ref="confirmPassword" />
                        </div>
                    </div>

                    <h5>Captcha</h5> <hr />

                    <div className="form-group">
                        <div className="col-md-4">
                            <h2>Captcha here</h2>
                        </div>
                        <div className="col-md-4">
                            <input id="captcha" name="captcha" type="text" className="form-control" autoComplete="off" placeholder="Enter captcha here" ref="captcha" />
                        </div>
                    </div>

                    <div className="form-group">
                        <hr />
                        <div className="pull-right">
                            <button type="submit" className="btn btn-primary" onClick={this._onSubmit}>Submit</button>
                            <button type="button" className="btn btn-default" onclick="#">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="col-sm-6">
            </div>
        </div>
			</div>
			);
	}
};

export default React.createClass(Registration);