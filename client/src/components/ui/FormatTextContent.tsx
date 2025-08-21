interface Props {
  text: string;
  preWrap?: boolean;
  textSecondary?: boolean;
}

function FormatTextContet({ text, preWrap = false, textSecondary = false }: Props) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const protocolSubdomainRegex = /^https?:\/\/(www\.)?/;

  const textParts = text.split(urlRegex);

  return (
    <div className={`${textSecondary ? 'text-secondary' : 'text-primary'} text-pretty leading-5 mb-2 break-word-legacy ${preWrap && 'whitespace-pre-wrap'}`}>
      {textParts.map((part, index) => {
        if (!urlRegex.test(part)) return <span key={index}>{part}</span>;

        const clearText = part.replace(protocolSubdomainRegex, '');
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-twitterBlue hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {clearText}
          </a>
        );
      })}
    </div>
  );
}

export default FormatTextContet;
