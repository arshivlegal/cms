"use client";

export default function CardVariant({
  image,
  title,
  description,
  duration,
  variant = "blog",
  id,
  redirectUrl,
}) {
  const isVideo = variant === "video" || variant === "youtube" || variant === "instagram" || variant === "facebook";

  return (
    <div
      className="
        cursor-pointer transition-transform hover:scale-[1.03]
        w-[316px]
        bg-background border-2 border-[#B87333]
        rounded-r16 p-2 flex flex-col gap-2
      "
    >
      {/* IMAGE */}
      <div className={`relative w-full ${isVideo ? "h-[300px]" : "h-[180px]"}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-r8"
        />

        {isVideo && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              </div>
            </div>

            {duration && (
              <span className="
                absolute bottom-2 right-2 
                bg-black/70 text-white
                text-xs px-2 py-1 rounded-md
              ">
                {duration}
              </span>
            )}
          </>
        )}
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-2 px-1 min-h-[80px]">
        <h3 className="text-primary-main title-h4 line-clamp-2 flex-1">
          {title}
        </h3>

        <p className="text-secondary body-default line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
