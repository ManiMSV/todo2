from bson import ObjectId
from fastapi import HTTPException, status


def parse_object_id(id_str: str) -> ObjectId:
    if not ObjectId.is_valid(id_str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")
    return ObjectId(id_str)
