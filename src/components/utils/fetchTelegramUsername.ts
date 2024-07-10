// utils/fetchTelegramUsername.ts

import axios from 'axios';

const TELEGRAM_API_KEY = 'your_telegram_api_key';

const fetchTelegramUsername = async () => {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_API_KEY}/getMe`);
    
    if (response.data.ok) {
      const username = response.data.result.username;
      console.log('Telegram Kullanıcı Adı:', username);
      return username;
    } else {
      console.error('Telegram API ile kullanıcı bilgisi alınamadı:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Telegram API hatası:', error);
    return null;
  }
};

export default fetchTelegramUsername;
