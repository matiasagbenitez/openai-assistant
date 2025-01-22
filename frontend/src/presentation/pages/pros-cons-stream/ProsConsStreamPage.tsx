import { useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";

import { ProsConsDiscusserResponse } from "../../../interfaces";
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  response?: ProsConsDiscusserResponse;
}

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (prompt: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text: prompt, isGpt: false }]);

    // ! CON FUNCIÓN GENERADORA
    const stream = prosConsStreamGeneratorUseCase(
      prompt,
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

  return (
    <div className="chat-container">
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="¡Hola! Soy tu asistente de pros y contras. Puedo ayudarte a analizar los pros y contras de un tema en específico respondiendo como stream. ¿Qué tema deseas analizar hoy?" />
          {messages.map((message, index) => {
            if (message.isGpt) {
              return <GptMessage key={index} text={message.text} />;
            } else {
              return <MyMessage key={index} text={message.text} />;
            }
          })}

          {loading && <TypingLoader />}
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
