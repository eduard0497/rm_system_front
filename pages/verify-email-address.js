import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

function VerifyEmailAddress() {
  const router = useRouter();
  const { token } = router.query;

  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  const verifyUserEmail = () => {
    if (!token) return;
    setloading(true);
    fetch(`${SERVER_LINK}/verify-owner-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setmessage(data.msg);
        setloading(false);
      });
  };

  useEffect(() => {
    verifyUserEmail();
  }, [token]);

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!token) {
    return (
      <div>
        <h1>No Token provided</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default VerifyEmailAddress;
