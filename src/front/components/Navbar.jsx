import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: 'logout' });
		alert('Sesión cerrada correctamente');
		navigate('/login');
	};

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<div className="container d-flex justify-content-around">
					<Link className="navbar-brand" to="/">
						<i className="fas fa-rocket me-2"></i>
						Mi App JWT
					</Link>

					<button 
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav ms-auto">
							<li className="nav-item me-2">
								<Link className="nav-link" to="/">
									<i className="fas fa-home me-2"></i>
									Home
								</Link>
							</li>
							{store.isAuthenticated ? (
								//Usuario autenticado
								<li className="nav-item dropdown">
									<a 
										href="#" 
										className="nav-link dropdown-toggle"
										id="navbarDropdown"
										role="button"
										data-bs-toggle="dropdown"
									>
										<i className="fas fa-user me-2"></i>
										{store.user?.first_name || store.user?.email || 'Usuario'}
									</a>
									<ul className="dropdown-menu">
										<li>
											<Link className="dropdown-item" to="/private">
												<i className="fas fa-user-circle me-2"></i>
												Mi Perfil
											</Link>
										</li>
										<li><hr className="dropwdown-divider"/></li>
										<li>
											<button 
												className="dropdown-item text-danger"
												onClick={handleLogout}
											>
												<i className="fas fa-sign-out-alt me-2"></i>
												Cerrar Sesión
											</button>
										</li>
									</ul>
								</li>
							) : (
								// Usuario no autenticado
								<>
									<li className="nav-item me-2">
										<Link className="nav-link" to="/login">
											<i className="fas fa-sign-in-alt me-2"></i>
											Iniciar Sesión
										</Link>
									</li>
									<li className="nav-item me-2">
										<Link className="nav-link" to="/signup">
											<i className="fas fa-user-plus me-2"></i>
											Registrarse
										</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
};