import { OrthographyResponse } from "../../../interfaces";

interface Props {
  data: OrthographyResponse;
}

export const GptOrthographyMessage = ({ data }: Props) => {
  const { message, errors, userScore } = data;
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          {errors.length > 0 ? (
            <div>
              <p className="text-red-500 font-bold">Errores encontrados:</p>
              <ul className="list-disc list-inside mb-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <p>Obtuviste un puntaje de {userScore} de 100 en la corrección</p>
              <p>{message || "¡Ánimo! Sigue mejorando"}</p>
            </div>
          ) : (
            <p className="mb-0">{message || "No se encontraron errores"}</p>
          )}
        </div>
      </div>
    </div>
  );
};
