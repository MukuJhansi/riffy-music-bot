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
    const totalLength = Math.round(track.info.length / 1000);

    try {
        const musicCardBuffer = await Dynamic({
            thumbnailImage: track.info.thumbnail,
            name: track.info.title,
            author: track.info.author,
            progress: 0
        });

        const msg = await channel.send({
            files: [{ attachment: musicCardBuffer, name: `musicard.png` }],
            components: [row]
        });

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

        player.once('trackEnd', async () => {
            clearInterval(intervalId);
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
                        .setDisabled(true)
                );

            const completedMusicCardBuffer = await Dynamic({
                thumbnailImage: track.info.thumbnail,
                name: track.info.title,
                author: track.info.author,
                progress: 100
            });

            await player.message.edit({
                files: [{ attachment: completedMusicCardBuffer, name: `musicard_completed.png` }],
                components: [rowDisabled]
            });

            client.riffy.emit('trackEnd', player);
        });
    } catch (error) {
        console.error('Error handling track start:', error);
    }
});
