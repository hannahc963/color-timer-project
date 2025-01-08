import React, { useState } from 'react';

const Register = () =>{
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => { //form submission
    e.preventDefault(); //prevents default submit behavior
    try{
      const res = await fetch('http://localhost:5000/register', { //POST request to backend to register
        method: 'POST', //HTTP method used
        headers: {
          'Content-Type': 'application/json', //content type to JSON
        },
        body: JSON.stringify({username, password}), //sends username and pw as JSON strings
      });
      if (res.ok) {
        alert('Registration successful');
      } 
      else {
        alert('Registration failed');
      }
    } catch(error) {
      console.error('Registration error:', error);
      alert('Registration failed');
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
