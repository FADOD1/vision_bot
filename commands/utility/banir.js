const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banir')
        .setDescription('Bane um usuário do servidor.')
        .addUserOption(option => 
            option.setName('usuário')
                .setDescription('O usuário a ser banido')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('razão')
                .setDescription('A razão do banimento')
                .setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('usuário');
        const reason = interaction.options.getString('razão') || 'Nenhuma razão fornecida';
        const member = interaction.guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply('Você não tem permissão para usar este comando.');
        }

        if (!member) {
            return interaction.reply('O usuário não está neste servidor.');
        }

        try {
            await member.ban({ reason });
            interaction.reply(`Usuário ${user.tag} foi banido. Razão: ${reason}`);
        } catch (err) {
            console.error(err);
            interaction.reply('Houve um erro ao tentar banir o usuário.');
        }
    },
};
