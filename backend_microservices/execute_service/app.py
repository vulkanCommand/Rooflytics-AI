from fastapi import FastAPI, Request
from pydantic import BaseModel
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Load credentials from env
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

class SQLRequest(BaseModel):
    query: str

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

@app.post("/execute")
def execute_query(req: SQLRequest):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(req.query)
        
        if cursor.description:  # SELECT query
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            result = [dict(zip(columns, row)) for row in rows]
        else:  # INSERT, UPDATE, DELETE
            conn.commit()
            result = []  # ✅ return an empty list

        cursor.close()
        conn.close()
        return {"result": result}
    
    except Exception as e:
        return {"error": str(e)}
