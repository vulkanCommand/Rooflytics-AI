from fastapi import FastAPI
from pydantic import BaseModel
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

class FormatRequest(BaseModel):
    sql_result: list  # expects a list of dicts

@app.post("/format")
def format_result(data: FormatRequest):
    try:
        prompt = f"""
You are an AI analyst. Given the following SQL result in JSON, explain it in simple English suitable for a business user:

SQL Output:
{json.dumps(data.sql_result, indent=2)}

Summary:
"""

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You summarize SQL output for business users in plain English."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=250,
        )

        summary = response.choices[0].message.content.strip()
        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}
