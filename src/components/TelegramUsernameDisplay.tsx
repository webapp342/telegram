import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig';
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
  const [isReferred, setIsReferred] = useState(false); // Add a new state to track if the user was referred

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      const userDocRef = doc(firestore, 'users', username);

      // Check if user already exists in Firestore
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('User already registered:', username);
          return;
        }

        // Save username and points to Firestore
        setDoc(userDocRef, {
          username: username,  // Save username
          puan: 0,
        })
        .then(() => {
          console.log('Username saved to Firestore:', username);
        })
        .catch((error) => {
          console.error('Firestore error:', error);
        });
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });

      // Check if the user came from a referral link
      const urlParams = new URLSearchParams(window.location.search);
      const referredByUsername = urlParams.get('start');
      if (referredByUsername && referredByUsername === username) {
        setIsReferred(true);
      }
    } else {
      console.error('User data could not be retrieved or username is not available');
      setTelegramUsername(null);
    }
  }, []);

  const generateInviteLink = () => {
    if (telegramUsername) {
      return `https://t.me/kastamonmubot?start=${telegramUsername}`;
    }
    return 'https://t.me/kastamonmubot';
  };

  return (
    <div>
      {telegramUsername ? (
        <>
          <p>Telegram Kullanıcı Adı: {telegramUsername}</p>
          <p>
            Davet Linki: <a href={generateInviteLink()} target="_blank" rel="noopener noreferrer">{generateInviteLink()}</a>
          </p>
          {isReferred ? (
            <p>You were referred by someone!</p>
          ) : (
            <p>You didn't come from a referral link.</p>
          )}
        </>
      ) : (
        <p>Kullanıcı adı bulunamadı.</p>
      )}
    </div>
  );
};

export default TelegramUsernameDisplay;