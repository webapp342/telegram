// /src/services/telegramBotService.ts
import { Telegraf, Context } from 'telegraf';
import { findUser, createUser, updateUserPoints, connectDB } from './dbService';

const bot = new Telegraf('6990458213:AAFtjc4vwmLwxDfU6qewLyCZfgujk54rjps');

export function initializeBot() {
    bot.start(async (ctx: Context) => {
        if (!ctx.from || !ctx.message || !('text' in ctx.message)) {
            ctx.reply('Bir hata oluştu. Lütfen tekrar deneyin.');
            return;
        }

        const userId = ctx.from.id;
        const username = ctx.from.username;
        const message = ctx.message;
        const referralCode = message.text.split(' ')[1]; // Davet linkinden gelen referral kodunu alalım

        let user = await findUser(userId);
        if (!user) {
            user = {
                userId: userId,
                username: username,
                referralCode: generateReferralCode(),
                points: 0
            };
            await createUser(user);
            console.log(`Yeni kullanıcı eklendi: ${userId}`);
        }

        if (referralCode) {
            const referrer = await findUserByReferralCode(referralCode);
            if (referrer) {
                await updateUserPoints(referralCode, 100);
                ctx.reply(`Davet eden ${referrer.username} kullanıcıya 100 puan eklendi!`);
            } else {
                ctx.reply('Geçersiz davet kodu.');
            }
        }

        ctx.reply(`Hoş geldiniz, ${username}!\nPuanlarınız: ${user.points}`);
    });

    bot.launch();
}

function generateReferralCode(): string {
    return Math.random().toString(36).substr(2, 8); // 8 karakterlik rastgele bir kod oluşturuyoruz
}

async function findUserByReferralCode(referralCode: string) {
    const db = await connectDB();
    return db.collection('users').findOne({ referralCode: referralCode });
}
