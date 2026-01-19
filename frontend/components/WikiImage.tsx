import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

function WikiImage({
  city,
  country,
  gradient,
}: {
  city: string;
  country: string;
  gradient: string;
}) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        city
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.thumbnail?.source) {
          setImage(data.thumbnail.source);
        }
      })
      .catch(() => {
        setImage(null);
      });
  }, [city]);

  if (!image) {
    // Fallback (ALWAYS WORKS)
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient}`}
      >
        <Plane className="w-16 h-16 text-white/90 drop-shadow-lg" />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={city}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}


export default WikiImage;