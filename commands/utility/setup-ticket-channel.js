const { SlashCommandBuilder } = require('@discordjs/builders');
const { clientId } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-ticket-channel')
    .setDescription('Configura o canal onde a mensagem de criação do ticket será enviada.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Selecione o canal para enviar a mensagem de criação do ticket')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('canal');

    // Salva o ID do canal em um arquivo ou banco de dados
    // Aqui usamos um arquivo JSON como exemplo
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, '../../config.json');
    const config = require(configPath);

    config.ticketChannelId = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply(`O canal de criação de tickets foi configurado para ${channel}.`);
  },
};
