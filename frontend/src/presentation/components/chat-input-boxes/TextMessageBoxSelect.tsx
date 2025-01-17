import { useState } from "react";

interface Option {
  id: string;
  text: string;
}

interface Props {
  onSendMessage: (message: string, selectedOption: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  options: Option[];
}

export const TextMessageBoxSelect = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
  options,
}: Props) => {
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "" || selectedOption.trim() === "") return;
    onSendMessage(message, selectedOption);
    setMessage("");
    setSelectedOption("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center justify-between h-16 rounded-xl w-full p-2  bg-white bg-opacity-10"
    >
      <div className="flex-grow">
        <div className="flex">
          <input
            type="text"
            autoFocus
            name="message"
            className="w-full rounded-xl text-gray-200 border-0 pl-4 h-10 bg-transparent focus:outline-none"
            placeholder={placeholder || "Escribe un mensaje..."}
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? false : true}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <select
            name="select"
            className="w-2/6 mx-3 rounded-lg px-4 text-gray-200 bg-white bg-opacity-10 border-0 text-sm"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" className="text-gray-600">
              Seleccione
            </option>
            {options.map((option) => (
              <option
                key={option.id}
                value={option.id}
                className="text-gray-600"
              >
                {option.text}
              </option>
            ))}
          </select>
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
