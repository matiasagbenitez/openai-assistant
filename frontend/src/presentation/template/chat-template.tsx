import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../presentation/components";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (message: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);

    // TODO: use-case

    setLoading(false);

    // TODO: añadir el mensaje de isGpt: true
  };

  return (
    <div className="chat-container">
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
