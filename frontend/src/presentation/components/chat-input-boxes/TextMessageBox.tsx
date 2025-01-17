import { useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
}

export const TextMessageBox = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
}: Props) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center justify-between h-16 rounded-xl w-full p-2  bg-white bg-opacity-10"
    >
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            autoFocus
            name="message"
            className=" flex w-full rounded-xl text-gray-200 border-0 pl-4 h-10 bg-transparent focus:outline-none"
            placeholder={placeholder || "Escribe un mensaje..."}
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? false : true}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        title="Enviar"
        className="mx-3 hover:bg-white hover:bg-opacity-20 rounded-lg py-2 px-3"
      >
        <i className="fas fa-paper-plane"></i>
      </button>
    </form>
  );
};
