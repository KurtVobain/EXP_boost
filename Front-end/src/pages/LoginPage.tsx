import React, { useCallback, useState } from 'react';
import Box from '../componets/Box';
import Logo from '../componets/Logo';
import axios from 'axios';
import MultiToggle from '../componets/MultiTiggle';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  const hostname = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [learnWeb3Url, setLearnWeb3Url] = useState('');
  const [activeOption, setActiveOption] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = useCallback(() => {
    const data = {
      email,
      password,
      firstName,
      lastName,
      walletAddress,
      learnWeb3url: learnWeb3Url,
    };
    axios
      .post(`${hostname}/auth/register`, data)
      .then((response) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email, password, firstName, lastName, walletAddress, learnWeb3Url]);

  const handleLogin = useCallback(() => {
    const data = {
      email: loginEmail,
      password: loginPassword,
    };
    axios
      .post(`${hostname}/auth/login`, data)
      .then((response) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loginEmail, loginPassword]);

  return (
    <div className="">
      
      <div className="h-screen flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col gap-2 w-full items-center">
          To test the functionality, sign in as a guest
          <div className="bg-[#FF7423] text-white p-2 rounded-md w-72 text-center cursor-pointer">
            Sign in as a guest

          </div>
        </div>
        <Box
          children={
            <div className="flex flex-col gap-6">
              <div className="text-xl flex justify-between">
                {activeOption === 'register' ? 'Register' : 'Login'}
                <Logo />
              </div>
              <div className="">
                <MultiToggle
                  options={[
                    { value: 'login', title: 'Login' },
                    { value: 'register', title: 'Register' },
                  ]}
                  activeOption={activeOption}
                  handleChange={setActiveOption}
                />
              </div>
              {activeOption === 'register' && (
                <div className="flex flex-col gap-4 w-[436px]">
                  <div className="flex flex-row gap-2">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-purple rounded p-2 bg-[#2C3039]"
                      placeholder="First Name"
                    />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-purple rounded p-2 bg-[#2C3039]"
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Password"
                  />
                  <input
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Wallet Address"
                  />
                  <input
                    value={learnWeb3Url}
                    onChange={(e) => setLearnWeb3Url(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="LearnWeb3 Profile URL"
                  />
                  <button
                    onClick={handleRegister}
                    className="bg-purple text-white p-2 rounded-md"
                  >
                    Register
                  </button>
                </div>
              )}
              {activeOption === 'login' && (
                <div className="flex flex-col gap-4 w-[436px]">
                  <input
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Password"
                  />
                  <button
                    onClick={handleLogin}
                    className="bg-purple text-white p-2 rounded-md"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default LoginPage;