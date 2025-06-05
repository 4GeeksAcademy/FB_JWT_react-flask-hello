"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# =====================================================================
# RUTAS AUTENTICACIÓN
# =====================================================================

@api.route('/signup', methods=['POST'])
def signup():
    try:
        body = request.get_json()

        if not body or not body.get("email") or not body.get("password"):
            return jsonify({"error": "Email y password son obligatorios"}), 400
        
        existing_user = User.query.filter_by(email=body["email"]).first()
        if existing_user:
            return jsonify({"error": "El usuario ya existe"}), 400
        
        new_user = User(
            email=body["email"],
            password=body["password"],
            first_name=body.get("first_name"),
            last_name=body.get("last_name")
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Usuario creado con éxito",
            "user": new_user.serialize()
        }), 201
    except Exception as e:

        db.session.rollback()
        return jsonify({"error": f"Error creando usuario: {str(e)}"}), 500
    
@api.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json()

        if not body or not body.get("email") or not body.get("password"):
            return jsonify({"error": "Email y password obligatorios"}), 400
        
        user = User.query.filter_by(email=body["email"]).first()

        if not user or not user.check_password(body["password"]):
            return jsonify({"error": "Credenciales incorrectas"}), 401
        
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "access_token": access_token,
            "user": user.serialize(),
            "message": "Login exitoso"
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error durante el login: {str(e)}"}), 500
    
# =====================================================================
# RUTAS PROTEGIDAS
# =====================================================================

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    try:
        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify({
            "message": "Estás en tu ruta privada",
            "user": user.serialize(),
            "logged_in_as": user.get_full_name(),
            "access_granted": True
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error al intentar acceder a la ruta privada: {str(e)}"}), 500
    
@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({
                "valid": False,
                "message": "Usuario no encontrado"
            }), 404
        
        return jsonify({
            "valid": True,
            "user": user.serialize(),
            "message": "Token válido"
        }), 200
    
    except Exception as e:
        return jsonify({
            "valid": False,
            "message": f"Token inválido: {str(e)}"
        }), 401
    
# =====================================================================
# RUTA INFORMACIÓN USUARIO ACTUAL
# =====================================================================

@api.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify({
            "user": user.serialize(),
            "full_name": user.get_full_name()
        }), 200
    
    except Exception as e:
        return jsonify({"error": f"Error al intentar obtener el usuario: {str(e)}"}), 500
    
# ======================================================================
# RUTA LOGOUT
# ======================================================================

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        return jsonify({
            "message": "Logout exitoso",
            "user_email": user.email if user else "unknown"
        }), 200
    
    except Exception as e:
        return jsonify({
            "error": f"Error durante el logout: {str(e)}"
        }), 500
