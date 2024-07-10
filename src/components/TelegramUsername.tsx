// components/TelegramUsernameDisplay.tsx

import React, { useEffect, useState } from 'react';
import fetchTelegramUsername from './utils/fetchTelegramUsername';

const TelegramUsername: React.FC = () => {
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await fetchTelegramUsername();
      setTelegramUsername(username);
    };

    fetchUsername();
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

export default TelegramUsername;
