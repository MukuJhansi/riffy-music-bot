require("dotenv").config();

module.exports = {
    client_token: "process.env.CLIENT_TOKEN",
    client_id: "process.env.CLIENT_ID",
    client_prefix: "!",
    mongodb_url: "process.env.MONGO_URI", //optional
    developers: ["1115658967012626542"],
    sharding: false,
    database: true,
    nodes: [
        {
            name: "Lavalink v4",
            host: "node-us.beban.tech",
            port: 80,
            password: "dsc.gg/bebancommunity",
            secure: false,
            reconnectTimeout: 5000,
            reconnectTries: 15
        },
        {
            name: "lavalink.jirayu.net 1",
            host: "lavalink.jirayu.net",
            password: "youshallnotpass",
            port: 13592,
            reconnectTimeout: 5000,
            reconnectTries: 15,
            secure: false
        },
        {
            name : "lavalink.jirayu.net",
            host : "lavalink.jirayu.net",
            port : 2334,
            password : "youshallnotpass",
            reconnectTimeout: 5000,
            reconnectTries: 15,
            secure : false  
        },
        {
            name: "Catfein",
            host: "lava.catfein.com",
            password: "catfein",
            port: 4000,
            reconnectTimeout: 5000,
            reconnectTries: 15,
            secure: false
        },
        {
            name: "Catfein DE",
            host: "lavalink.alfari.id",
            password: "catfein",
            port: 443,
            reconnectTimeout: 5000,
            reconnectTries: 15,
            secure: true
        },
        {
            name: "LewdHuTao - Lavalink",
            host: "node.lewdhutao.my.eu.org",
            password: "youshallnotpass",
            port: 80,
            reconnectTimeout: 5000,
            reconnectTries: 15,
            secure: false
        }
        
    ]
}

/**
 * Get discord bot token from here https://discord.com/developers/applications
 * Get mongodb url from https://www.mongodb.com/
 */
