# Official API Setup

This project now supports a direct official API bridge behind the same local endpoint:

- `http://127.0.0.1:8765/api/ai/status`
- `http://127.0.0.1:8765/api/ai/chat`

## 1. Configure `.env`

Create or update `.env` in the project root:

```bash
AI_API_BASE_URL=https://api.x.ai/v1
AI_API_KEY=your-official-api-key
AI_API_DEFAULT_MODEL=grok-4
AI_MODEL_IDS=grok-4
```

Optional:

```bash
AI_API_CHAT_ENDPOINT=/chat/completions
AI_API_MODELS_ENDPOINT=/models
AI_API_TIMEOUT_MS=120000
```

On Windows you can keep using `.env.bat`, but `.env` is the preferred cross-platform option.

## 2. Start the bridge

On macOS or Linux:

```bash
./start-ai-bridge.sh
```

On Windows:

```bat
start-ai-bridge.bat
```

## 3. What happens now

- The site only uses the direct official API bridge.
- If `AI_API_KEY` is missing, the AI stays unavailable until you save a valid API key.

## 4. Switching models

The site model selector reads the models returned by the official API.  
If the provider does not return a model list, the bridge uses `AI_MODEL_IDS` and `AI_API_DEFAULT_MODEL`.
