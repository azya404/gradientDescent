# 🚀 Brainrot Interviewer - Setup Guide

## ✅ Frontend Setup Complete!

The frontend has been fully configured with:
- ✅ Vite proxy to backend (port 3001)
- ✅ Audio recording with MediaRecorder API
- ✅ Full backend integration (FormData upload)
- ✅ Audio playback for roast responses
- ✅ Error handling and loading states
- ✅ Fixed AIAvatar with CSS animations

## 🔧 Running the Application

### Step 1: Start the Backend

```powershell
cd C:\gradientDescent\backend

# First time only - make sure .env is configured with API keys:
# GEMINI_API_KEY=your_key
# ELEVENLABS_API_KEY=your_key
# PORT=3001

npm run dev
```

Backend should be running at: **http://localhost:3001**

### Step 2: Start the Frontend

In a **new terminal**:

```powershell
cd C:\gradientDescent\frontend
npm run dev
```

Frontend should be running at: **http://localhost:5173**

## 🧪 Testing

### Test Backend Only
Visit: http://localhost:3001/test
- This is a standalone HTML test page
- Fully functional reference implementation

### Test Full Application
Visit: http://localhost:5173
1. Type some code in the Monaco editor
2. (Optional) Click "Hold to Record" and explain your code
3. Click "SUBMIT FOR REVIEW"
4. Watch the AI roast your code with audio!

## 🎯 Features Implemented

### Frontend (`/frontend`)
- **CodeEditor**: Monaco editor with syntax highlighting
- **AudioRecorder**: MediaRecorder API with record/stop controls
- **AIAvatar**: Animated visual with state-based transitions
- **App.tsx**: Full integration with backend API

### Backend (`/backend`)
- **Gemini 2.5 Flash**: Multimodal AI (accepts code + audio)
- **ElevenLabs TTS**: Converts roast text to MP3
- **Express Server**: Handles file uploads and streaming

## 📋 API Flow

1. User writes code + records audio explanation
2. Frontend sends `POST /api/roast` with FormData:
   - `language`: "python"
   - `code`: string
   - `audio`: Blob (optional)
3. Backend processes through Gemini → ElevenLabs
4. Backend responds with:
   - Header: `X-Roast-Text` (the roast text)
   - Body: MP3 audio stream
5. Frontend auto-plays the roast audio

## 🎨 UI States

- **idle**: Default state, gray avatar
- **judging**: While typing code, red pulsing
- **loading**: During backend processing, spinning animation
- **glitch_out**: During audio playback, intense red pulse

## 🐛 Troubleshooting

**"Failed to connect to backend"**
- Make sure backend is running on port 3001
- Check backend console for errors
- Verify .env has valid API keys

**"Could not access microphone"**
- Browser needs microphone permissions
- Check browser settings
- Try HTTPS if needed (localhost should work)

**Audio doesn't play**
- Check browser console for errors
- Some browsers block auto-play (click play manually)
- Verify backend returned valid MP3

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx      ✅ Monaco editor
│   │   ├── AIAvatar.tsx        ✅ Animated visual
│   │   └── AudioRecorder.tsx   ✅ Mic recording
│   ├── App.tsx                 ✅ Main integration
│   └── types.ts                ✅ TypeScript types
└── vite.config.ts              ✅ Proxy configured

backend/
├── server.js                   ✅ Express server
├── gemini.js                   ✅ AI integration
├── elevenlabs.js               ✅ TTS integration
└── test.html                   ✅ Test page
```

## 🎉 You're Ready!

The frontend is now **fully functional** and ready to connect to your teammate's backend!

Make sure both servers are running, then visit http://localhost:5173 and start roasting some code!
