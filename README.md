# Snapdeal AI Virtual KAM 🎙️

**An AI-powered voice assistant that helps Snapdeal sellers understand declining sales, identify business issues, and receive actionable recommendations.**

## Overview

Snapdeal AI Virtual KAM is a browser-based, voice-first AI assistant designed to act as a virtual Key Account Manager for online sellers.

Sellers can explain their business concerns through voice. The assistant analyses mock business metrics, asks relevant follow-up questions, identifies potential problems, and recommends practical actions to improve business performance.

## Key Features

- **Voice-first interaction:** Speak naturally with the AI assistant using the browser microphone.
- **Speech Recognition:** Converts spoken input into text using the Web Speech API.
- **AI-powered conversations:** Generates contextual responses using an LLM API.
- **Business analysis:** Analyses sales, orders, cancellation rates, average selling price, and inventory.
- **Contextual follow-up questions:** Investigates possible reasons behind declining sales.
- **Actionable recommendations:** Suggests practical steps based on the seller's responses.
- **Voice responses:** Uses browser text-to-speech to speak AI-generated answers.
- **Conversation summary:** Provides a summary of key issues, recommendations, and next steps.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js, JavaScript |
| Backend | Python, FastAPI |
| AI Integration | LLM API (Groq/Gemini, depending on configuration) |
| Speech-to-Text | Web Speech API |
| Text-to-Speech | Web Speech API |
| UI Icons | Lucide React |
| Data | Mock Seller Dataset |

## Business Scenario

The assistant analyses a seller experiencing a significant decline in monthly sales.

### Mock Seller Data

| Metric | Last Month | This Month |
|---|---:|---:|
| Sales | ₹2,00,000 | ₹1,35,000 |
| Orders | 400 | 270 |
| Cancellation Rate | 8% | 14% |
| Average Selling Price | ₹500 | ₹500 |
| Out-of-Stock Products | 5 | 18 |

### Key Observations

- Sales decreased by 32.5%.
- Orders decreased by 32.5%.
- Cancellation rate increased by 6 percentage points.
- Average selling price remained unchanged.
- Out-of-stock products increased from 5 to 18.

The assistant uses these observations to investigate inventory issues, supplier delays, order cancellations, pricing, and product visibility.

## Application Architecture

```text
                 SELLER
                    |
                    v
             React Frontend
                    |
          Browser Speech Recognition
                    |
                    v
              FastAPI Backend
                    |
          Conversation History
                    |
             System Prompt
                    |
                    v
                LLM API
                    |
          Contextual AI Response
                    |
                    v
             React Frontend
                    |
           Browser Text-to-Speech
                    |
                    v
              SELLER
```

## Project Structure

```text
Snapdeal_AI_Virtual_KAM/
│
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── seller_data.py
│   │   ├── prompts/
│   │   │   └── system_prompt.py
│   │   ├── routes/
│   │   │   └── chat.py
│   │   ├── services/
│   │   │   └── gemini.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js and npm
- An API key for your configured LLM provider
- Google Chrome or another supported browser

### 1. Clone the Repository

```bash
git clone https://github.com/Deepal22/Snapdeal_AI-Virtual-KAM.git

cd Snapdeal-AI-Virtual-KAM
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend

py -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file inside the backend folder and add the API configuration required by your selected LLM provider.

Example for Groq:

```env
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=your_configured_model_name
```

If using Gemini instead, configure the corresponding `GEMINI_API_KEY` and model variables expected by the backend.

Start the backend:

```bash
uvicorn app.main:app --port 8001
```

Backend API:

`http://127.0.0.1:8001`

FastAPI Swagger documentation:

`http://127.0.0.1:8001/docs`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Open the application:

`http://localhost:5173`

Ensure the frontend API URL points to:

`http://127.0.0.1:8001`

### 4. Start Using the Assistant

1. Open the application in your browser.
2. Allow microphone access.
3. Start a voice conversation.
4. Explain your business concern.
5. Answer the assistant's follow-up questions.
6. Receive personalised business recommendations and a summary.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| GET | `/api/seller/metrics` | Retrieve mock seller metrics and insights |
| POST | `/api/chat` | Generate an AI response |
| POST | `/api/chat/stream` | Stream AI-generated responses |

### Example Chat Request

```json
{
  "message": "My sales have dropped. Can you help?",
  "history": []
}
```

## Security and Data

- Uses mock seller data for demonstration.
- Does not connect to actual Snapdeal internal systems.
- API credentials must be stored in environment variables.
- Never commit actual `.env` files or API keys to GitHub.

## Limitations

- Speech recognition and synthesis depend on browser support.
- Microphone access requires user permission.
- Business recommendations are based on mock data and seller-provided information.
- The prototype does not access live seller accounts or real-time marketplace data.

## Future Improvements

- Multilingual voice conversations.
- Integration with real seller analytics.
- Product-level sales and inventory analysis.
- Automated performance monitoring.
- More advanced recommendation and evaluation workflows.




*Built as part of the Mini AI Voice KAM practical assignment.*
