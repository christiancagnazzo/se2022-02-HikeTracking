const URL = "http://localhost:8000/hiketracking/"

async function createHike(hike_description, hike_file, token) {
  try {

    let response = await fetch(URL + 'hike/', {
      method: 'POST',
      body: JSON.stringify(hike_description),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+token
      },
    })

    if (response.status == '200') {
      response = await response.json()
      let second_response = await fetch(URL + 'hike/file/' + response['hike_id'], {
        method: 'PUT',
        body: hike_file,
        'Authorization': 'Token '+token
      })

      if (second_response.status == '200')
        return true;

      return false;
    }

    return false;
  }

  catch (e) {
    console.log(e) // TODO
  }
}

//USED TO GET INFO ABOUT QUEE FROM SERVER
async function getAllInfos() {
  const response = await fetch(URL);
  const services = await response.json();
  if (response.ok) {
    return services.map((c) => ({ id: c.id, info1: c.info1, info2: c.info2, info3: c.info1info3 }))
  } else {
    throw services;
  }
}


async function login(credentials) {
  let response = await fetch(URL + 'login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.status == '200')
    return { msg: await response.json()}
  else{
    return { error: 'Error', msg: "Qualcosa è andato storto nel login. Riprovare"}
  }
}

async function signin(credentials) {
  let response = await fetch(URL + 'register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (response.status == '200')
    return { msg: await response.json()}
  else{
    return { error: 'Error', msg: "Qualcosa è andato storto nella registrazione. Riprovare"}
  }
    
}

async function logout() {
  await fetch(URL + 'sessions/current', { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
  const response = await fetch(URL + 'sessions/current', { credentials: 'include' });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}



async function getHikes(filter, userPower) {
  if (userPower !== "")
    userPower += '/'
  const response = await fetch(URL + userPower + 'hikes?filter=' + filter, { method: 'GET', credential: 'include' })
  const up = await response.json();
  if (response.ok) {
    return up;
  } else {
    throw up;
  }
}

async function getAllHikes(token) {
  let response = await fetch(URL + 'allhikes/', {
    method: 'GET',
    'Authorization': 'Token '+token
  });

  if (response.status == '200')
    return { msg: await response.json()}
  else{
    return { error: 'Error', msg: "Qualcosa è andato storto. Riprovare"}
  }
}

const API = { login, logout, getUserInfo, getHikes, createHike, signin, getAllHikes };
export default API;
