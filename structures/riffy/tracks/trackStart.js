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

    // Function to format time from milliseconds to mm:ss
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    // Total length of the track in seconds
    const totalLength = Math.round(track.info.length / 1000); // Convert from ms to seconds

    // Create the initial music card with no progress
    const musicCardBuffer = await Dynamic({
        thumbnailImage: track.info.thumbnail,
        name: track.info.title,
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
                name: track.info.title,
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

    // Emit trackEnd when the track finishes
    player.once('trackEnd', async () => {
        clearInterval(intervalId); // Stop refreshing

        // Disable buttons when the song ends
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

        // Create a completed music card after the song ends
        const completedMusicCardBuffer = await Dynamic({
            thumbnailImage: track.info.thumbnail,
            name: track.info.title, // Show full title
            author: track.info.author,
            progress: 100 // Full progress
        });

        // Update the existing message with the completed music card
        await player.message.edit({
            files: [{ attachment: completedMusicCardBuffer, name: `musicard_completed.png` }],
            components: [rowDisabled] // Disable buttons for the completed song
        });

        // Emit the trackEnd event to handle in another file
        client.riffy.emit('trackEnd', player);
    });
});
