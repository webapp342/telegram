// /src/server.ts
import express from 'express';
import { connectDB, findUser } from './services/dbService';

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/user', async (req, res) => {
    const userId = req.query.userId; // Bu değeri authenticate edilen kullanıcıdan almalısınız
    const user = await findUser(Number(userId));
    if (user) {
        res.json({ referralCode: user.referralCode, points: user.points });
    } else {
        res.status(404).send('Kullanıcı bulunamadı');
    }
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
    connectDB();
});
