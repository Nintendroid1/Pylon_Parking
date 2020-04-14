export async function makeAPICall(method, url, body) {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.olivia_token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    let req = fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    });
    return req;
  } catch (er) {
    throw er;
  }
}

export async function makeImageAPICall(method, url, body) {
  const headers = {
    'Content-Type': 'multipart/form-data'
  };
  const token = localStorage.olivia_token;
  let data = new FormData();
  data.append('image', body);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    let req = fetch(url, {
      method,
      headers,
      body: data
    });
    return req;
  } catch (er) {
    throw er;
  }
}