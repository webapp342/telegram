import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig';
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      const userDocRef = doc(firestore, 'users', username);

      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('Kullanıcı zaten kayıtlı:', username);
        } else {
          setDoc(userDocRef, {
            username: username,
            puan: 0,
          })
          .then(() => {
            console.log('Kullanıcı adı Firestore\'a kaydedildi:', username);
          })
          .catch((error) => {
            console.error('Firestore hatası:', error);
            setError('Firestore hatası: ' + error.message);
          });
        }
      }).catch((error) => {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
        setError('Kullanıcı bilgileri alınırken hata oluştu: ' + error.message);
      });
    } else {
      console.error('Kullanıcı bilgileri alınamadı veya kullanıcı adı mevcut değil');
      setTelegramUsername(null);
      setError('Kullanıcı adı bulunamadı.');
    }
    setLoading(false);
  }, []);

  const generateInviteLink = () => {
    return telegramUsername ? `https://t.me/kastamonmubot?start=${telegramUsername}` : 'https://t.me/kastamonmubot';
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : telegramUsername ? (
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
