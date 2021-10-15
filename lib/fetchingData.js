export const fetchApi = async (url, { method = 'GET', body, headers } = { method: 'GET' }) => {
  const myHeaders = new Headers();
  myHeaders.append('x-api-key', process.env.API_KEY);
  myHeaders.append('content-type', 'application/json');
  if (headers) {
    Object.keys(headers).forEach((key) => {
      myHeaders.append(key, headers[key]);
    });
  }

  let bodyJson;
  if (body) {
    bodyJson = JSON.stringify(body);
  }

  const options = {
    method,
    headers: myHeaders,
    body: bodyJson,
  };

  const result = await fetch(`${process.env.BASE_URL}${url}`, options);
  const resultJson = await result.json();

  return resultJson;
};
