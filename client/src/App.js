import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import bot from './assets/bot.svg';
import user from './assets/user.svg';
import send from './assets/send.svg';
import './App.css';

const OPENAI_API_KEY = '';

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const promptInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatMessages]);

  function loader(elementRef) {
    const element = elementRef.current;
    if (!element) return;

    element.textContent = '';

    const interval = setInterval(() => {
      setChatMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        const loadingDots = lastMessage.value + '.';
        const updatedMessage = { ...lastMessage, value: loadingDots };
        return [...prevMessages.slice(0, -1), updatedMessage];
      });
    }, 300);

    return () => clearInterval(interval);
  }

  function typeText(element, text) {
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setChatMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const updatedMessage = { ...lastMessage, value: lastMessage.value + text.charAt(index) };
          return [...prevMessages.slice(0, -1), updatedMessage];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = promptInputRef.current.value;
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { isAi: false, value: prompt },
      { isAi: true, value: ' ' },
    ]);

    promptInputRef.current.value = '';

    const lastMessageIndex = chatMessages.length;
    const messageDiv = document.getElementById(`message-${lastMessageIndex}`);
    if (messageDiv) loader(messageDiv);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.6,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const completion = response.data.choices[0].text.trim();
      console.log(completion);
      setChatMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { isAi: true, value: completion },
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id="app">
      <div id="chat_container" ref={chatContainerRef}>
        {chatMessages.map((message, index) => (
          <div className={`wrapper ${message.isAi ? 'ai' : ''}`} key={index}>
            <div className="chat">
              <div className="profile">
                <img src={message.isAi ? bot : user} alt={message.isAi ? 'bot' : 'user'} />
              </div>
              <div className="message" id={`message-${index}`}>
                {message.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Ask codex..."
          ref={promptInputRef}
        ></textarea>
        <button type="submit">
          <img src={send} alt="send" />
        </button>
      </form>
    </div>
  );
}

export default App;