# Imaginator - Script to 3D Pipeline

A creative tool that transforms scripts into 3D visualizations using AI.

## Features

- Script upload and analysis
- AI-powered character generation
- Video scene generation
- 3D model creation and visualization

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create .env file:
```bash
cp .env.template .env
```

5. Add your API keys to the .env file:
- LUMA_API_KEY from [Luma AI](https://docs.lumalabs.ai/)
- TRIPO_API_KEY from [Tripo3D](https://platform.tripo3d.ai/)
- ELEVENLABS_API_KEY (if using voice generation)

6. Start the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload a script file (supports .txt, .pdf, .doc, .docx)
3. Generate character visualizations
4. Create scene videos
5. Generate and view 3D models

## Project Structure

```
project_root/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   └── routes.py
│   │   ├── main.py
│   │   └── config.py
│   └── services/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── App.jsx
    └── public/
```

## API Documentation

### Backend Endpoints

- `POST /api/upload-script` - Upload and process script
- `POST /api/generate-character` - Generate character visualization
- `POST /api/generate-video` - Generate scene video
- `POST /api/generate-3d-model` - Generate 3D model

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
