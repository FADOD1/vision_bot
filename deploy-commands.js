const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');
const path = require('path');

// Função para deletar comandos existentes
async function deleteExistingCommands(rest) {
    try {
        console.log('Started deleting existing application (/) commands.');

        const commands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId)
        );

        for (const command of commands) {
            await rest.delete(
                `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`
            );
            console.log(`Deleted command ${command.name}`);
        }

        console.log('Successfully deleted all existing application (/) commands.');
    } catch (error) {
        console.error('Error deleting existing commands:', error);
    }
}

// Função para registrar novos comandos
async function registerCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data && typeof command.data.toJSON === 'function') {
            commands.push(command.data.toJSON());
        } else {
            console.error(`The command at '${path.join(commandsPath, file)}' is missing a required "data" property or "toJSON" method.`);
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

// Função principal para deploy de comandos
async function deployCommands() {
    const rest = new REST({ version: '10' }).setToken(token);
    await deleteExistingCommands(rest);
    await registerCommands();
}

module.exports = { deployCommands };