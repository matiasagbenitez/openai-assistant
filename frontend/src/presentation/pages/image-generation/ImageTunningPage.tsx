import { Fragment, useState } from "react";
import {
  GptImageMessage,
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    url: string;
    alt: string;
  };
}

interface OriginalImageAndMask {
  original: string | undefined;
  mask: string | undefined;
}

export const ImageTunningPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [originalImageAndMask, setOriginalImageAndMask] =
    useState<OriginalImageAndMask>({
      original: undefined,
      mask: undefined,
    });

  const handleVariation = async () => {
    setLoading(true);
    if (!originalImageAndMask.original) return;
    const resp = await imageVariationUseCase(originalImageAndMask.original);
    setLoading(false);
    if (!resp) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la variación", isGpt: true },
      ]);
    }
    const { url, alt } = resp;
    setMessages((prev) => [
      ...prev,
      {
        text: "Aquí tienes la variación de la imagen",
        isGpt: true,
        info: { url, alt },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);
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
    <Fragment>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <div className="relative">
            <img
              src={originalImageAndMask.original}
              alt="Original"
              className="w-40 h-40 object-contain rounded-xl"
            />
            <button
              className="absolute top-2 right-2 bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() =>
                setOriginalImageAndMask(() => ({
                  original: undefined,
                  mask: undefined,
                }))
              }
            >
              x
            </button>
          </div>
          <button
            className="btn btn-primary mt-2 text-sm"
            onClick={handleVariation}
          >
            Generar variación
          </button>
        </div>
      )}

      <div className="chat-container">
        <div className="chat-messages custom-scrollbar">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenida */}

            <GptMessage text="¡Hola! Soy tu asistente de generación y variación de imágenes. Puedo ayudarte a generar una imagen a partir de un texto. ¿Qué imagen deseas generar?" />

            {messages.map(({ isGpt, text, info }, index) => {
              if (isGpt && info) {
                return (
                  <GptImageMessage
                    key={index}
                    url={info.url}
                    alt={info.alt}
                    onImageSelected={(imageUrl) =>
                      setOriginalImageAndMask(() => ({
                        original: imageUrl,
                        mask: undefined,
                      }))
                    }
                  />
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
    </Fragment>
  );
};
