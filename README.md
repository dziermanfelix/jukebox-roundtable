# Jukebox Roundtable

Tired of wrestling over the aux cord? What about hearing that awful sound when you unplug your device so you can hand the cord to your uncle Ricky? It's time to use Jukebox Roundtable.

Jukebox Roundtable is a collaborative music listening app that simplifies group playback. One central Spotify player connects to a source, and users join the jukebox to queue their songs. The backend ensures fair track rotation, playing each user's next track when it's their turn—no skips, no interruptions. Yes, that means everyone has to endure Uncle Ricky’s terrible song choices. But don’t worry—your turn is coming soon.

🚀 **Try it out:** [Jukebox Roundtable](https://jukebox-roundtable.onrender.com/)

## How To Play
1. **Start a Jukebox** – Create a new jukebox session to host a group listening experience.
2. **Log In with Spotify** – Authenticate your Spotify account to enable search and playback.
3. **Add Songs to Your Queue** – Search for and add tracks to your personal queue.
4. **Other Users Join & Add Songs** – Friends can join asynchronously and add their own tracks.
5. **Round-Robin Playback** – When the jukebox is started, the system plays one song from each participant in turn.
6. **Enjoy the Music** – Sit back and listen as the jukebox automatically rotates through users' queues.

## Tech Stack
- **Frontend:** React, CSS for styling
- **Backend:** Node.js, Express, MongoDB
- **WebSockets:** Socket.io for real-time updates
- **Testing:** Jest for backend unit tests
- **Music API:** Spotify Web API for authentication and playback

## Features
- **Centralized Music Playback:** One authenticated Spotify session plays all songs.
- **Individual User Queues:** Each participant adds songs to their personal queue.
- **Round-Robin Playback:** The system cycles through users fairly, playing their next song.
- **Real-Time Updates:** Users receive instant feedback when their song was added to the queue.
```


