# DeepSeek Alignment System

A powerful truth-seeking system that combines web interface with advanced Python NLP processing.

## Features

- Advanced NLP processing using spaCy and Transformers
- Emotion and sentiment analysis
- Archetype detection with enhanced accuracy
- Chamber system with progression tracking
- Real-time biofeedback integration

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_lg
python -m nltk.downloader vader_lexicon
```

2. Start the Python backend:
```bash
python deepseek_backend.py
```

3. Serve the frontend:
```bash
# Using Python's built-in server
python -m http.server 8000
```

4. Access the application:
- Frontend: http://localhost:8000
- Backend API: http://localhost:5000

## API Endpoints

### POST /process_truth
Process a new truth submission.

Request body:
```json
{
    "text": "Your truth here"
}
```

Response:
```json
{
    "status": "success",
    "message": "Truth processed successfully",
    "data": {
        "archetype": "W7EAAT",
        "eas_score": 50,
        "chamber_state": {
            "current_chamber": null,
            "progress": 0,
            "unlocked_chambers": ["watchlist"],
            "interrogation_level": 0,
            "resistance_count": 0
        }
    }
}
```

### GET /get_state
Get current system state.

Response:
```json
{
    "eas_score": 50,
    "archetype": "W7EAAT",
    "chamber_state": {
        "current_chamber": null,
        "progress": 0,
        "unlocked_chambers": ["watchlist"],
        "interrogation_level": 0,
        "resistance_count": 0
    },
    "daily_count": 3
}
```

## Architecture

The system consists of:

1. Frontend (HTML/JavaScript):
   - User interface
   - Form handling
   - Real-time updates

2. Backend (Python/Flask):
   - NLP processing
   - Archetype detection
   - State management
   - Chamber system

## Development

To modify the system:

1. Update archetype patterns in `deepseek_backend.py`
2. Modify validation rules in `DeepSeekProcessor` class
3. Adjust chamber progression thresholds
4. Update frontend UI in `index.html`

## License

MIT License 