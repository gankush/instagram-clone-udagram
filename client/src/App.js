import React from 'react';
import './App.css';
import NavBar from "./components/login/NavBar";

import PostManager from './components/postManager/PostManager'
import Header from './components/Header';
import { useAuth0 } from "./react-auth0";


const App = () => {

  const { loading,user,idToken } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(idToken);
  if (user === undefined){
  return <div className="App">
    <header>
      <Header />
      <NavBar />
    </header>
  </div>;
}
else {return <div className="App">
<header>
  <Header />
  <NavBar />
</header>
<section className="App-main">
  <PostManager token={idToken} user={user}/>
</section>
</div>;
}
}

export default App;