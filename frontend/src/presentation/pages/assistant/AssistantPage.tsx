import { useEffect, useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import {
  createThreadUseCase,
  postQuestionUseCase,
  reloadThreadUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia al final del contenedor de mensajes

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Obtener el threadId, si no existe crear uno
  useEffect(() => {
    const threadId = localStorage.getItem("threadId");
    if (threadId) {
      setThreadId(threadId);
      if (messages.length === 0) {
        handleReload(threadId);
      }
    } else {
      handleNewThread();
    }
  }, [messages.length]);

  const handlePost = async (text: string) => {
    if (!threadId) return;
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { text, isGpt: false },
    ]);

    const replies = await postQuestionUseCase(threadId, text);

    setLoading(false);

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prev) => [
          ...prev,
          { text: message, isGpt: reply.role === "assistant", info: reply },
        ]);
      }
    }
  };

  const handleReload = async (id: string) => {
    if (!id) return;
    setLoading(true);
    const replies = await reloadThreadUseCase(id);
    if (!replies) return;
    setLoading(false);
  
    const newMessages = replies.flatMap((reply) =>
      reply.content.map((message) => ({
        text: message,
        isGpt: reply.role === "assistant",
        info: reply,
      }))
    );
  
    handleAddMessages(newMessages);
  };

  const handleNewThread = async () => {
    const id = await createThreadUseCase();
    if (!id) return;
    setThreadId(id);
    localStorage.setItem("threadId", id);
    setMessages([]);
  };

  const handleAddMessages = (newMessages: Message[]) => {
    setMessages((prev) => {
      const existingTexts = new Set(prev.map((msg) => msg.text));
      const uniqueMessages = newMessages.filter(
        (msg) => !existingTexts.has(msg.text)
      );
      return [...prev, ...uniqueMessages];
    });
  };
  

  return (
    <div className="chat-container">
      <div className="mb-4 bg-black bg-opacity-25 rounded-xl p-3 shadow flex justify-between items-center">
        <h4 className="font-bold text-lg">
          Bienvenido al asistente virtual de SAM, ¿en qué puedo ayudarte? 🤖
        </h4>
        <button className="btn btn-primary text-sm" onClick={handleNewThread}>
          <i className="fas fa-plus mr-2"></i>
          Nuevo hilo
        </button>
      </div>
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}

          {messages.map((message, index) => {
            if (message.isGpt) {
              return <GptMessage key={index} text={message.text} />;
            } else {
              return <MyMessage key={index} text={message.text} />;
            }
          })}

          {loading && <TypingLoader />}
        
          <div ref={messagesEndRef} />
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
