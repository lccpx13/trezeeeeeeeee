const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = "!";
const token = "MTUwNjQ4ODYwMTIzMDE4NDUyOQ.GFXdnk.psJ_4U2Ryy97T5xG3OkqeetFlX_8f4Vb2SYe7s

Copiar

Token de redefinição";

client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}`);
    client.user.setActivity('TROPA DA TREZE', { type: 3 });
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // COMANDO PING
    if (command === 'ping') {
        message.reply('🏓 Pong!');
    }

    // COMANDO TROPA
    if (command === 'tropa') {

        const embed = new EmbedBuilder()
            .setTitle('🔥 TROPA DA TREZE 🔥')
            .setDescription('Servidor oficial da TROPA DA TREZE!')
            .addFields(
                { name: '🎮 Time', value: 'Competitivo FiveM', inline: true },
                { name: '👑 Organização', value: 'Tropa da Treze', inline: true }
            )
            .setColor('Red')
            .setFooter({ text: 'BOT OFICIAL TROPA DA TREZE' });

        message.channel.send({ embeds: [embed] });
    }

    // COMANDO AJUDA
    if (command === 'ajuda') {
        message.reply(`
📌 Comandos:

!ping
!tropa
!ajuda
        `);
    }

});

client.login(token);
