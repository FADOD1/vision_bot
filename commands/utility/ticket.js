const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre um ticket de suporte.')
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Descreva o motivo do ticket')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('com_quem')
        .setDescription('Com quem deseja falar')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('urgencia')
        .setDescription('Nível de urgência')
        .setRequired(true)),

  async execute(interaction) {
    const motivo = interaction.options.getString('motivo');
    const comQuem = interaction.options.getString('com_quem');
    const urgencia = interaction.options.getString('urgencia');

    // Carrega o ID do canal de configuração
    const configPath = path.join(__dirname, '../../config.json');
    const config = require(configPath);

    if (!config.ticketChannelId) {
      return interaction.reply({ content: 'O canal de criação de tickets não está configurado. Peça a um administrador para configurá-lo usando o comando `/setup-ticket-channel`.', ephemeral: true });
    }

    const channel = await interaction.guild.channels.fetch(config.ticketChannelId);

    const ticketEmbed = new MessageEmbed()
      .setTitle('Sistema de Tickets')
      .setDescription('Clique no botão abaixo para abrir um ticket.')
      .setColor('#0099ff');

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('abrir_ticket')
          .setLabel('Abrir Ticket')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('ver_ticket')
          .setLabel('Ver Ticket')
          .setStyle('SECONDARY')
      );

    await channel.send({ embeds: [ticketEmbed], components: [row] });
    await interaction.reply({ content: 'A mensagem para criação de tickets foi enviada.', ephemeral: true });
  },
};
