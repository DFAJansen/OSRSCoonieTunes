import Image from "next/image";

type LogoSize = "small" | "medium" | "large";

const LOGO_SIZES: Record<LogoSize, { width: number; height: number }> = {
  small: { width: 148, height: 118 },
  medium: { width: 240, height: 192 },
  large: { width: 420, height: 336 }
};

export function CoonieTunesLogo({
  size = "medium",
  showText = false,
  className = ""
}: {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}) {
  const dimensions = LOGO_SIZES[size];

  return (
    <span className={`coonieLogo coonieLogo-${size} ${className}`.trim()}>
      <Image
        alt="OSRS CoonieTunes logo"
        height={dimensions.height}
        priority={size !== "small"}
        src="/logo.png"
        width={dimensions.width}
      />
      {showText ? <span className="srOnly">OSRS CoonieTunes</span> : null}
    </span>
  );
}
