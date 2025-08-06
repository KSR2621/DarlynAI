"use client";

import { useState, useEffect, useCallback } from 'react';

const USER_PROFILE_KEY = 'openGeminiUserProfile';

export interface UserProfile {
  name: string;
  photoDataUri?: string;
}

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to load user profile from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      } catch (error) {
        console.error("Failed to save user profile to localStorage", error);
      }
    }
  }, [userProfile, isLoaded]);

  return { userProfile, setUserProfile, isLoaded };
}
