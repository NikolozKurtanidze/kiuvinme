import express from "express";
import cors from "cors";
import config from "config";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./utils/logger";
import { version } from "../package.json";
import socket from "./socket";
import Discord from "discord.js";
import UserConnectionService from "./services/UserConnectionService";

const port = config.get<number>("port");
const host = config.get<string>("host");
const botToken = config.get<string>("botToken");
const discordServerId = config.get<string>("discordServerId");
const counterChannelId = config.get<string>("counterChannelId");

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
