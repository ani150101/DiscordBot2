require('dotenv').config();
const axios = require('axios').default;
const discord = require("discord.js");
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('./commands/functions/embed.js'); ///////// ENABLE WHILE TESTING ///////////
const client = new discord.Client();
const fs = require('fs');
client.commands = new discord.Collection();
client.utilities = new discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const utlitiesFiles = fs.readdirSync('./commands/utilities/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);

}
for (const file of utlitiesFiles) {
  const utility = require(`./commands/utilities/${file}`)
  client.utilities.set(utility.name, utility);
}
// console.log(client.commands)
client.login(process.env.BOT_TOKEN).catch(err => console.log(err));
// client.login(process.env.TEST_TOKEN).catch(err => console.log(err));


client.on('ready', () => {
  console.log(`Bot is up..\n----------\nPREFIX: ${process.env.PREFIX}\n\n`);
  client.user.setPresence({ status: 'dnd', activity: { name: `${process.env.PREFIX}help | eaglemodz.com`, type: 'PLAYING' } })
    .catch(err => console.log(err));
  let config = JSON.parse(fs.readFileSync('./config/config.json').toString());
  client.guilds.cache.forEach(guild => {
    if (!config.hasOwnProperty(guild.id)) {
      config[guild.id] = {}
      // console.log(guild.name);
    }
  })
  fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4));
})

client.on('guildCreate', (guild) => {
  console.log(guild.name);
  guild.roles.create({
    data:
    {
      name: 'Muted',
      position: 1,
      permissions: ['READ_MESSAGE_HISTORY'],
    }
  }).then(role => {
    let config = JSON.parse(fs.readFileSync('./config/config.json').toString());
    config[`${guild.id}`] = {
      'muted-role': `${role.id}`
    }
    fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 4));
    console.log(`Muted role created. Overwriting channel permissions...`);
    guild.channels.cache.forEach(channel => {
      channel.createOverwrite(role, {
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: true,
        ADD_REACTIONS: false,
        CONNECT: false,
        MENTION_EVERYONE: false,
        MANAGE_ROLES: false,
        SEND_TTS_MESSAGES: false,
      }).catch(e => { });
      console.log(`${channel.name} permissions updated.`);
    })
  })
    .catch(err => console.log(`Couldn't create Muted role`, err));
})

client.on('message', async (message) => {
  // message.content.split().splice()
  let config = JSON.parse(fs.readFileSync('./config/config.json').toString());
  if (message.channel.type === "dm" && !message.author.bot) {
    const modmail = client.utilities.get('modmailReceive');
    modmail.run(client, message);
    // console.log(modmail);
  }
  try {
    if (config[message.guild.id]['modMailCategory'] === message.channel.parentID && !message.author.bot) {
      const modmail = client.utilities.get('modmailsend');
      modmail.run(client, message);
    }
  } catch (err) { }
  message.userManager = new discord.UserManager(client);
  try {
    if (message.mentions.members.has(client.user.id)) {
      var insult = (await axios.get('https://evilinsult.com/generate_insult.php?lang=en&amp;type=json')).data
      return normalEmbed(message, insult);
    }
  } catch (err) { }

  if (message.author.bot || !message.content.startsWith(process.env.PREFIX)) return;
  message.insult = (await axios.get('https://evilinsult.com/generate_insult.php?lang=en&amp;type=json')).data;
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  ////////////////////////////////////////////////////////// COMMENT THESE 3 LINES BELOW ////////////////////////////////////////////////////////////////////
  const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
  if (!command) {
    var insult = (await axios.get('https://evilinsult.com/generate_insult.php?lang=en&amp;type=json')).data
    return normalEmbed(message, insult, false, `❌ No such command!`);
  }
  else command.run(client, message, args);

  //////////////////////////////////////////////////////////// TESTING COMMANDS BELOW ///////////////////////////////////////////////////////////////////////
  // normalEmbed(message, `❌ No such command found!\n\nType \`${process.env.PREFIX}help\` to see the list of commands.`);

})