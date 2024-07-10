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
    } else {
      console.error('Kullanıcı bilgileri alınamadı veya kullanıcı adı mevcut değil');
      setTelegramUsername(null); // Açıkça null olarak ayarlıyoruz
    }
  }, []);

  return (
    <div>
      {telegramUsername ? (
        <p>Telegram Kullanıcı Adı: {telegramUsername}</p>
      ) : (
        <p>Kullanıcı adı bulunamadı.</p>
      )}
    </div>
  );
};

export default TelegramUsernameDisplay;
