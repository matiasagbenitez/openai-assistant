import { useState } from "react";
import {
  GptMessage,
  GptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../../presentation/components";
import { orthographyUseCase } from "../../../core/use-cases";
import { OrthographyResponse } from "../../../interfaces";

interface Message {
  text: string;
  isGpt: boolean;
  info?: OrthographyResponse;
}

export const OrthographyPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (prompt: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: prompt, isGpt: false }]);
    const data = await orthographyUseCase(prompt);
    if (data.error) {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la corrección", isGpt: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: data.message, isGpt: true, info: data },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="¡Hola! Soy tu asistente de ortografía. Puedo ayudarte a corregir tus textos. ¿Qué deseas corregir hoy?" />

          {messages.map((message, index) => {
            if (message.isGpt) {
              return <GptOrthographyMessage key={index} data={message.info!} />;
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
