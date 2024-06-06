import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { postFetch } from "@/reusableFuncs/postFetch";

function PaymentResult() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  useEffect(async () => {
    const { session_id, transaction_id, restaurant_id } = router.query;
    setloading(true);

    if (session_id && transaction_id && restaurant_id) {
      let data = await postFetch("process-payment", {
        session_id,
        transaction_id,
        restaurant_id,
      });
      if (!data.status) {
        setmessage(data.msg);
      } else {
        setmessage(data.msg);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } else {
      setmessage("Missing parameters");
    }
    setloading(false);
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
