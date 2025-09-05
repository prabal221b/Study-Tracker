from pymongo import MongoClient, ReturnDocument
from bson import ObjectId
import logging
import json
import os
from typing import List, Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

import certifi
from pymongo import MongoClient




MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)
db = client.get_database("ai-study-app")
roadmaps_collection = db.get_collection("roadmaps")


# -------------------------
# Roadmap operations
# -------------------------
def save_roadmap(username: str, technology_name: str, roadmap: Dict) -> Dict:
    """
    Save a roadmap for a user.
    If a roadmap for the same username+technology exists, update it.
    """
    if not username or not technology_name or not roadmap:
        raise ValueError("username, technology_name and roadmap are required")

    now = datetime.utcnow()

    try:
        for entry in roadmap:
            entry["markDone"] = entry.get("markDone", False)

        result = roadmaps_collection.find_one_and_update(
            {"username": username, "technology_name": technology_name},
            {"$set": {"roadmap": roadmap, "updated_at": now}, "$setOnInsert": {"created_at": now}},
            upsert=True,
            return_document=ReturnDocument.AFTER
        )
       
        result["_id"] = str(result["_id"])
        return result
    except Exception:
        logger.exception("Failed to save roadmap")
        raise


def get_roadmaps_for_user(username: str) -> List[Dict]:
    """
    Return a list of all roadmaps for the given username.
    Each roadmap contains: id, technology_name, updated_at
    """
    try:
        cursor = roadmaps_collection.find({"username": username}).sort("updated_at", -1)
        results = []
        for doc in cursor:
            results.append({
                "id": str(doc["_id"]),
                "technology_name": doc.get("technology_name"),
                "updated_at": doc.get("updated_at")
            })
        return results
    except Exception:
        logger.exception("Failed to fetch roadmaps for user")
        raise


def get_roadmap(roadmap_id: str) -> Optional[Dict]:
    """
    Fetch a single roadmap by MongoDB _id
    """
    if not roadmap_id:
        return None

   
    try:
        obj_id = ObjectId(roadmap_id)
        doc = roadmaps_collection.find_one({"_id": obj_id})
    except Exception:
        logger.warning(f"Invalid ObjectId, trying string _id: {roadmap_id}")
        doc = roadmaps_collection.find_one({"_id": roadmap_id})

    if doc:
        doc["_id"] = str(doc["_id"]) 
    return doc


def delete_roadmap(username: str, roadmap_id: str) -> bool:
    """
    Delete a roadmap by user and roadmap_id
    """
    try:
        obj_id = ObjectId(roadmap_id)
    except Exception:
        logger.error(f"Invalid ObjectId: {roadmap_id}")
        return False

    result = roadmaps_collection.delete_one({"_id": obj_id, "username": username})
    return result.deleted_count > 0


def update_roadmap(roadmap_id: str, update_fields: Dict) -> bool:
    """
    Update fields of a roadmap document in MongoDB
    """
    try:
        obj_id = ObjectId(roadmap_id)
    except Exception:
        logger.error(f"Invalid ObjectId: {roadmap_id}")
        return False

    update_fields["updated_at"] = datetime.utcnow()
    result = roadmaps_collection.update_one({"_id": obj_id}, {"$set": update_fields})
    return result.modified_count > 0


def mark_topic_completed(roadmap_id: str, day: str) -> bool:
    """
    Mark a specific topic/day as completed
    """
    roadmap_doc = get_roadmap(roadmap_id)
    if not roadmap_doc:
        logger.error(f"Roadmap not found: {roadmap_id}")
        return False

    roadmap_data = roadmap_doc.get("roadmap")
    if isinstance(roadmap_data, str):
        try:
            roadmap_data = json.loads(roadmap_data)
        except Exception:
            logger.error(f"Invalid roadmap JSON for {roadmap_id}")
            return False

    # if day in roadmap_data and day in roadmap_data[week]:
    #     roadmap_data[week][day]["completed"] = True
    #     return update_roadmap(roadmap_id, {"roadmap": roadmap_data})

    # logger.error(f"Day not found in roadmap: {week}, {day}")
    # return False

    for entry in roadmap_data:
        if entry.get("day") == str(day):
            entry["markDone"] = True
            return update_roadmap(roadmap_id, {"roadmap": roadmap_data})

    logger.error(f"Day {day} not found in roadmap.")
    return False
