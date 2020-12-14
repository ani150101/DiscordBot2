const { makeEmbed, normalEmbed } = require("../functions/embed.js");
const { Client } = require("discord.js");
const { readFileSync, writeFileSync} = require('fs');
var config = JSON.parse(readFileSync('./config/config.json'));
module.exports = {
    name: 'modmailReceive',
    aliases: [],
    description: "Handles messages sent to Bot's dm channel",

    run: async (client, message) => {
        // var config = JSON.parse(readFileSync('./config/config.json'));
        // console.log();
        async function changeConfig(config) {
            writeFileSync('./config/config.json', JSON.stringify(config, null, 4))
        }

        const guild = client.guilds.cache.find(guild => guild.name.toLowerCase() === 'eaglemodz');
        const categories = guild.channels.cache.filter(channel => channel.type === 'category');
        // console.log(categories);
        let everyoneRole = guild.roles.cache.find(role => role.name.toLowerCase().includes('everyone'));
        // console.log(everyoneRole);
        var mailCategory;
        if(config[guild.id].hasOwnProperty('modMailCategory') && categories.find(category => category.id === config[guild.id]['modMailCategory'])) {
            mailCategory = config[guild.id]['modMailCategory'];
        }
        else {
            // config[guild.id]['modMailCategory'] = 'aisdjaoisdjoisijd'
            let mail = categories.find(category => category.name.toLowerCase().includes('mail'))
            if(mail) {
                config[guild.id]['modMailCategory'] = mail.id;
                // console.log(config);
                await changeConfig(config);
                mailCategory = mail.id;
            }
            else {
                await guild.channels.create('mod-mail', {
                    type: 'category', 
                    topic: 'DMs sent to bot.',
                    permissionOverwrites: [
                        {
                            id: everyoneRole.id,
                            deny: 523328,
                        },
                    ]
                }).then(created => {
                    // console.log(created.id);
                    config[guild.id]['modMailCategory'] = created.id;
                    mailCategory = created.id;
                    // console.log(config);
                    changeConfig(config);
                })
            }
        }
        // console.log(mailCategory)
        // const args = message.author.username.toLowerCase().match(/[^`!@#$%^&*()+={}|:"<>?]/)    // /[a-z0-9]+/gi
        const args = message.author.username.toLowerCase().replace(/[`!@#$%^&*()+={}|.,/:"<>?,./\s]/g, '').concat(message.author.discriminator);
        // console.log(args);
        var modChannel;
        if(await guild.channels.cache.find(channel => channel.type === 'text' && channel.name === args)) {
            modChannel = await guild.channels.cache.find(channel => channel.type === 'text' && channel.name === args)
        }
        else {
            await guild.channels.create(args, {type: 'text', parent: mailCategory, topic: `${message.author.id} - ${message.author.tag}`}).then(channel => {
                modChannel = channel;
            });
            let embed = await makeEmbed(`Type a message in this channel to reply. Messages starting with \`\\\` are ignored, and can be used for staff discussion. Type \`\`\\close <reason>\`\` to close this ticket.`, 
                `New Ticket`, false, false, false, message.author.displayAvatarURL({dynamic: true}), message.author.tag, message.author.displayAvatarURL())
            await modChannel.send(embed);
        }
        let receiveEmbed = await makeEmbed(message.content, `Message Received`, false, false, false, false, message.author.tag, message.author.displayAvatarURL())
        await modChannel.send(receiveEmbed);
        let dmEmbed = await makeEmbed(message.content, `Message Sent`, false, false, false, false, guild.name, guild.iconURL());
        await message.channel.send(dmEmbed);
    }
}