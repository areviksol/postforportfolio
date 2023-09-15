import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';

const Navbar = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<BootstrapNavbar bg="dark" variant="dark">
		  <BootstrapNavbar.Brand>
			Posts
		  </BootstrapNavbar.Brand>
		  <BootstrapNavbar.Collapse className="justify-content-end">
			<Button variant="danger" onClick={handleLogout}>
			  <i className="fas fa-power-off"></i> Logout
			</Button>
		  </BootstrapNavbar.Collapse>
		</BootstrapNavbar>
	  );
};

export default Navbar;
