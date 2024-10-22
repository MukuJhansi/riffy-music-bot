const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Dynamic } = require("musicard");
const client = require("../../client");

client.riffy.on('trackStart', async (player, track) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏺'),
            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏸'),
            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏭')
        );

    const channel = client.channels.cache.get(player.textChannel);
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
    const musicLength = track.info.length;
    const formattedLength = formatTime(Math.round(musicLength / 1000));
    const [minutesStr, secondsStr] = formattedLength.split(":");
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    const totalMilliseconds = (minutes * 60 + seconds) * 1000;
    const totalLength = Math.round(track.info.length / 1000);

    const musicCardBuffer = await Dynamic({
        thumbnailImage: track.info.thumbnail,
        name: track.info.title,
        author: track.info.author,
        progress: 0
    });

    let msg = await channel
    .send({
        files: [{ attachment: musicCardBuffer, name: `musicard.png` }],
        components: [row]
    })
    .then((x) => (player.message = x));
    
    player.message = msg;
    player.track = track;

    let elapsedTime = 0;
    const intervalId = setInterval(async () => {
        if (player.playing) {
            elapsedTime++;
            const progress = Math.min((elapsedTime / totalLength) * 100, 100);

            const updatedMusicCardBuffer = await Dynamic({
                thumbnailImage: track.info.thumbnail,
                name: track.info.title,
                author: track.info.author,
                progress: progress
            });

            await player.message.edit({
                files: [{ attachment: updatedMusicCardBuffer, name: `musicard.png` }],
                components: [row]
            });
        }
    }, 1000);

    const rowDisabled = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('disconnect')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏺')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('pause')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏸')
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⏭')
                .setDisabled(true));
});
