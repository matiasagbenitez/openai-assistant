import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { translateUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const data = await translateUseCase(text, selectedOption);
    if (data.error) {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo realizar la traducción", isGpt: true },
      ]);
    } else {
      setMessages((prev) => [...prev, { text: data.message, isGpt: true }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}
          <GptMessage text="¡Hola! Soy tu asistente de traducción. Puedo ayudarte a traducir un texto a diferentes idiomas. ¿Qué texto deseas traducir?" />
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas traducir"
        options={languages}
        disableCorrections
      />
    </div>
  );
};
