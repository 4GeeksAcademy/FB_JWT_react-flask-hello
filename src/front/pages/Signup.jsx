import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [errors, setErrors] = useState({});
    const [ redirect, setRedirect ] = useState(false);

    const navigate = useNavigate();
    const {store, dispatch} = useGlobalReducer();

    useEffect(() => {
        if (redirect && !store.isLoading && !store.authError) {
            navigate('/login');
            setRedirect(false)
        }
    }, [store.isLoading, store.authError, redirect, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
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
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido';
        }

        if (!formData.password || !formData.password.trim()) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({type: 'clear_auth_error'});
                alert('¡Usuario creado exitosamente! Redirigiendo al login...')
                setRedirect(true);
            } else {
                dispatch({
                    type: 'login_error',
                    payload: data.error || "Error al crear el usuario"
                });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            dispatch({
                type: 'login_error',
                payload: "Error de conexión. Intenta nuevamente."
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
                                    <h2 className="card-title h3 mb-3">Crear cuenta nueva</h2>
                                    <p className="text-muted">
                                        ¿Ya tienes cuenta? {' '}
                                        <Link to='/login' className='text-decoration-none'>
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
                                </div>

                                {store.authError &&(
                                    <div className="alert alert-danger" role="alert">
                                        {store.authError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email <span className="text-danger">*</span>
                                        </label>
                                        <input 
                                            type="email" 
                                            className={`form-control ${errors.email ? 'is-invalid' : '' }`}
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
                                            Contraseña <span className="text-danger">*</span>
                                        </label>
                                        <input 
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Mínimo 6 caracteres"
                                            minLength={6}
                                            required    
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">
                                            Nombre
                                        </label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="first_name"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Tu nombre"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">
                                            Apellido
                                        </label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            id="last_name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Tu apellido"
                                        />
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
                                                    Creando cuenta...
                                                </>
                                            ) : (
                                                'Crear cuenta'
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
    );
};