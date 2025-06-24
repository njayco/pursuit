import React from "react";

const SpotifyLoginButton = () => {
  const handleLogin = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
    const scopes = [
      "user-read-private",
      "user-read-email",
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${scopes.join("%20")}`;

    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded">
      Sign in with Spotify
    </button>
  );
};

export default SpotifyLoginButton; 