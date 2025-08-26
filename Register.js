import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const Register = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", credentials);
            navigate("/login");
        } catch (error) {
            console.error("Registration failed", error.response.data);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control" 
                            placeholder="Username" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
