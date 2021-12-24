 const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} = require('@discordjs/voice');

const dotenv = require('dotenv');

dotenv.config();

const discord = require('discord.js');

const player = createAudioPlayer();

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

function playVuvuzela() {
  player.play(resource);
}

async function connectToChannel(channel) {
  const connect = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  try {
    await entersState(connect, VoiceConnectionStatus.Ready, 30e3);

    return connect;
  } catch (err) {
    connect.destory();
    throw err;
  }
}

// === MAIN CODE ===

const client = new discord.Client({
  intents: [ discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES]
});

client.login(process.env.PASSWORD);

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    console.log('SOUND READY');
  } catch (error) {
    console.error(error);
  }
});

client.on('messageCreate', async (message) => {
  if (!message.guild) return;

  if (message.content === '!join') {
    const channel = message.member?.voice.channel;

    if (channel) {
      try {
        const connection = await connectToChannel(channel);
        let sub = connection.subscribe(player);

        const resource = createAudioResource('https://r2---sn-aigl6nsk.googlevideo.com/videoplayback?expire=1640379845&ei=ZeHFYZ_mLNnHhwat2JPwBQ&ip=35.174.153.120&id=o-ADxgQhrEDaq7rQjzlGGwxYsyLBRUGgCri8cVgi9m4Xsj&itag=140&source=youtube&requiressl=yes&vprv=1&mime=audio%2Fmp4&gir=yes&clen=571769186&dur=36000.123&lmt=1507868452547093&keepalive=yes&fexp=24001373,24007246&c=ANDROID&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRAIgTUn6jzb1u7fFhVEUHEdiMBu1MOgm8EnMiQwKbUH3qboCIH0JS9IJ_wPZXSKwKSfnvSJKYEr6tuJIT0Ljtp8663t7&title=Vuvuzela+10+hours&redirect_counter=1&cm2rm=sn-1xopouxgoxu-aige7l&req_id=4a08e4774267a3ee&cms_redirect=yes&mh=LB&mip=51.148.184.55&mm=29&mn=sn-aigl6nsk&ms=rdu&mt=1640358066&mv=m&mvi=2&pl=21&lsparams=mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhAPiy8nmmiIG3LkJRjiL1Iw9FLALQSDIvWsX1haXLjyTmAiEAoLisxU3dCp7IlTDArM-knyhq6ieRnWhJ3cLElYg5gTQ%3D', {
          inputType: StreamType.Arbitrary,
        });

        console.log(resource.playbackDuration);

        while (true) {
          await player.play(resource);
          await sleep(36000000);
        }

      } catch (err) {
        console.error(err);
      }
    } else {
      void message.reply('JOIN A VOICE CHANNEL');
    }
  }
});
