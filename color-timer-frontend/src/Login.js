import React, { useState } from 'react';

const Login = ({setToken}) =>{ //function passed in
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault(); //prevent default submission behavior
    const res = await fetch('http://localhost:5000/login', { //POST request to backend to login
      method: 'POST', //HTTP method to use
      headers: {
        'Content-Type': 'application/json', //content type to JSON
      },
      body: JSON.stringify({username, password}), //sending in username and pw as JSON strings
    });
    if(res.ok){
      const data = await res.json(); //parses response as JSON
      setToken(data.token); //set auth token using passed in function
      localStorage.setItem('token', data.token); //stores token in local storage
    } 
    else {
      const error = await res.json();
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return(
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
