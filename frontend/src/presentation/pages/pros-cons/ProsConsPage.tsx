import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";

import { ProsConsDiscusserResponse } from "../../../interfaces";
import { prosConsDiscusserUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  response?: ProsConsDiscusserResponse;
}

export const ProsConsPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (prompt: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: prompt, isGpt: false }]);

    const data = await prosConsDiscusserUseCase(prompt);
    if (data.error) {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la operación", isGpt: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: data.content, isGpt: true, response: data },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="¡Hola! Soy tu asistente de pros y contras. Puedo ayudarte a analizar los pros y contras de un tema en específico. ¿Qué tema deseas analizar hoy?" />
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
