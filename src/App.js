import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['isLoggedIn', 'user']);

  const inputname = useRef();
  const inputpass = useRef();
  // useEffect(()=>{
  //   cookies('isLoggedIn', false)
  // }, [])

  const handleDatapass = () => {
    const username = inputname.current.value;
    const password = inputpass.current.value;

    //login
    axios.post(`http://localhost:9050/auth/login`, {
      username, password
    })
      .then(res => {
        setUser(res.data)
        console.log('===', res.data);
        setCookie('user', res.data);
        setCookie('isLoggedIn', true);
      });
  }


  request('/login', { email: 'sadfa', pass: 'asdfas' })
    .then(res => {

    })

  async function request(úrl, data, method = 'post') {
    await axios({
      method: method,
      url: `${'BASE_URL'}${url}`,
      data: { a: 2 },
      headers: {
        Authorization: 'Bearer ' + cookies.user.refreshToken
      }
    })
      .then(res => {
        if (!res.success && res.status === 502) {
          axios.post('/auth/refresh', { token: cookies.user.refreshToken })
            .then(res => {
              if (res.success && res.accessToken) {
                const userCookie = cookies.user
                userCookie.accessToken = res.accessToken
                setCookie('user', userCookie)
                request(url, data, method)
              }
            })
        }
        if (res.success) {
          return res
        }
      })
  }



  const deleteHandler = (id) => {
    setError(false);
    setSuccess(false);
    axios.delete(`http://localhost:9050/delete/${id}`, {
      headers: { Authorization: `Bearer ${cookies.user.accessToken}` }
    })
      .then(res => {
        if (!res.success && res.msg === 'access denied') {

        }
      })
      .catch(err => setError(true))
  }

  const logoutHandler = () => {
    setError(false);
    setSuccess(false);
    // console.log(cookies.user.accessToken, cookies.user.refreshToken);
    axios.post(`http://localhost:9050/logout`, {
      headers: { Authorization: `Bearer ${cookies.user.accessToken}` }
    })
      .then(res => {
        removeCookie('isLoggedIn');
        removeCookie('user')
      })
  }

  return (
    <>
      {
        !cookies.isLoggedIn ? <div>
          <input ref={inputname} type="text" placeholder="plese enter your name" />
          <input ref={inputpass} type="number" placeholder="plese enter your pass" />
          <button onClick={handleDatapass} >click</button>
        </div> : <div>
          <button onClick={() => logoutHandler()}>Logout</button>
          <h4>{`Welcome to the the ${cookies.user.role} dashboard ${cookies.user.username}`}</h4>
          <button onClick={() => deleteHandler('admin')}>Delete admin</button>
          <button onClick={() => deleteHandler('user')}>Delete user</button>

          {error && <h4>you are not allow to delete this user</h4>}
          {success && <h4>{success.data}</h4>}
        </div>
      }
    </>
  )
}

export default App;