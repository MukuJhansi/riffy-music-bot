const client = require("../../client")

client.riffy.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    
    if (player.message) await player.message.delete();
    
        player.autoplay(player);
})
