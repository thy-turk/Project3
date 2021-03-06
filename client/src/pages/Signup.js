import React, { Component } from "react";
import API from "../utils/API";
import bcrypt from "bcryptjs";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
class Signup extends Component {
    state = {
        fullName: "",
        email: "",
        password: "",
        password2: "",
        pass2Send: ""
    };

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleFormSubmit = event => {
        if (!this.state.fullName || !this.state.email || !this.state.password || !this.state.password2) {
            return this.setState({signupFlag: 1});
        }

        if (this.state.password !== this.state.password2) {
            return this.setState({signupFlag: 2});
        }

        if (this.state.password.length < 6) {
            return this.setState({signupFlag: 4});
        }

        if (this.state.fullName || this.state.email || this.state.password || this.state.password2) {
            let currentComponent = this;

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(this.state.password, salt, (err, hash) => {
                    if (err) throw err;
                    this.setState({pass2Send: hash});
                    API.newUser({
                        name: this.state.fullName,
                        email: this.state.email,
                        password: this.state.pass2Send,
                    })
                        .then(res => {
                            sessionStorage.setItem("UserEmail", JSON.stringify(res.data.email))
                            sessionStorage.setItem("UserId", JSON.stringify(res.data._id))
                            sessionStorage.setItem("UserName", JSON.stringify(res.data.name))
                            sessionStorage.setItem("Logout", false);
                            currentComponent.props.history.push('/');
                        })
                        .catch(function(error) {
                            console.log("Error: " + error)
                            if (error.response.data.code) {
                                currentComponent.setState({signupFlag: 5});
                                currentComponent.setState({
                                    fullName: "",
                                    email: "",
                                    password: "",
                                    password2: ""
                                })
                            }
                        })
                });
            });
        }

    };


    render() {
        return (
            <div className="row mt-5">
                <div className="col-md-6 m-auto">
                    <div className="bordered card card-body">
                        <h1 className="text-center mb-3 heading">
                            <i className="fas fa-user-plus"></i> Register
                    </h1>
                        {/* <% include ./partials/messages %> */}
                        { this.state.signupFlag === 1 && <p>Please enter all fields</p>}
                        { this.state.signupFlag === 2 && <p>Passwords do not match</p>}
                        { this.state.signupFlag === 3 && <p>Please enter a valid email</p>}
                        { this.state.signupFlag === 4 && <p>Password must be at least 6 characters</p>}
                        { this.state.signupFlag === 5 && <p>Email is already in use</p>}
                        <form noValidate action="/signup" method="POST">
                            <div className="form-group">
                                <label for="name">Name</label>
                                <input
                                    type="fullName"
                                    id="fullName"
                                    name="fullName"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    value={this.state.fullName}
                                    onChange={this.handleInputChange}
                                />
                            </div>
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
                                    placeholder="Create Password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label for="password2">Confirm Password</label>
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    value={this.state.password2}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            {/* <button onClick={this.handleFormSubmit} type="button" className="btn btn-primary btn-block btn-login"> */}
                            <Button className="standardButton" variant="light" onClick={this.handleFormSubmit}>Register</Button>
                                {/* Register
                        </button> */}
                        </form>
                        <p className="lead mt-4">Already Have An Account? <Link to="/login">Click to Login</Link></p>
                    </div>
                </div>
            </div>
        )
    };
}

export default Signup;

