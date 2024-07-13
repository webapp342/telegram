import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig';
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
  const [invitedBy, setInvitedBy] = useState<string | null>(null);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;
    const urlParams = new URLSearchParams(window.location.search);
    const invitedUser = urlParams.get('start'); // Davet eden kullanıcı

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      const userDocRef = doc(firestore, 'users', username);

      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('User already registered:', username);
          if (invitedUser) {
            setInvitedBy(invitedUser); // Davet eden kullanıcıyı ayarla
          }
          return;
        }

        // Save username and points to Firestore
        setDoc(userDocRef, {
          username: username,
          puan: 0,
          invited_by: invitedUser || null, // Davet eden kullanıcıyı kaydet
        })
        .then(() => {
          console.log('Username saved to Firestore:', username);
          if (invitedUser) {
            setInvitedBy(invitedUser);
          }
        })
        .catch((error) => {
          console.error('Firestore error:', error);
        });
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      });
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
          {invitedBy && <p>Davet Eden: {invitedBy}</p>}
          <p>
            Davet Linki: <a href={generateInviteLink()} target="_blank" rel="noopener noreferrer">{generateInviteLink()}</a>
          </p>
        </>
      ) : (
        <p>Kullanıcı adı bulunamadı.</p>
      )}
    </div>
  );
};

export default TelegramUsernameDisplay;
