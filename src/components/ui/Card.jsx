import Button from "./Button";

export default function CardVariant({
  thumbnail,
  title,
  description,
  duration,
  createdAt,
  onEdit,
  onDelete,
  variant = "blog",
}) {
  const isVideo = variant === "video";

  const formattedDate = (() => {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
})();


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
          src={thumbnail}
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

      {/* TEXT – MATCH SIZE EXACTLY */}
      <div className="flex flex-col  px-1 min-h-[60px]">
        <h3 className="text-primary-main title-h4 line-clamp-1">
          {title}
        </h3>

        <p className="text-secondary body-default line-clamp-2">
          {description}
        </p>

      </div>

      {/* BUTTONS – DO NOT CHANGE HEIGHT */}
      <div className="flex justify-between items-center gap-s8">
        {formattedDate && (
          <p className="text-large text-gray-500">
            <span className="font-medium">{formattedDate}</span>
          </p>
        )}
       <div className="flex gap-1">
         <Button variant="primary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
       </div>
      </div>
    </div>
  );
}
