/*
  Fetch call that adds the JWT to the header and sets the content
  type of be a json. Used to make regular api calls.
*/
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
    console.log(er);
    throw er;
  }
}

/*
  Fetch call for sending images or other types of large media content
  to the server. The content type is multipart/form-data, not declared because the
  boundary is not known. But the browser would know; however, might not
  be consistent across all browsers.

*/
export async function makeImageAPICall(method, url, body) {
  const headers = {};
  const token = localStorage.olivia_token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  let data = new FormData();
  data.append('image', body);
  try {
    let req = fetch(url, {
      method,
      headers,
      body: data
    });
    return req;
  } catch (er) {
    console.log('error here: ' + er);
    throw er;
  }
}
