import { useMemo, useState } from "react";
import { Chat } from "./components/Chat/Chat";
import styles from "./App.module.css";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import { Sidebar } from "./components/Sidebar/Sidebar";

const CHATS = [
  {
    id: 2,
    title: "Gemini AI vs ChatGPT",
    messages: [
      { role: "user", content: "What is better ChatGPT or Gemini?" },
      {
        role: "assistant",
        content: "Hi! Can you explain for what type of tasks you will use it?",
      },
    ],
  },
  {
    id: 4,
    title: "How to use AI tools in your daily life",
    messages: [
      { role: "user", content: "Hey! How to use AI in my life?" },
      {
        role: "assistant",
        content: "Hi! Would you like to use it for work or for hobbies?",
      },
    ],
  },
];

function App() {
  // const [messages, setMessages] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // const [isStreaming, setIsStreaming] = useState(false);

  // function updateLastMessageContent(content) {
  //   setMessages((prevMessages) =>
  //     prevMessages.map((message, index) =>
  //       index === prevMessages.length - 1
  //         ? { ...message, content: `${message.content}${content}` }
  //         : message
  //     )
  //   );
  // }

  // function addMessage(message) {
  //   setMessages((prevMessages) => [...prevMessages, message]);
  // }
  
  // async function handleContentSend(content) {
  //   addMessage({ content, role: "user" });
  //   setIsLoading(true);
  //   try {
  //     // const result = await chat.sendMessage(content); // uncomment when used gemini and comment below
  //     // const result = await assistant.chat(content, messages);
  //     // const result = assistant.chatStream(content,messages.filter(({ role }) => role !== "system"));
  //     const result = await assistant.chat(content,messages.filter(({ role }) => role !== "system"));
  //     let isFirstChunk = false;

  //     for await (const chunk of result) {
  //       if (!isFirstChunk) {
  //         isFirstChunk = true;
  //         addMessage({ content: "", role: "assistant" });
  //         setIsLoading(false);
  //         setIsStreaming(true);
  //       }

  //       updateLastMessageContent(chunk);
  //     }

  //     setIsStreaming(false);
  //     addMessage({ content: result, role: "assistant" });
  //   } catch (error) {
  //     addMessage({
  //       content:
  //         error?.message ??
  //         "Sorry, I couldn't process your request. Please try again!",
  //       role: "system",
  //     });
  //     setIsLoading(false);
  //     setIsStreaming(false);
  //   }
  // }

  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState(CHATS);
  const [activeChatId, setActiveChatId] = useState(2);
  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function updateChats(messages = []) {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages } : chat
      )
    );
  }

  function handleChatMessagesUpdate(messages) {
    updateChats(messages);
  }


  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onActiveChatIdChange={setActiveChatId}
        />

        <main className={styles.Main}>
          <Chat
            assistant={assistant}
            chatId={activeChatId}
            chatMessages={activeChatMessages}
            onChatMessagesUpdate={handleChatMessagesUpdate}
          />
          <div className={styles.Configuration}>
            <Assistant onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
