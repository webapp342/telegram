import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig';
import { getFirestore, setDoc, doc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      setDoc(doc(firestore, 'users', username), {
        username: username,
      })
      .then(() => {
        console.log('Kullanıcı adı Firestore\'a kaydedildi:', username);
      })
      .catch((error) => {
        console.error('Firestore hatası:', error);
      });
    } else {
      console.error('Kullanıcı bilgileri alınamadı veya kullanıcı adı mevcut değil');
      setTelegramUsername(null);
    }
  }, []);

  const generateInviteLink = () => {
    if (telegramUsername) {
      return `https://t.me/kastamonmubot?start=${telegramUsername}`;
    }
    return 'https://t.me/kastamonmubot';
  };

  const inviteFriends = () => {
    const link = generateInviteLink();
    navigator.clipboard.writeText(link).then(() => {
      alert('Davet linki kopyalandı: ' + link);
    });
  };

  return (
    <div>
      {telegramUsername ? (
        <>
          <p>Telegram Kullanıcı Adı: {telegramUsername}</p>
          <p>
            Davet Linki: <a href={generateInviteLink()} target="_blank" rel="noopener noreferrer">{generateInviteLink()}</a>
          </p>
          <button onClick={inviteFriends}>Arkadaşlarını Davet Et</button>
        </>
      ) : (
        <p>Kullanıcı adı bulunamadı.</p>
      )}
    </div>
  );
};

export default TelegramUsernameDisplay;
