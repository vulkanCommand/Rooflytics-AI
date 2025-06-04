# BuildCRM: AI-Powered CRM Analytics Platform

## Overview

BuildCRM is a modern AI-integrated CRM analytics platform designed to empower small and medium businesses—especially in the Home Improvement and Light Commercial Building Materials sectors—with intelligent sales insights and decision-making capabilities. It eliminates the need for expensive data analysts by allowing users to ask natural-language questions and get insights directly from the database, powered by OpenAI’s GPT-based NLP.

## Key Features

- AI-Powered Query Conversion: Translates natural-language sales questions into SQL queries using OpenAI's GPT model.
- Automated Analytics Layer: Executes SQL queries on a PostgreSQL RDS backend and returns structured results.
- Conversational Output Generator: Converts query results into human-readable, business-friendly responses using AI.
- Modular Microservices: Built using independently deployable microservices communicating via REST APIs.
- Fully Cloud-Native Deployment: Uses AWS services such as S3 (for frontend), RDS (for database), App Runner (for containerized microservices), and ECR (for Docker image management).

## Target Users

This platform is tailored for:
- Dealers and business owners in construction-related fields
- SMEs who cannot afford dedicated data analytics teams
- Stakeholders who prefer insights in plain English rather than raw dashboards

## Architecture

Frontend (S3) <--> API Gateway <--> Microservices (Analyze | Interpret | Execute | Respond)

## Technologies Used

- Frontend: HTML, CSS, JavaScript (Hosted on AWS S3)
- Backend Services: Python (FastAPI), Dockerized and deployed via AWS App Runner
- Database: PostgreSQL on AWS RDS
- AI Integration: OpenAI GPT API
- CI/CD & Deployment: GitHub, AWS ECR, App Runner, IAM

## Folder Structure

buildcrm/
│
├── frontend/               # Static files hosted in S3
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── microservices/
│   ├── analyze-service/
│   ├── interpret-service/
│   ├── execute-service/
│   └── respond-service/
│
├── Dockerfiles/            # Docker configuration for each service
├── .env                    # API keys and secrets (not committed)
├── README.md               # Project documentation
└── requirements.txt        # Python dependencies

## Installation (Local Setup)

1. Clone the repository:
   git clone https://github.com/yourusername/buildcrm.git
   cd buildcrm

2. Create a Python virtual environment:
   python -m venv venv
   source venv/bin/activate      # Linux/Mac
   venv\Scripts\activate         # Windows

3. Install dependencies:
   pip install -r requirements.txt

4. Set up `.env` file:
   OPENAI_API_KEY=your_key
   DB_HOST=your_rds_endpoint
   DB_NAME=sales_db
   DB_USER=admin
   DB_PASS=your_password

5. Run service (example: Analyze):
   cd microservices/analyze-service
   uvicorn app:app --reload

## Deployment (On AWS)

- Push Docker containers to AWS ECR
- Deploy each service to AWS App Runner
- Host frontend in S3 and connect via CloudFront
- Configure IAM roles and CORS policies

## Sample User Questions

- What is the most sold product in the last quarter?
- Which region had the lowest revenue this month?
- What is the total sale of roofing materials in Florida?
- Which dealer has placed the maximum number of orders?

## Contribution Guidelines

We welcome enhancements and bug fixes. Please follow PEP8 standards and maintain clear code comments.

Steps:
1. Fork the repository
2. Create a feature branch
3. Commit changes with meaningful messages
4. Raise a pull request to the main branch

## License

This project is licensed under the MIT License.

## Contact

Durga Kalyan Gandiboyina  
Email: gdkal@example.com  
Location: Florida, United States  
LinkedIn: https://www.linkedin.com/in/durgakalyang/

---

Being first reaches more people than being the best. This solution empowers businesses to make smarter decisions without technical expertise.
