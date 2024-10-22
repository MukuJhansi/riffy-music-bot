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

    // Total length of the track in seconds
    const totalLength = Math.round(track.info.length / 1000); // Convert from ms to seconds

    // Create the initial music card with elapsed time
    const musicCardBuffer = await Dynamic({
        thumbnailImage: track.info.thumbnail,
        name: `${track.info.title}`,
        author: track.info.author,
        progress: 0 // Initial progress
    });

    // Send the initial music card message
    const msg = await channel.send({
        files: [{ attachment: musicCardBuffer, name: `musicard.png` }],
        components: [row]
    });

    // Store the message and track in the player object
    player.message = msg;
    player.track = track;

    let elapsedTime = 0; // Track elapsed time in seconds
    const intervalId = setInterval(async () => {
        if (player.playing) {
            elapsedTime++;

            // Calculate the progress percentage
            const progress = Math.min((elapsedTime / totalLength) * 100, 100); // Clamp to 100%

            // Update the music card with new elapsed time and progress
            const updatedMusicCardBuffer = await Dynamic({
                thumbnailImage: track.info.thumbnail,
                name: `${track.info.title}`,
                author: track.info.author,
                progress: progress // Pass the progress for visual representation
            });

            // Edit the existing message with updated elapsed time
            await player.message.edit({
                files: [{ attachment: updatedMusicCardBuffer, name: `musicard.png` }],
                components: [row] // Keep buttons active
            });
        }
    }, 1000); // Update every 1 second

});
