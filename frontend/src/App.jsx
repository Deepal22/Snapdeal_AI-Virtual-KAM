import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Square,
  Send,
  TrendingDown,
  Package,
  ShoppingBag,
  Activity,
  Bot,
} from "lucide-react";
import "./App.css";

const API_URL = "http://127.0.0.1:8001";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I'm your Snapdeal Virtual KAM. How can I help improve your business today?",
      isWelcome: true,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const recognitionRef = useRef(null);

  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  const voiceSupported = Boolean(SpeechRecognition);

  // Fetch seller metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/seller/metrics`);

        if (!response.ok) {
          throw new Error("Unable to fetch seller metrics");
        }

        const data = await response.json();
        setMetrics(data);
        setMetricsError("");
      } catch (error) {
        console.error("Metrics error:", error);
        setMetricsError("Unable to load business metrics.");
      }
    };

    fetchMetrics();

    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Speak Gemini response
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Speech output is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Send message to backend
  const sendMessage = async (textOverride) => {
    const textToSend = (textOverride ?? message).trim();

    if (!textToSend || loading) return;

    setVoiceError("");

    const history = messages
      .filter((item) => !item.isWelcome)
      .map(({ role, text }) => ({ role, text }));

    setMessages((previous) => [
      ...previous,
      { role: "user", text: textToSend },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend chat error:", data);
        throw new Error(
          data.detail || `Chat request failed: ${response.status}`
        );
      }

      if (!data.reply) {
        throw new Error("The AI returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "model", text: data.reply },
      ]);

      speakText(data.reply);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "model",
          text: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Start microphone
  const startListening = () => {
    if (!SpeechRecognition) {
      setVoiceError("Please use Google Chrome for voice input.");
      return;
    }

    if (loading) return;

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setVoiceError("");

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Microphone error:", event.error);

      if (event.error === "not-allowed") {
        setVoiceError("Please allow microphone access in your browser.");
      } else if (event.error === "no-speech") {
        setVoiceError("I couldn't hear anything. Please try again.");
      } else {
        setVoiceError(`Voice input error: ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Could not start microphone:", error);
      setIsListening(false);
      setVoiceError("Could not start the microphone. Please try again.");
    }
  };

  // Stop microphone
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Stop AI speech
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  // Correct API response paths
  const currentMetrics = metrics?.seller_data?.this_month;
  const previousMetrics = metrics?.seller_data?.last_month;
  const insights = metrics?.insights;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Snapdeal</h2>
        <p className="sidebar-subtitle">AI Virtual KAM</p>

        <div className="sidebar-menu">
          <div className="sidebar-item active">
            <Activity size={18} />
            Dashboard
          </div>

          <div className="sidebar-item">
            <ShoppingBag size={18} />
            My Business
          </div>

          <div className="sidebar-item">
            <Bot size={18} />
            AI Assistant
          </div>
        </div>

        <div className="sidebar-footer">
          <span className="online-dot" />
          Seller account online
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>AI Virtual KAM</h2>
            <p>Your personal business advisor</p>
          </div>

          <span className="online-status">
            <span className="online-dot" />
            Online
          </span>
        </header>

        {/* Welcome banner */}
        <section className="welcome-banner">
          <div>
            <h2>Welcome, Seller!</h2>
            <p>
              Get insights into your business and discover ways to improve
              your sales with your AI-powered advisor.
            </p>
          </div>

          <Bot size={48} />
        </section>

        {/* Business metrics */}
        <section className="metrics-section">
          <h3>Business Overview</h3>

          {metricsError && (
            <p className="voice-status">{metricsError}</p>
          )}

          <div className="metrics-grid">
            {/* Monthly Sales */}
            <div className="metric-card">
              <div className="metric-heading">
                <ShoppingBag size={20} />
                <span>Monthly Sales</span>
              </div>

              <h2>
                {currentMetrics
                  ? `₹${Number(currentMetrics.sales).toLocaleString("en-IN")}`
                  : "Loading..."}
              </h2>

              {insights && (
                <p className="negative">
                  <TrendingDown size={15} />
                  {insights.sales_decline_percentage}% vs last month
                </p>
              )}
            </div>

            {/* Total Orders */}
            <div className="metric-card">
              <div className="metric-heading">
                <Package size={20} />
                <span>Total Orders</span>
              </div>

              <h2>
                {currentMetrics
                  ? currentMetrics.orders
                  : "Loading..."}
              </h2>

              <p className="metric-description">
                {previousMetrics
                  ? `Previous month: ${previousMetrics.orders}`
                  : ""}
              </p>
            </div>

            {/* Cancellation Rate */}
            <div className="metric-card">
              <div className="metric-heading">
                <Activity size={20} />
                <span>Cancellation Rate</span>
              </div>

              <h2>
                {currentMetrics
                  ? `${currentMetrics.cancellation_rate}%`
                  : "Loading..."}
              </h2>

              <p className="metric-description">
                {previousMetrics
                  ? `Previous month: ${previousMetrics.cancellation_rate}%`
                  : ""}
              </p>
            </div>

            {/* Out of Stock */}
            <div className="metric-card">
              <div className="metric-heading">
                <Package size={20} />
                <span>Out of Stock</span>
              </div>

              <h2>
                {currentMetrics
                  ? currentMetrics.out_of_stock_products
                  : "Loading..."}
              </h2>

              <p className="metric-description">
                {previousMetrics
                  ? `Previous month: ${previousMetrics.out_of_stock_products}`
                  : ""}
              </p>
            </div>
          </div>
        </section>

        {/* Chat interface */}
        <section className="chat-panel">
          <div className="chat-header">
            <div className="chat-avatar">
              <Bot size={22} />
            </div>

            <div>
              <h3>Snapdeal Virtual KAM</h3>
              <p>
                <span className="online-dot" />
                AI Business Assistant
              </p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`message-row ${
                  item.role === "user" ? "user-row" : "ai-row"
                }`}
              >
                <div
                  className={`message-bubble ${
                    item.role === "user" ? "user-message" : "ai-message"
                  }`}
                >
                  {item.text}
                </div>

                {item.role === "model" && !item.isWelcome && (
                  <button
                    className="message-speak-button"
                    type="button"
                    title="Speak this response"
                    onClick={() => speakText(item.text)}
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-row ai-row">
                <div className="message-bubble ai-message">
                  Thinking...
                </div>
              </div>
            )}

            <div aria-live="polite" className="voice-status">
              {isListening && "Listening... Speak now."}
              {isSpeaking && "AI is speaking..."}
              {voiceError && voiceError}
            </div>
          </div>

          {/* Input */}
          <form className="chat-input" onSubmit={handleSubmit}>
            <button
              type="button"
              className={`mic-button ${isListening ? "listening" : ""}`}
              onClick={isListening ? stopListening : startListening}
              disabled={!voiceSupported || loading}
              title={
                !voiceSupported
                  ? "Speech recognition unavailable"
                  : isListening
                  ? "Stop listening"
                  : "Speak to your AI assistant"
              }
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                isListening
                  ? "Listening to your voice..."
                  : "Type your business question..."
              }
              disabled={loading}
            />

            <button
              type="submit"
              className="send-button"
              disabled={loading || !message.trim()}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="chat-controls">
            {!voiceSupported && (
              <span>Voice input requires Google Chrome.</span>
            )}

            {isSpeaking && (
              <button
                type="button"
                className="stop-speaking-button"
                onClick={stopSpeaking}
              >
                <Square size={13} />
                Stop speaking
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


