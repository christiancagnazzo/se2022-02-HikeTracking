const URL = "http://localhost:8000/hiketracking/"

async function createHike(hike_description, hike_file, token) {
  const valid_token = ('Token ' + token).replace('"', '').slice(0, -1)

  try {
    let response = await fetch(URL + 'hike/', {
      method: 'POST',
      body: JSON.stringify(hike_description),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': valid_token
      },
    })

    if (response.status == '200') {
      response = await response.json()
      let second_response = await fetch(URL + 'hike/file/' + response['hike_id'], {
        method: 'PUT',
        body: hike_file,
        headers: {
          'Authorization': valid_token
        },
      })

      if (second_response.status == '200')
        return { msg: "Hike Creato" };

      return { error: true, msg: "Something went wrong. Please check all fields and try again" };
    }

    return { error: true, msg: "Something went wrong. Please check all fields and try again" };
  }

  catch (e) {
    console.log(e) // TODO
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
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong in the login. Please try again" }
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
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong with the recording.  Please try again" }
  }

}

async function logout(token) {
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  await fetch(URL + 'logout/', {
    method: 'POST',
    headers: {
      'Authorization': valid_token
    },
  });
}

async function getAllHikes(token, filters) {
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)

  let query = ''

  if (filters) {
    query += '?filters=true'
    if (filters.minLength)
      query += '&minLength=' + filters.minLength 
    if (filters.maxLength)
      query += '&maxLength=' + filters.maxLength 
    if (filters.minTime)
      query += '&minTime=' + filters.minTime 
    if (filters.maxTime)
      query += '&maxTime=' + filters.maxTime 
    if (filters.minAscent)
      query += '&minAscent=' + filters.minAscent 
    if (filters.maxAscent)
      query += '&maxAscent=' + filters.maxAscent 
    if (filters.difficulty !== 'All')
      query += '&difficulty=' + filters.difficulty 
    if (filters.province !== '-')
      query += '&province=' + filters.province 
    if (filters.village)
      query += '&village=' + filters.village 
    if (filters.around)
      query += '&around=' + filters.around
  }

  let response = await fetch(URL + 'allhikes/' + query, {
    method: 'GET',
    headers: {
      //'Authorization': valid_token
    },
  });

  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}

async function checkAuth(token) {
  const valid_token = token = ('Token ' + token).replace('"', '').slice(0, -1)
  let response = await fetch(URL + 'sessions/', {
    method: 'GET',
    headers: {
      'Authorization': valid_token
    },
  });
  if (response.status == '200')
    return { msg: await response.json() }
  else {
    return { error: 'Error', msg: "Something went wrong. Please try again" }
  }
}

const API = { login, logout, createHike, signin, getAllHikes, checkAuth };
export default API;
