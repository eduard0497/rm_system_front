import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

function PaymentResult() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  useEffect(() => {
    const { session_id, transaction_id, restaurant_id } = router.query;

    if (session_id && transaction_id && restaurant_id) {
      fetch(`${SERVER_LINK}/process-payment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id,
          transaction_id,
          restaurant_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.status) {
            setmessage(data.msg);
            setloading(false);
          } else {
            setloading(false);
            setmessage(data.msg);
            setTimeout(() => {
              router.push("/dashboard");
            }, 3000);
          }
        });
    } else {
      setmessage("Missing parameters");
      setloading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Payment Result </h1>
      {message && <pre>{message}</pre>}
    </div>
  );
}

export default PaymentResult;
