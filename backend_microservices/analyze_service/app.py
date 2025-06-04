from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

#  Define app FIRST
app = FastAPI()

# Load URLs
INTERPRET_URL = os.getenv("INTERPRET_URL")
EXECUTE_URL = os.getenv("EXECUTE_URL")
FORMAT_URL = os.getenv("FORMAT_URL")

class AnalyzeRequest(BaseModel):
    question: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://buildcrm.s3-website-us-east-1.amazonaws.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Now the route comes after app is defined
@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    try:
        # Step 1: Interpret
        interpret_resp = requests.post(INTERPRET_URL, json={"question": request.question})
        interpret_resp.raise_for_status()
        sql_query = interpret_resp.json().get("sql")

        # Step 2: Execute
        execute_resp = requests.post(EXECUTE_URL, json={"query": sql_query})
        execute_resp.raise_for_status()

        execute_json = execute_resp.json()
        print("🟡 Raw /execute response:", execute_json)

        sql_result = execute_json.get("result")
        print("📊 SQL Result Extracted:", sql_result)
        print("📊 SQL Result Type:", type(sql_result))


        # Log for debug
        print("🧠 SQL:", sql_query)
        print("📊 SQL Result:", sql_result)

        if not isinstance(sql_result, list):
            return {
                "sql": sql_query,
                "result": sql_result,
                "summary": "⚠️ Format step skipped: SQL result is not a list."
            }

            


        # Step 3: Format
        format_resp = requests.post(FORMAT_URL, json={"sql_result": sql_result})
        format_resp.raise_for_status()
        summary = format_resp.json().get("summary")

        return {
            "sql": sql_query,
            "result": sql_result,
            "summary": summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
