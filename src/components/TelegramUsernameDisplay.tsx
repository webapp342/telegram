import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyBQwjgfS2FZWZJtGJPFAJNS58YcAdUVDeE",
  authDomain: "telegram-cc828.firebaseapp.com",
  projectId: "telegram-cc828",
  storageBucket: "telegram-cc828.appspot.com",
  messagingSenderId: "541310609374",
  appId: "1:541310609374:web:5c046692c1ee59ba981f4f",
  measurementId: "G-7XGPVD7NY4"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      // Kullanıcı adını Firestore'a kaydet
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

  return (
    <div>
      {telegramUsername ? (
        <>
          <p>Telegram Kullanıcı Adı: {telegramUsername}</p>
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
