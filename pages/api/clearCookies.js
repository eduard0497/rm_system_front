export default function handler(req, res) {
  const cookies = req.headers.cookie;

  if (cookies) {
    const cookieArray = cookies.split(";");
    for (let cookie of cookieArray) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      res.setHeader(
        "Set-Cookie",
        `${name}=; Max-Age=0; path=/; HttpOnly; Secure; SameSite=Lax`
      );
    }
  }

  res.status(200).json({ message: "All cookies cleared" });
}
