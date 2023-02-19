import Image from "next/image";
import { useRef } from "react";

export const Loading = () => {
  const ref = useRef<number>(Math.floor(Math.random() * 900));

  return (
    <div className="loading">
      <div className="loading-inner">
        <Image
          src={`/images/${ref.current})}.png`}
          alt="Bulbasaur"
          height={96}
          width={96}
        />
      </div>
    </div>
  );
};
