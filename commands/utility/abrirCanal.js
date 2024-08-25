const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('abrir_canal')
        .setDescription('Abre o canal para que todos possam enviar mensagens.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const channel = interaction.channel;
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: true
            });

            await interaction.reply({ content: 'Canal aberto! Todos podem enviar mensagens.', ephemeral: true });
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Houve um erro ao abrir o canal.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Houve um erro ao abrir o canal.', ephemeral: true });
            }
        }
    },
};
