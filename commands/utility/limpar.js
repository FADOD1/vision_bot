const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limpar')
        .setDescription('Limpa um número especificado de mensagens.')
        .addIntegerOption(option => 
            option.setName('quantidade')
                .setDescription('Número de mensagens a serem apagadas')
                .setRequired(true)),
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('quantidade');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply('Você não tem permissão para usar este comando.');
        }

        if (amount < 1 || amount > 100) {
            return interaction.reply('Você deve especificar um número entre 1 e 100.');
        }

        await interaction.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            return interaction.reply('Houve um erro ao tentar limpar as mensagens neste canal.');
        });

        interaction.reply(`${amount} mensagens foram limpas.`).then(() => {
            setTimeout(() => interaction.deleteReply(), 5000); // Apaga a mensagem de confirmação após 5 segundos
        });
    },
};
