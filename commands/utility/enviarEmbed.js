const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// BEM ESSE COMANDO ENVIA UMA EMBED FIXA OU SEJA PARA EDITAR SO NO CODIGO, O USO? DIVULGAR ALGO SLA , USE A CRIATIVIDADE
module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar_embed')
        .setDescription('Envia uma embed com duas imagens e um link'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Acesse o link anexado para visitar nosso site oficial!')
            .setDescription('Esse e o nosso site oficial , ele ainda esta sempre em desenvolvimento quaisquer erros reporteos em aqui em nosso dc!')
            .setColor(0x0099ff)
            .setImage('https://i.postimg.cc/d3KVw2y9/Captura-de-tela-de-2024-05-17-12-06-12.png') 
            .setThumbnail('https://i.postimg.cc/Nj7QWpYD/Captura-de-tela-de-2024-06-09-14-11-10.png');

        await interaction.reply({
            content: 'Aqui está o [link do nosso canal oficial!] LINK AQUI)', // Substitua pelo seu link
            embeds: [embed]
        });
    },
};
