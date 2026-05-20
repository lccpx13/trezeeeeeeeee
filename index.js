const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    AudioPlayerStatus,
    NoSubscriberBehavior
} = require('@discordjs/voice');

const play = require('play-dl');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const prefix = "!";
const token = process.env.TOKEN;

if (!token) {
    console.log("MTUwNjQ4ODYwMTIzMDE4NDUyOQ.GA7s2P.Tksut71_jOcIcFx3FbyHAeLo0uVDpi8OtruUg0");
    process.exit(1);
}

client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    try {

        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // ================= PLAY =================
        if (command === 'play') {

            const voiceChannel = message.member.voice.channel;

            if (!voiceChannel) {
                return message.reply('❌ Entre em um canal de voz.');
            }

            const music = args.join(" ");

            if (!music) {
                return message.reply('❌ Digite o nome da música.');
            }

            const result = await play.search(music, {
                limit: 1
            });

            if (!result.length) {
                return message.reply('❌ Música não encontrada.');
            }

            const song = result[0];

            const stream = await play.stream(song.url);

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: true
            });

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause
                }
            });

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            connection.subscribe(player);

            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

            player.on('error', (error) => {
                console.log('Erro no player:', error.message);
                connection.destroy();
            });

            return message.channel.send(`🎵 Tocando: **${song.title}**`);
        }

        // ================= LEAVE =================
        if (command === 'leave') {

            const connection = getVoiceConnection(message.guild.id);

            if (!connection) {
                return message.reply('❌ Não estou em um canal.');
            }

            connection.destroy();

            return message.channel.send('👋 Sai do canal.');
        }

    } catch (error) {

        console.log(error);

        message.channel.send('❌ Ocorreu um erro.');

    }

});

client.login(token);