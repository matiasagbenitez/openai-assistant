import { useState } from "react";
import {
  GptImageMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { imageGenerationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    url: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (message: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(message);
    setLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la imagen", isGpt: true },
      ]);
    }

    const { url, alt } = imageInfo;
    setMessages((prev) => [
      ...prev,
      {
        text: "Aquí tienes la imagen que pediste",
        isGpt: true,
        info: { url, alt },
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages custom-scrollbar">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida */}

          {messages.map(({ isGpt, text, info }, index) => {
            if (isGpt && info) {
              return (
                <GptImageMessage key={index} url={info.url} alt={info.alt} />
              );
            } else {
              return <MyMessage key={index} text={text} />;
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
