const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf('7237900259:AAGI2Wj4exxSSdzgYw2ZLgpYtT3SOBN_QJ0');

bot.start((ctx) => ctx.reply('Welcome! Send me a Terabox link to download the video.'));

bot.on('text', async (ctx) => {
    const url = ctx.message.text;
    if (isValidTeraboxUrl(url)) {
        ctx.reply('Downloading video...');
        try {
            const videoPath = await downloadVideo(url);
            await ctx.replyWithVideo({ source: videoPath });
            fs.unlinkSync(videoPath); // Delete the video after sending
        } catch (error) {
            ctx.reply('Failed to download the video.');
        }
    } else {
        ctx.reply('Please send a valid Terabox link.');
    }
});

const isValidTeraboxUrl = (url) => {
    // Add your logic to validate the Terabox URL
    return true;
};

const downloadVideo = async (url) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    const videoPath = path.resolve(__dirname, 'video.mp4');
    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(videoPath));
        writer.on('error', reject);
    });
};

bot.launch();
