import { Suspense } from "react";
import CreateItineraryClient from "./CreateItineraryClient";

export default function CreateItineraryPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <CreateItineraryClient />
    </Suspense>
  );
}