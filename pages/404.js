import React from "react";
import { useRouter } from "next/router";

function ErrorPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Nothing to display here</h1>
      <button onClick={() => router.push("/")}>Go to home screen</button>
    </div>
  );
}

export default ErrorPage;
