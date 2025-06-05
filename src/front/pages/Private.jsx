import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Private = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const handleLogout = () => {
        dispatch({ type: 'logout'});
        alert('Sesión cerrada correctamente');
        navigate('/login');
    };

    useEffect(() => {
        const validateToken = async () => {
            if (!store.token) {
                navigate('/login');
                return;
            }
            
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${store.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    console.log('Token invalido');
                    dispatch({ type: 'logout'});
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error al verificar el token:', error);
                setError('Error de conexión');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [store.token, navigate, dispatch]);

    if (isLoading) {
        return (
            <>
                <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Verificando autenticación...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/login')}
                        >
                            Volver al login
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-vh-100 bg-light">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                    <div className="container">
                        <span className="navbar-brand h1 mb-0">Área Privada</span>
                        <button 
                            className="btn btn-outline-light"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>

                <div className="container py-5">
                    <div className="alert alert-success" role="alert">
                        <div className="d-flex align-items-center">
                            <div>
                                <h5 className="alert-heading mb-1">¡Autenticación exitosa!</h5>
                                <p className="mb-0">Has accedido correctamente a la zona privada.</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            <div className="card shadow-sm">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Información del Usuario</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label text-muted">Nombre Completo</label>
                                            <p className="mb-0">
                                                {store.user?.first_name && store.user?.last_name 
                                                ? `${store.user.first_name} ${store.user.last_name}`
                                                : store.user?.first_name || 'No especificado'}
                                            </p>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label text-muted">Email</label>
                                            <p className="mb-0">{store.user?.email}</p>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label text-muted">ID usuario</label>
                                            <p className="mb-0">#{store.user?.id}</p>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <label className="form-label text-muted">Estado</label>
                                            <p className="mb-0">
                                                <span className={`badge ${
                                                    store.user?.is_active
                                                    ? 'bg-success'
                                                    : 'bg-danger'
                                                }`}>
                                                    {store.user?.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Panel de Usuario</h5>
                                </div>
                                <div className="card-body text-center">
                                    <p className="text-muted mb-3">
                                        Bienvenido a tu área privada
                                    </p>
                                    <p className="small text-muted">
                                        Tu sesión está activa y segura.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};