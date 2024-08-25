const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Cria uma embed personalizada e a envia para um canal específico.')
        .addStringOption(option => 
            option.setName('cor')
                .setDescription('A cor da embed (em hexadecimal, por exemplo: #ff5733)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('título')
                .setDescription('O título da embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('descrição')
                .setDescription('A descrição da embed')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('canal')
                .setDescription('O canal onde a embed será enviada')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)),
    
    async execute(interaction) {
        const color = interaction.options.getString('cor');
        const title = interaction.options.getString('título');
        const description = interaction.options.getString('descrição');
        const channel = interaction.options.getChannel('canal');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply('Você não tem permissão para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description);

        try {
            await channel.send({ embeds: [embed] });
            interaction.reply(`Embed enviada para ${channel}.`).then(() => {
                setTimeout(() => interaction.deleteReply(), 5000); // Apaga a mensagem de confirmação após 5 segundos
            });
        } catch (err) {
            console.error(err);
            interaction.reply('Houve um erro ao tentar enviar a embed para o canal.');
        }
    },
};
