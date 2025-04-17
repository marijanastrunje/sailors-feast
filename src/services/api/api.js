const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const apiGet = (path) => {
  return fetch(`${backendUrl}/wp-json/wp/v2${path}`).then((res) => {
    if (!res.ok) {
      throw new Error("API error");
    }
    return res.json();
  });
};
