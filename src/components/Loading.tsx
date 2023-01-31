import Image from "next/image";

export const Loading = () => {
  return (
    <div className="loading">
      <div className="loading-inner">
        <Image
          src={`/images/${Math.floor(Math.random() * 900)}.png`}
          alt="Bulbasaur"
          height={96}
          width={96}
        />
      </div>
    </div>
  );
};
