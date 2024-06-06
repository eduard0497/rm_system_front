const SERVER_LINK = process.env.NEXT_PUBLIC_SERVER_LINK;

export const postFetch = async (endpoint, bodyAsObject) => {
  let response = await fetch(`${SERVER_LINK}/${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyAsObject),
  });

  let data = await response.json();

  return data;
};
