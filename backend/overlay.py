from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import overlays_collection

bp = Blueprint('overlay', __name__)

def serialize(overlay):
    overlay["_id"] = str(overlay["_id"])
    return overlay

@bp.route('/api/overlays', methods=['GET'])
def get_overlays():
    overlays = list(overlays_collection.find())
    return jsonify([serialize(o) for o in overlays])

@bp.route('/api/overlays', methods=['POST'])
def create_overlay():
    data = request.json
    result = overlays_collection.insert_one(data)
    return jsonify({"id": str(result.inserted_id)}), 201

@bp.route('/api/overlays/<id>', methods=['GET'])
def get_overlay(id):
    overlay = overlays_collection.find_one({"_id": ObjectId(id)})
    return jsonify(serialize(overlay)) if overlay else ("Not found", 404)

@bp.route('/api/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    data = request.json
    overlays_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"status": "updated"})

@bp.route('/api/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    overlays_collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"status": "deleted"})
