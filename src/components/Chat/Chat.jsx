import { useState } from "react";
import { Loader } from "../Loader/Loader";
import { Messages } from "../Messages/Messages";
import { Controls } from "../Controls/Controls";
import styles from "./Chat.module.css";

export function Chat({ assistant }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
  
  async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);
    try {
      // const result = await chat.sendMessage(content); // uncomment when used gemini and comment below
      // const result = await assistant.chat(content, messages);
      // const result = assistant.chatStream(content,messages.filter(({ role }) => role !== "system"));
      const result = await assistant.chatStream(content,messages.filter(({ role }) => role !== "system"));
      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
      // addMessage({ content: result, role: "assistant" });
    } catch (error) {
      addMessage({
        content:
          error?.message ??
          "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }
  // const [finalMessage,setFinalMessage]=useState([WELCOME_MESSAGE_GROUP, ...messagesGroups])

  // useEffect(() => {
  //   setFinalMessage([WELCOME_MESSAGE_GROUP, ...messagesGroups])
  // },messagesGroups)

  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.Chat}>
        <Messages messages={messages} />
      </div>

      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend}
      />
    </>
  );
}
