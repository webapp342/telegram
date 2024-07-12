import React, { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const TelegramUsernameDisplay: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);

  useEffect(() => {
    // Telegram Web App initialization
    const initData = WebApp.initDataUnsafe;

    // Kullanıcı adı mevcutsa state'e kaydediyoruz
    if (initData && initData.user && initData.user.username) {
      setTelegramUsername(initData.user.username);
      // Kullanıcı adını backend'e gönder
      fetch('https://telegram-backend-eight.vercel.app/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: initData.user.username }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      console.error('Kullanıcı bilgileri alınamadı veya kullanıcı adı mevcut değil');
      setTelegramUsername(null); // Açıkça null olarak ayarlıyoruz
    }
  }, []);

  // Davet linki oluşturma fonksiyonu
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
