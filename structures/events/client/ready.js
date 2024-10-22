const { ActivityType } = require("discord.js");
const client = require("../../client");
const { logger } = require("../../functions/logger");

client.on("ready", async () => {
    client.riffy.init(client.user.id); // Ensure this doesn't block presence updates

    console.log("\n---------------------");
    logger(`${client.user.tag} is ready`, "success");
    console.log("---------------------");

    // Function to update presence
    const updatePresence = async () => {
        let totalMembers = 0;
        const serverCount = client.guilds.cache.size; // Get the number of servers

        // Fetch total members from all guilds
        for (const guild of client.guilds.cache.values()) {
            // Fetch all members in the guild
            await guild.members.fetch(); // This will cache all members in the guild
            totalMembers += guild.memberCount; // Add the member count of the current guild
        }

        // Set the presence with the desired format
        const activities = [
            {
                name: `${totalMembers} Users Over ${serverCount} Servers`, // Activity 1
                type: ActivityType.Watching,
            },
            {
                name: "Made By Gunman", // Activity 2
                type: ActivityType.Playing,
            },
        ];

        // Determine which presence to show (0 or 1)
        const currentActivityIndex = Math.floor((Date.now() / 10000) % 2); // Switch every 10 seconds
        client.user.setPresence({
            status: "dnd",
            activities: [activities[currentActivityIndex]],
        });
    };

    // Initial presence update
    await updatePresence();

    // Update presence every 10 seconds
    setInterval(updatePresence, 10000);
});
