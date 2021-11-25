const headersDefault = {
  'content-type': 'application/json',
};

export const fetchApi = async (url, { method = 'GET', body, headers = headersDefault } = { method: 'GET', headers: headersDefault }) => {
  const myHeaders = new Headers();
  myHeaders.append('x-api-key', process.env.API_KEY);
  myHeaders.append('accept', 'application/json');
  if (headers) {
    Object.keys(headers).forEach((key) => {
      if (headers[key] !== undefined) {
        myHeaders.append(key, headers[key]);
      }
    });
  }

  let bodyRequest;
  if (body) {
    if (myHeaders.get('content-type')?.includes('application/json')) {
      bodyRequest = JSON.stringify(body);
    } else {
      const formData = new FormData();

      Object.keys(body).forEach((key) => {
        formData.append(key, body[key]);
      });

      bodyRequest = formData;
    }
  }

  const options = {
    method,
    headers: myHeaders,
    body: bodyRequest,
  };

  const result = await fetch(`${process.env.BASE_URL}${url}`, options);
  const resultJson = await result.json();

  return resultJson;
};
