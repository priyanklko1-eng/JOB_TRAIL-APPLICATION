import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const payload = {
    email : normalizedEmail,
    password : password
  }
  const response  = await axios.post(`${API_URL}/login`, payload);

  console.log("jane" , response.data.data)

  // const user = users.find(
  //   (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  // );

  // if (!user) {
  //   throw new Error('Invalid email or password. Try jane@gmail.com / Password@123');
  // }

  // const { password: _, ...safeUser } = user;
  return {
    user: response.data.data.user,
    token: response.data.data.token,
  };
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const payload={
    name,
    email:normalizedEmail,
    password
  }

  const response = await axios.post(`${API_URL}/register`,payload);
  console.log("response",response)

  // if (existing.length > 0) {
  //   throw new Error('An account with this email already exists.');
  // }

  // const newUser = {
  //   name: name.trim(),
  //   email: normalizedEmail,
  //   password,
  //   masterResume: '',
  //   createdAt: new Date().toISOString()
  // };

  // const { data: created } = await axios.post(`${API_URL}/register`, newUser);
  // const { password: _, ...safeUser } = created;

  return {
    user: response.data.data.user,
    token: response.data.data.token
  };
};