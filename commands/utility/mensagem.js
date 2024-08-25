
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mensagem')
        .setDescription('Envia uma mensagem para um canal específico.')
        .addChannelOption(option => 
            option.setName('canal')
                .setDescription('O canal onde a mensagem será enviada')
                .addChannelTypes(ChannelType.GuildText)  // Aqui usamos ChannelType.GuildText corretamente
                .setRequired(true))
        .addStringOption(option => 
            option.setName('mensagem')
                .setDescription('A mensagem a ser enviada')
                .setRequired(true)),
    
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal');
        const message = interaction.options.getString('mensagem');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply('Você não tem permissão para usar este comando.');
        }

        try {
            await channel.send(message);
            interaction.reply(`Mensagem enviada para ${channel}.`);
        } catch (err) {
            console.error(err);
            interaction.reply('Houve um erro ao tentar enviar a mensagem para o canal.');
        }
    },
};
