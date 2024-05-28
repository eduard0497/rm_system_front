import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.body;

    if (token) {
      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 3, // 1 week
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);
      res.json({
        status: 1,
        msg: "Cookie set",
      });
    } else {
      res.json({
        status: 0,
        msg: "Token not provided",
      });
    }
  } else {
    res.json({
      status: 0,
      msg: "Method not allowed",
    });
  }
}
