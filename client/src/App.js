// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// import bot from './assets/bot.svg';
// import user from './assets/user.svg';
// import send from './assets/send.svg';
// import './App.css';

// const OPENAI_API_KEY = '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';

// function App() {
//   const [chatMessages, setChatMessages] = useState([]);
//   const promptInputRef = useRef(null);
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//   }, [chatMessages]);

//   function loader(elementRef) {
//     const element = elementRef.current;
//     if (!element) return;

//     element.textContent = '';

//     const interval = setInterval(() => {
//       setChatMessages((prevMessages) => {
//         const lastMessage = prevMessages[prevMessages.length - 1];
//         const loadingDots = lastMessage.value + '.';
//         const updatedMessage = { ...lastMessage, value: loadingDots };
//         return [...prevMessages.slice(0, -1), updatedMessage];
//       });
//     }, 300);

//     return () => clearInterval(interval);
//   }

//   function typeText(element, text) {
//     let index = 0;

//     const interval = setInterval(() => {
//       if (index < text.length) {
//         setChatMessages((prevMessages) => {
//           const lastMessage = prevMessages[prevMessages.length - 1];
//           const updatedMessage = { ...lastMessage, value: lastMessage.value + text.charAt(index) };
//           return [...prevMessages.slice(0, -1), updatedMessage];
//         });
//         index++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 20);
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const prompt = promptInputRef.current.value;
//     setChatMessages((prevMessages) => [
//       ...prevMessages,
//       { isAi: false, value: prompt },
//       { isAi: true, value: ' ' },
//     ]);

//     promptInputRef.current.value = '';

//     const lastMessageIndex = chatMessages.length;
//     const messageDiv = document.getElementById(`message-${lastMessageIndex}`);
//     if (messageDiv) loader(messageDiv);

//     try {
//       const response = await axios.post(
//         'https://api.openai.com/v1/engines/text-davinci-003/completions',
//         {
//           prompt: prompt,
//           max_tokens: 500,
//           temperature: 0.6,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//           },
//         }
//       );

//       const completion = response.data.choices[0].text.trim();
//       console.log(completion);
//       setChatMessages((prevMessages) => [
//         ...prevMessages.slice(0, -1),
//         { isAi: true, value: completion },
//       ]);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div id="app">
//       <div id="chat_container" ref={chatContainerRef}>
//         {chatMessages.map((message, index) => (
//           <div className={`wrapper ${message.isAi ? 'ai' : ''}`} key={index}>
//             <div className="chat">
//               <div className="profile">
//                 <img src={message.isAi ? bot : user} alt={message.isAi ? 'bot' : 'user'} />
//               </div>
//               <div className="message" id={`message-${index}`}>
//                 {message.value}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit}>
//         <textarea
//           name="prompt"
//           rows="1"
//           cols="1"
//           placeholder="Ask Virtual TA..."
//           ref={promptInputRef}
//         ></textarea>
//         <button type="submit">
//           <img src={send} alt="send" />
//         </button>
//       </form>
//     </div>
//   );
// }

// export default App;


import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai'; // Import OpenAI classes

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

  async function fetchChatCompletion(prompt) {
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        // {
        //   role: 'user',
        //   content: 'If they provide code, explain what is wrong with it.  Do not provide new or corrected code, just explain in words what\'s wrong with the code provided.Do not solve the problem for the student.',
        // },
        // { role: 'user', content: 'If they ask a question about python, go ahead and answer it generally, but do not provide code as part of your answer.' },
        { role: 'user', content: prompt },
      ],
    });

  return completion.data.choices[0].message.content;
  //   let response = completion.data.choices[0].message.content;
  //   console.log(response);

  // // Remove code snippets from the response
  //   response = response.replace(/`[^`]+`/g, '');

  // return response.trim();
  }

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
    promptInputRef.current.value = '';
  
    const prompt2 = `
  If they provide code, explain what is wrong with it.  Do not provide new or corrected code,
  just explain in words what's wrong with the code provided.  Do not solve the problem
  for the student.
  
  If they ask a question about Python, go ahead and answer it generally, but do not provide code as part of your answer.
  code: \`\`\`${prompt}\`\`\`
  `;
  
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { isAi: false, value: prompt },
      { isAi: true, value: ' ' },
    ]);
  
    const lastMessageIndex = chatMessages.length;
    const messageDiv = document.getElementById(`message-${lastMessageIndex}`);
    if (messageDiv) loader(messageDiv);
  
    try {
      const completion = await fetchChatCompletion(prompt2);
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
          <div className={`wrapper ${message.isAi? 'ai' : ''}`} key={index}>
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
          placeholder="Ask Virtual TA..."
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
