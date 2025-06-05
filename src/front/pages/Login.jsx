import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [ redirect, setRedirect ] = useState(false);

    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        if (redirect && store.isAuthenticated && store.token) {
            navigate('/private');
            setRedirect(false);
        }
    }, [store.isAuthenticated, store.token, redirect, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if(errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        }

        if(!formData.password || !formData.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch({ type: 'login_start'});

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'login_success',
                    payload: {
                        token: data.access_token,
                        user: data.user
                    }
                });

                alert(`¡Bienvenido ${data.user.first_name || data.user.email}!`);
                setRedirect(true);
            } else {
                dispatch({
                    type: 'login_error',
                    payload: data.error || "Credenciales incorrectas"
                });
            }
        } catch (error) {
            console.error('Error en login:', error);
            dispatch({
                type: 'login_error',
                payload: 'Error de conexión. Intenta nuevamente.'
            });
        }
    };

    return (
        <>
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="row w-100 justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="card-title h3 mb-3">Iniciar sesión</h2>
                                    <p className="text-muted">
                                        ¿No tienes cuenta?{' '}
                                        <Link to="/signup" className="text-decoration-none">
                                            Regístrate aquí
                                        </Link>
                                    </p>
                                </div>

                                {store.authError && (
                                    <div className="alert alert-danger" role="alert">
                                        {store.authError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input 
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="tu@email.com"
                                            required    
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Tu contraseña"
                                            required    
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={store.isLoading}
                                        >
                                            {store.isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Iniciando sesión...
                                                </>
                                            ) : (
                                                'Iniciar sesión'
                                            )}

                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};