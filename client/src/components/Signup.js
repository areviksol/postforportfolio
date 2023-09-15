import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import octopus from "../assets/octopus.png"

const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:3001/users";
			const { data: res } = await axios.post(url, data);
			setMsg(res.message);
			setError("");
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
	useEffect(() => {
		if (msg) {
			const timer = setTimeout(() => {
				setError("");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [msg]);
	return (
		<div className="bg-transparent-cool">
			<Container>
				<Row className="vh-100  justify-content-center align-items-center">
					<Col xs={12} md={6}>
						<Form
							className="border form-cool-effect p-4 rounded bg-dark"
							onSubmit={handleSubmit}
						>
							<div className="text-center mt-3">
								<img src={octopus} alt="Octopus Icon" className="octopus-icon" />
							</div>
							<h1 className="h3 mb-4 text-center text-light">Create Account</h1>
							<Form.Group className="mb-3">
								<Form.Control
									type="text"
									placeholder="First Name"
									name="firstName"
									onChange={handleChange}
									value={data.firstName}
									required
									className="custom-input form-control bg-dark text-white" />
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Control
									type="text"
									placeholder="Last Name"
									name="lastName"
									onChange={handleChange}
									value={data.lastName}
									required
									className="custom-input form-control bg-dark text-white" />
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Control
									type="email"
									placeholder="Email"
									name="email"
									onChange={handleChange}
									value={data.email}
									required
									className="custom-input form-control bg-dark text-white" />
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Control
									type="password"
									placeholder="Password"
									name="password"
									onChange={handleChange}
									value={data.password}
									required
									className="custom-input form-control bg-dark text-white"
								/>
							</Form.Group>
							{error && <Alert variant="danger" className="mt-3">{error}</Alert>}
							{msg && <Alert variant="success" className="mt-3">{msg}</Alert>}
							<Button
								type="submit"
								variant="primary"
								className="retro-button-style btn btn-primary mt-3 w-100"
								onClick={handleSubmit}
							>
								Sign Up
							</Button>
							<div className="mt-3">
								<p className="text-light">Already have an account?{" "}</p>
								<Link to="/login" className="text-primary">
									Sign In
								</Link>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Signup;