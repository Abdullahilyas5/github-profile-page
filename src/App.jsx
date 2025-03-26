import React, { useEffect, useState } from 'react'
import './App.css';
import { use } from 'react';
const App = () => {

  const [suggestion, setSuggestion] = useState('');
  const [user, setuser] = useState('');
  const [input, setInput] = useState('');
  const [repos, setrepos] = useState([]);
  const [showrepos, setshowrepos] = useState([]);
  const [hiddenrepos, sethiddenrepos] = useState([]);
  

  function handleinput(e) {
    setTimeout(() => {
      setInput(e.target.value);
    }, 10);

  };



  const handlesuggestion = function () {

    setuser(suggestion);
    console.log("suggestion is set");
    console.log(suggestion);
    console.log("user is set");
    console.log(user);
    setSuggestion('');
  };


  const fetchrepos = async () => {

    try {

      const response = await fetch(user.repos_url, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`);
      }
      const data = await response.json();


      console.log("Fetched Repositories:", data);

      if (Array.isArray(data)) {  // ✅ Ensure data is an array 
        setrepos(data);
        // Update state with the repository array
        setshowrepos(data.slice(0, 4));
        sethiddenrepos(data.slice(4));
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };


  useEffect(() => {
    console.log("effect is runnig")
    fetchrepos();
  }, [user]); // Runs when `user` changes


  const fetchdata = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${input}`, {
        method: "GET",
        // headers: {
        //   Authorization: `token ${token}`
        // }
      });
      console.log(response)
      if (response.ok) {
        console.log("response ok");
      }

      if (!response.ok) {
        setSuggestion('');
        return;
      }
      const data = await response.json();

      setSuggestion(data);  
    }
    catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchdata();
  }, [input])


  const handlerepos = () => {
    setshowrepos([...showrepos, ...hiddenrepos]);
    const btn = document.querySelector('.viewbtn');
    btn.style.display = "none";
  }

  return (
    <div>
      <div className="hero">
        <img className='hero_img' src="./assets/hero-image-github-profile.jpg" alt=""  />

        <div className="search_sect">
          <img src="../src/assets/Search.svg" alt="bg"/>
          <input type="text" className="search" placeholder='username' onChange={handleinput}  autoFocus/>

        </div>
        <div className="suggest">
          <ul className="suggestion">

            {suggestion && suggestion.login ? (
              <li key={suggestion.id} className="suggestion_item" onClick={handlesuggestion} >
                <img src={suggestion.avatar_url || "https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"} alt="" />
                <div className="extras">
                  <span className='name'>{suggestion.login}</span>
                  <span className='bio'>{suggestion.bio}</span>
                </div>
              </li>
            ) : null}


          </ul>
        </div>
      </div>

      {/* --------------profiler------------ */}

      <div className="main">
        <div className="info">
          <a href={user.html_url} target='_blank'> <img className='profile_img' src={user.avatar_url || "https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"} alt="user icon" /></a>
          <div className="user_info">
            <span className='text_info'>Follower</span>
            <span>{user.followers || 0}</span>
          </div>
          <div className="user_info">
            <span className='text_info'>Following </span>
            <span>{user.following || 0}</span>
          </div>
          <div className="user_info">
            <span className='text_info'>location</span>
            <span>{user.location || "undefined"}</span>
          </div>

        </div>

        <div className="user_title">
          <h1 className='user_title_name'>{user.login || null}</h1>
          <p className='user_title_desc'>{user.bio}</p>
        </div>


        {/* --------------repo sec-------------- */}


        <div className="user_repo">
          {
            showrepos.map(repo => (
              <a key={repo.id} className="repo" href={repo.html_url} target='_blank' >
                <span className="repo_name">
                  <h3 className='link'>{repo.name}</h3>
                </span>

                <span className='desc'>{repo.description}</span>
                {/* Repository Info Section */}
                <div className="repo_info">
                  <img src="../src/assets/Chield_alt.svg" alt="Child Icon" /><span>{(repo.license?.name || "").split(" ")[0]}</span>
                  <img src="../src/assets/Nesting.svg" alt="Nesting Icon" /><span> {repo?.forks_count}</span>
                  <img src="../src/assets/Star.svg" alt="Star Icon" /><span>{repo?.stargazers_count}</span>
                  <span className='updated'></span>
                </div>

              </a>
            ))
          }

          {hiddenrepos.length > 0 && (
            <button onClick={handlerepos} className='viewbtn' >view all repositories</button>
          )}


        </div>
      </div>

      <div className="footer">
        <p>© {new Date().getFullYear()} GitHub Profiler. All rights reserved.</p>
        <p>
          Connect with me on 
          <a href="https://www.linkedin.com/in/abdullah-ilyas-452a63310/" target="_blank" rel="noopener noreferrer"> LinkedIn</a>.
        </p>
      </div>

    </div>
  )
}

export default App