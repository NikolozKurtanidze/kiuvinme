import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./utils/logger";
import { version } from "../package.json";
import socket from "./socket";
import Discord from "discord.js";
import UserConnectionService from "./services/UserConnectionService";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;
const botToken = process.env.BOT_TOKEN;
const discordServerId = process.env.DISCORD_SERVER_ID;
const counterChannelId = process.env.COUNTER_CHANNEL_ID;

if (!port || !host || !botToken || !discordServerId || !counterChannelId) {
    throw new Error("Something is undefined...");
}

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

const discordClient = new Discord.Client({intents: ["Guilds", "GuildMessages"]});
const service = new UserConnectionService(io);

discordClient.once("ready", async () => {
    logger.info("Discord bot is ready");

    const guild = await discordClient.guilds.cache.get(discordServerId)?.fetch();

    const commands = guild ? guild.commands : discordClient.application?.commands;

    commands?.create({
        name: "list_users",
        description: "Lists active users of kiuvinme",
    });

    commands?.create({
        name: "remove_user",
        description: "Removes user by socketId",
    });

    commands?.create({
        name: "clear_users",
        description: "Disconnects all users",
    });

    app.get("/", cors(), (_, res) => res.send(`Server is up and running version: ${version}`));

    httpServer.listen(port || 4000, () => {

    logger.info(`Server is listening (version: ${version})`);
    logger.info(`http://${host}:${port}`);
    
    socket({ io, service });
});
});

discordClient.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === "list_users") {
        interaction.reply({
            content: service.stringUsers,
            ephemeral: true,
        });
    }

    if (commandName === "remove_user") {
        console.log(options);
    }

    if (commandName === "clear_users") {
        service.clearAllUsers();
        interaction.reply({
            content: "All users disconnected",
            ephemeral: false,
        });
    }
});

discordClient.login(botToken);
