const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');
const { deployCommands } = require('./deploy-commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// Função para carregar comandos de um diretório específico
const loadCommands = (commandsPath) => {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command && command.data && command.data.name) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`Command in ${filePath} is missing required "data" or "data.name" property`);
        }
    }
};

// Carregar comandos do diretório 'commands'
const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

// Carregar comandos do diretório 'commands/utility'
const utilityPath = path.join(commandsPath, 'utility');
loadCommands(utilityPath);

client.once('ready', () => {
    console.log('Bot está online!');

    // Chama a função de deploy de comandos quando o bot está pronto
    deployCommands().then(() => {
        console.log('Comandos carregados/salvos com sucesso!');
    }).catch(console.error);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Houve um erro ao executar este comando.', ephemeral: true });
    }
});

client.login(token);