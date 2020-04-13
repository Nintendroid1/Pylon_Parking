const FormData = require('form-data');
const fs = require('fs');

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


// the api token is: dd2e85cdffcb75b447a8cdbb1207565b46ca7b66
// can only call 2500 times per month.
//
// http://docs.platerecognizer.com/?javascript#license-plate-recognition
export async function makePlateRecogAPICall(image) {
  let body = new FormData();
  body.append('upload', image);
  // Or body.append('upload', base64Image);
  body.append('regions', 'us'); // Change to your country

  try {
    let req = fetch("https://api.platerecognizer.com/v1/plate-reader/", {
      method: 'POST',
      headers: {
        "Authorization": "Token dd2e85cdffcb75b447a8cdbb1207565b46ca7b66"
    },
      body: body
    });
    return req;
  } catch (er) {
    throw er;
  }
  /*
  fetch("https://api.platerecognizer.com/v1/plate-reader/", {
          method: 'POST',
          headers: {
              "Authorization": "Token API_TOKEN"
          },
          body: body
      }).then(res => res.json())
      .then(json => console.log(json))
      .catch((err) => {
          console.log(err);
      });
      */
}