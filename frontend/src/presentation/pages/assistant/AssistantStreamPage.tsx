import { useEffect, useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import {
  assistantStreamGeneratorUseCase,
  createThreadUseCase,
  reloadThreadUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantStreamPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia al final del contenedor de mensajes

  const [recentThreads, setRecentThreads] = useState<string[]>([]); // Almacena los últimos 5 threadId

  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  useEffect(() => {
    const threadId = localStorage.getItem("threadId");
    const savedThreads = JSON.parse(
      localStorage.getItem("recentThreads") || "[]"
    );
    setRecentThreads(savedThreads);

    if (threadId) {
      setThreadId(threadId);
      handleReload(threadId);
    } else {
      handleNewThread();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePost = async (text: string) => {
    if (!threadId) return;
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const stream = assistantStreamGeneratorUseCase(
      threadId,
      text,
      abortController.current.signal
    );
    setLoading(false);

    setMessages((prev) => [...prev, { text: "", isGpt: true }]);
    for await (const message of stream) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = message;
        return newMessages;
      });
    }

    isRunning.current = true;
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
    saveThreadIdToLocalStorage(id);
    // localStorage.setItem("threadId", id);
    setMessages([]);
  };

  const handleSelectThread = async (id: string) => {
    if (!id) return;
    setThreadId(id);
    saveThreadIdToLocalStorage(id);
    setMessages([]);
    handleReload(id);
  };

  // Guardar el threadId en el localStorage y mantener los últimos 5
  const saveThreadIdToLocalStorage = (id: string) => {
    // Si el threadId ya está en la lista, no hacemos nada
    if (recentThreads.includes(id)) {
      setThreadId(id);
      localStorage.setItem("threadId", id);
      return;
    }

    // Si hay menos de 5 threadId en la lista, lo agregamos
    if (recentThreads.length < 5) {
      const updatedThreads = [id, ...recentThreads];
      setRecentThreads(updatedThreads);
      localStorage.setItem("recentThreads", JSON.stringify(updatedThreads));
    }

    // Guardar siempre el último threadId activo
    localStorage.setItem("threadId", id);
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

  const handleDeleteThread = (id: string) => {
    if (!id) return;
    const updatedThreads = recentThreads.filter((threadId) => threadId !== id);
    setRecentThreads(updatedThreads);
    localStorage.setItem("recentThreads", JSON.stringify(updatedThreads));
    localStorage.removeItem("threadId");
    setThreadId(undefined);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <div className="mb-4 bg-black bg-opacity-25 rounded-xl p-3 shadow flex justify-between items-center">
        <h5 className="font-bold">
          Bienvenido al asistente virtual, ¿en qué puedo ayudarte? 🤖
        </h5>
        <select
          className="bg-white text-black text-sm p-2 rounded-md"
          value={threadId || ""}
          onChange={(e) => handleSelectThread(e.target.value)}
        >
          <option value="" disabled>
            Restaurar hilo
          </option>
          {recentThreads.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <div className="flex gap-x-2">
          <button
            className="btn btn-primary text-sm"
            onClick={handleNewThread}
            title="Nuevo hilo de conversación"
          >
            <i className="fas fa-plus mr-2"></i>
            Nuevo hilo
          </button>
          <button
            title="Eliminar hilo"
            className="btn btn-primary text-sm text-red-300 hover:text-red-500"
            onClick={() => handleDeleteThread(threadId || "")}
          >
            <i className="fas fa-trash  "></i>
          </button>
        </div>
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
