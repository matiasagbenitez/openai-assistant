import { useRef, useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  accept?: string;
}

export const TextMessageBoxFile = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
  accept,
}: Props) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center justify-between h-16 rounded-xl w-full p-2  bg-white bg-opacity-10"
      >
        <div>
          <button
            type="button"
            className="ms-2 hover:bg-white hover:bg-opacity-20 rounded-lg py-2 px-3"
            title="Adjuntar archivo"
            onClick={() => fileInput.current?.click()}
          >
            <i className="fas fa-paperclip"></i>
          </button>
          <input
            type="file"
            ref={fileInput}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
        </div>

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
      {selectedFile && (
        <div className="mx-2 mt-2">
          <i className="fas fa-file mr-2"></i>
          <span className="text-gray-200">{selectedFile.name}</span>
          <button
            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-lg py-2 px-3"
            title="Eliminar archivo"
            onClick={() => setSelectedFile(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};
