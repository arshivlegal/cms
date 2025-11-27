import Image from "next/image";

const AnimatedGavelIcon = ({ isOpen }) => {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center z-50">
      {/* Top / Left gavel */}
      <Image
        src="/Images/gavel.svg"
        alt="Gavel Icon"
        width={32}
        height={32}
        className={`absolute w-6 h-6 transform transition-transform duration-500 ease-in-out
          ${isOpen ? "rotate-[135deg] translate-y-0" : "-translate-y-[6px] rotate-0"}
        `}
      />

      {/* Bottom / Right gavel */}
      <Image
        src="/Images/gavel.svg"
        alt="Gavel Icon"
        width={32}
        height={32}
        className={`absolute w-6 h-6 transform transition-transform duration-500 ease-in-out
          ${isOpen ? "-rotate-[135deg] translate-y-0 scale-x-[-1]" : "translate-y-[6px] rotate-0 scale-x-[-1]"}
        `}
      />
    </div>
  );
};

export default AnimatedGavelIcon;
