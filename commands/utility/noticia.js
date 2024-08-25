const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('noticia')
        .setDescription('Envia uma notícia paginada para um canal específico.')
        .addStringOption(option =>
            option.setName('cor')
                .setDescription('A cor da embed em hexadecimal (ex: #ff0000).')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('O canal onde a notícia será enviada.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('titulo1')
                .setDescription('O título da primeira página.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('descricao1')
                .setDescription('A descrição da primeira página.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('imagem1')
                .setDescription('A URL da imagem da primeira página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('titulo2')
                .setDescription('O título da segunda página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('descricao2')
                .setDescription('A descrição da segunda página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('imagem2')
                .setDescription('A URL da imagem da segunda página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('titulo3')
                .setDescription('O título da terceira página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('descricao3')
                .setDescription('A descrição da terceira página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('imagem3')
                .setDescription('A URL da imagem da terceira página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('titulo4')
                .setDescription('O título da quarta página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('descricao4')
                .setDescription('A descrição da quarta página.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('imagem4')
                .setDescription('A URL da imagem da quarta página.')
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const cor = interaction.options.getString('cor');
        const canal = interaction.options.getChannel('canal');
        const pages = [];

        for (let i = 1; i <= 4; i++) {
            const titulo = interaction.options.getString(`titulo${i}`);
            const descricao = interaction.options.getString(`descricao${i}`);
            const imagem = interaction.options.getString(`imagem${i}`);

            if (titulo && descricao) {
                const embed = new EmbedBuilder()
                    .setTitle(titulo)
                    .setDescription(descricao)
                    .setColor(cor)
                    .setFooter({ text: `Página ${i}` });

                if (imagem) {
                    embed.setImage(imagem);
                }

                pages.push(embed);
            }
        }

        if (pages.length === 0) {
            return interaction.reply({ content: 'Você deve fornecer pelo menos uma página de título e descrição.', ephemeral: true });
        }

        let currentPage = 0;

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous_page')
                    .setLabel('Página Anterior')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next_page')
                    .setLabel('Próxima Página')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(pages.length === 1),
                new ButtonBuilder()
                    .setCustomId('delete_button')
                    .setLabel('Deletar')
                    .setStyle(ButtonStyle.Danger)
            );

        const message = await canal.send({ embeds: [pages[currentPage]], components: [actionRow] });

        const filter = i => i.customId === 'previous_page' || i.customId === 'next_page' || i.customId === 'delete_button';
        const collector = message.createMessageComponentCollector({ filter, time: 600000 });

        collector.on('collect', async i => {
            if (i.customId === 'delete_button') {
                if (!i.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return i.reply({ content: 'Você não tem permissão para usar este botão.', ephemeral: true });
                }
                try {
                    await message.delete();
                    await i.reply({ content: 'Mensagem deletada com sucesso.', ephemeral: true });
                } catch (error) {
                    console.error('Erro ao deletar a mensagem:', error);
                    await i.reply({ content: 'Ocorreu um erro ao tentar deletar a mensagem.', ephemeral: true });
                }
                return;
            }

            if (i.customId === 'previous_page') {
                currentPage--;
            } else if (i.customId === 'next_page') {
                currentPage++;
            }

            await i.update({
                embeds: [pages[currentPage]],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous_page')
                                .setLabel('Página Anterior')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next_page')
                                .setLabel('Próxima Página')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === pages.length - 1),
                            new ButtonBuilder()
                                .setCustomId('delete_button')
                                .setLabel('Deletar')
                                .setStyle(ButtonStyle.Danger)
                        )
                ]
            });
            collector.resetTimer(); // Reinicia o temporizador do coletor
        });

        collector.on('end', collected => {
            message.edit({ components: [] }).catch(console.error); // Desativa os botões quando o coletor terminar
        });

        interaction.reply({ content: 'Notícia enviada com sucesso!', ephemeral: true });
    },
};
