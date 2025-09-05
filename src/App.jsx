import { useEffect, useMemo, useState } from "react";
import { Chat } from "./components/Chat/Chat";
import styles from "./App.module.css";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [assistant, setAssistant] = useState();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState();
  const activeChatMessages = useMemo(
    () => chats.find(({ id }) => id === activeChatId)?.messages ?? [],
    [chats, activeChatId]
  );

  useEffect(() => {
    handleNewChatCreate();
  }, []);

  function handleAssistantChange(newAssistant) {
    setAssistant(newAssistant);
  }

  function handleChatMessagesUpdate(id, messages) {
    const title = messages[0]?.content.split(" ").slice(0, 7).join(" ");

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? { ...chat, title: chat.title ?? title, messages }
          : chat
      )
    );
  }

  function handleNewChatCreate() {
    const id = uuidv4();

    setActiveChatId(id);
    setChats((prevChats) => [...prevChats, { id, messages: [] }]);
  }

  function handleActiveChatIdChange(id) {
    setActiveChatId(id);
    setChats((prevChats) =>
      prevChats.filter(({ messages }) => messages.length > 0)
    );
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
          activeChatMessages={activeChatMessages}
          onActiveChatIdChange={handleActiveChatIdChange}
          onNewChatCreate={handleNewChatCreate}
        />

        <main className={styles.Main}>
          {chats.map((chat) => (
            <Chat
              key={chat.id}
              assistant={assistant}
              isActive={chat.id === activeChatId}
              chatId={chat.id}
              chatMessages={chat.messages}
              onChatMessagesUpdate={handleChatMessagesUpdate}
            />
          ))}
          <div className={styles.Configuration}>
            <Assistant
              onAssistantChange={handleAssistantChange}
              activeChatMessages={activeChatMessages}
            />
            <Theme />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

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
