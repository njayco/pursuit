"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SpotifyCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchToken = async () => {
      const code = searchParams.get("code");

      if (!code) return;

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
      });

      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("spotify_token", data.access_token);

        // OPTIONAL: Fetch user profile
        const profileRes = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const profile = await profileRes.json();

        // Store in Firebase
        const firebaseUser = {
          uid: profile.id,
          displayName: profile.display_name,
          email: profile.email,
          spotify: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          },
        };

        // Use Firebase SDK to write to Firestore or Auth

        router.push("/dashboard");
      }
    };

    fetchToken();
  }, [router, searchParams]);

  return <div className="p-8">Logging in with Spotify...</div>;
};

export default SpotifyCallback; 