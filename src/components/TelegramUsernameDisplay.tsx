import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import app from './firebaseConfig';
import { getFirestore, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const firestore = getFirestore(app);

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
  const [inviterUsername, setInviterUsername] = useState<string | null>(null);

  useEffect(() => {
    const initData = WebApp.initDataUnsafe;

    if (initData && initData.user && initData.user.username) {
      const username = initData.user.username;
      setTelegramUsername(username);

      // Kullanıcı adını Firestore'a kaydet
      setDoc(doc(firestore, 'users', username), {
        username: username,
        points: 0, // Başlangıçta 0 puan
      })
      .then(() => {
        console.log('Kullanıcı adı Firestore\'a kaydedildi:', username);
      })
      .catch((error) => {
        console.error('Firestore hatası:', error);
      });

      // Davet eden kullanıcı adı kontrolü
      const urlParams = new URLSearchParams(window.location.search);
      const inviter = urlParams.get('start');
      if (inviter) {
        setInviterUsername(inviter);
        updateInviterPoints(inviter);
      }
    } else {
      console.error('Kullanıcı bilgileri alınamadı veya kullanıcı adı mevcut değil');
      setTelegramUsername(null);
    }
  }, []);

  const updateInviterPoints = async (inviter: string) => {
    const inviterDoc = doc(firestore, 'users', inviter);
    const inviterSnapshot = await getDoc(inviterDoc);
    
    if (inviterSnapshot.exists()) {
      const currentPoints = inviterSnapshot.data().points || 0;
      await updateDoc(inviterDoc, {
        points: currentPoints + 100,
      });
      console.log('Davet eden kullanıcının puanı güncellendi:', inviter);
    }
  };

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
