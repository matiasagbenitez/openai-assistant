interface Props {
  url: string;
  alt: string;
  onImageSelected?: (imageUrl: string) => void;
}

export const GptImageMessage = ({ url, alt, onImageSelected }: Props) => {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-black bg-opacity-25 p-4 shadow rounded-xl">
          <img
            src={url}
            alt={alt}
            className="rounded-xl w-96 h-96 object-cover"
            onClick={() => onImageSelected && onImageSelected(url)}
          />
        </div>
      </div>
    </div>
  );
};
