const config = require("./structures/configuration/index");
const { ShardingManager, ShardEvents } = require("discord.js");
const { logger } = require("./structures/functions/logger")
const express = require('express');
const path = require('path');
const app = express();
const PORT = 800;
app.use(express.static('public'));
app.use('/html/', express.static(path.join(__dirname, 'html')))

if (config.sharding) {
    const manager = new ShardingManager("./structures/client.js", { token: config.client_token, totalShards: "auto" });

    manager.on("shardCreate", shard => {
        logger(`Launched shard ${shard.id}`, "info")
    })
    manager.on(ShardEvents.Error, (shard, error) => {
        logger(`Shard ${shard.id} encountered an error : ${error.message}`, "error")
    })
    manager.on(ShardEvents.Reconnecting, (shard) => {
        logger(`Shard ${shard.id} is reconnecting.`, "info")
    })
    manager.on(ShardEvents.Death, (shard) => {
        logger(`Shard ${shard.id} has died.`, "error")
    })

    manager.spawn()
} else {
    require("./structures/client")
}

if (config.database) {
    require("./structures/database/connect").connect()
}
// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});
app.listen(PORT, (err) => {
    if (err) {
        console.error('Server startup error:', err);
    } else {
        console.log(`Server is running on ${PORT}`);
    }
});

/**
 * Enable sharding only if your bot is large, or wait until Discord officially notifies you to shard your bot.
 */
