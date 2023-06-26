import './style.css'

const app = document.getElementById('app');

// Fetch data from the /movies endpoint
fetch('http://localhost:3000/movies')
  .then(response => response.json())
  .then(data => {
    const moviesList = document.getElementById('movies-list');
    data.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.textContent = movie.title;
      moviesList.appendChild(movieItem);
    });
  });

// Fetch data from the /user/:username endpoint
const username = 'tolga';

fetch(`http://localhost:3000/user/${username}`)
  .then(response => response.json())
  .then(data => {
    const userData = document.getElementById('user-data');
    Object.keys(data).forEach(key => {
      const dataItem = document.createElement('li');
      if (key === 'lastActivity') {
        dataItem.textContent = 'lastActivity:';
        const lastActivityList = document.createElement('ul');
        data[key].forEach(activity => {
          const activityItem = document.createElement('li');
          activityItem.textContent = `${activity.movie} (wpm: ${activity.wpm}, level: ${activity.level})`;
          lastActivityList.appendChild(activityItem);
        });
        dataItem.appendChild(lastActivityList);
      } else if (key === 'followers' && data[key].length === 0) {
        dataItem.textContent = 'followers: empty';
      } else if (key === 'following') {
        dataItem.textContent = 'following:';
        const followingList = document.createElement('ul');
        data[key].forEach(following => {
          const followingItem = document.createElement('li');
          followingItem.textContent = following;
          followingList.appendChild(followingItem);
        });
        dataItem.appendChild(followingList);
      } else if (key === 'avatar') {
        const avatarImg = document.createElement('img');
        avatarImg.src = data[key];
        avatarImg.alt = `${username}'s avatar`;
        avatarImg.width = 64;
        avatarImg.height = 64;
        dataItem.appendChild(avatarImg);
      } else {
        dataItem.textContent = `${key}: ${data[key]}`;
      }
      userData.appendChild(dataItem);
    });
  });



// Fetch data from the /getLeaderboard endpoint
fetch('http://localhost:3000/getLeaderboard')
  .then(response => response.json())
  .then(data => {
    const leaderboard = document.getElementById('leaderboard');
    Object.keys(data).forEach(key => {
      const leaderboardItem = document.createElement('li');
      leaderboardItem.textContent = `${key}: ${data[key]}`;
      leaderboard.appendChild(leaderboardItem);
    });
  });
