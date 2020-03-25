import React, { Component } from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
class Login extends Component {
    state = {
        email: "",
        password: "",
        loggedIn: false
    };
    handleRedirect = () => {
        console.log("yo")
        if (this.state.loggedIn === true) {
            this.props.history.push('/')
        }
    }
    

    handleFormSubmit = event => {
        if (!this.state.email) {
            // return alert("Please enter your email");
            return this.setState({loginFlag: 1});
        }
        if (!this.state.password) {
            // return alert("Please enter your password")
            return this.setState({loginFlag: 2});
        }

        if (this.state.email && this.state.password) {
            let currentComponent = this;

            console.log("state test " + this.state.email);
            API.login({
                email: this.state.email,
                password: this.state.password
            }).then(function(res){
                console.log("CLIENT DATA ",res.data);
                sessionStorage.setItem("UserEmail", JSON.stringify(res.data.email))
                sessionStorage.setItem("UserId", JSON.stringify(res.data._id))
                sessionStorage.setItem("UserName", JSON.stringify(res.data.name))
                sessionStorage.setItem("Logout", false);
                
            }).catch(function(error){
                if (error) {
                    return currentComponent.setState({loginFlag: 3})
                }
            })
        }
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };
    
    render() {
        return (
            <div className="row mt-5">
                <div className="col-md-6 m-auto">
                    <div className="card card-body">
                        <h1 className="text-center mb-3 heading"><i className="fas fa-sign-in-alt"></i>  Login</h1>
                        {/* <% include ./partials/messages %> */}
                        { this.state.loginFlag === 1 && <p>Please enter your email</p>}
                        { this.state.loginFlag === 2 && <p>Please enter your password</p>}
                        { this.state.loginFlag === 3 && <p>Email or password is incorrect</p>}
                        <form action="/login" method="POST">
                            <div className="form-group">
                                <label for="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label for="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <button onClick={this.handleFormSubmit} type="button" className="standardButton loginButton">Login</button>
                        </form>
                        <p className="lead mt-4">
                            No Account? <Link to="/signup">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;