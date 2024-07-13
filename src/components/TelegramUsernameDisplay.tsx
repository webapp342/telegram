import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig'; // Yapılandırmayı buradan içe aktar
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      const userDocRef = doc(firestore, 'users', username);

      // Kullanıcı adını Firestore'a kaydetmeden önce kontrol et
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('Kullanıcı zaten kayıtlı:', username);
        } else {
          // Kullanıcı adı Firestore'a kaydet
          setDoc(userDocRef, {
            username: username,
            puan: 0,  // Yeni kullanıcı için başlangıç puanı
          })
          .then(() => {
            console.log('Kullanıcı adı Firestore\'a kaydedildi:', username);
          })
          .catch((error) => {
            console.error('Firestore hatası:', error);
          });
        }
      }).catch((error) => {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
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
