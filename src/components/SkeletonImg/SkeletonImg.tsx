import { useState } from "react";

interface Props {
  src: string | undefined;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonImg = ({ src, alt = "", className = "", style }: Props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export default SkeletonImg;
