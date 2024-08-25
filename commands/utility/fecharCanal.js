const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fechar_canal')
        .setDescription('Fecha o canal para que apenas admins possam enviar mensagens.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });

            await interaction.reply({ content: 'Canal fechado! Apenas admins podem enviar mensagens.', ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Houve um erro ao fechar o canal.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Houve um erro ao fechar o canal.', ephemeral: true });
            }
        }
    },
};
