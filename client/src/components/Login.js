import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import octopus from "../assets/octopus2.png"

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:3001/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<Container className="mt-5">
			<Row className="justify-content-center">
				<Col md={6}>
					<Form onSubmit={handleSubmit} className="border p-3 bg-dark text-light">
						<div className="d-flex align-items-center">
							<img src={octopus} alt="Octopus Icon" className="octopus-icon mr-3 oct" />
							<div>
								<h1 className="text-light">Login to Your Account</h1>
							</div>
						</div>
						<Form.Group className="mb-3">
							<Form.Control
								type="email"
								placeholder="Email"
								name="email"
								onChange={handleChange}
								value={data.email}
								required
								className="bg-dark text-light border-light custom-input"
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Control
								type="password"
								placeholder="Password"
								name="password"
								onChange={handleChange}
								value={data.password}
								required
								className="bg-dark text-light border-light  custom-input"
							/>
						</Form.Group>

						{error && <Alert variant="danger">{error}</Alert>}
						<Button variant="success" type="submit">
							Sign In
						</Button>
						<div className="mt-3 text-light d-flex align-items-center">
							<span className="mr-2">New Here?</span>
							<Link to="/signup" className="signup-link ml-2">
								Sign Up
							</Link>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default Login;