const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar_dm')
        .setDescription('Envia uma mensagem direta para um usuário específico.')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('O usuário para quem enviar a mensagem.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('mensagem')
                .setDescription('A mensagem a ser enviada.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const message = interaction.options.getString('mensagem');

        if (!user) {
            return interaction.reply({ content: 'Usuário não encontrado.', ephemeral: true });
        }

        try {
            await user.send(message);
            await interaction.reply({ content: `Mensagem enviada para ${user.tag}.`, ephemeral: true });
        } catch (error) {
            if (error.code === 50007) {
                await interaction.reply({ content: 'Não foi possível enviar a mensagem. O usuário pode ter bloqueado DMs ou bloqueado o bot.', ephemeral: true });
            } else {
                console.error(error);
                await interaction.reply({ content: 'Houve um erro ao enviar a mensagem.', ephemeral: true });
            }
        }
    },
};
