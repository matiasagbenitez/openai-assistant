import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBoxFile,
  TypingLoader,
} from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (prompt: string, audioFile: File) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: prompt || "Archivo de audio enviado", isGpt: false }]);

    const response = await audioToTextUseCase(audioFile, prompt);
    setLoading(false);

    if (!response) return;
    const text = response.text;
    setMessages((prev) => [...prev, { text, isGpt: true }]);

  };

  return (
    <div className="chat-container">
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}

          <GptMessage text="¡Hola! Soy tu asistente de audio a texto. Puedo ayudarte a transcribir un archivo de audio a texto. ¿Qué archivo deseas transcribir?" />

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

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
        accept="audio/*"
      />
    </div>
  );
};
