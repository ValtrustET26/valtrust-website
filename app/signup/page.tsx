import { Suspense } from "react";
import SignUpContent from "./SignUpContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}