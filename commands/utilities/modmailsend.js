const { makeEmbed } = require("../functions/embed.js");
const { Client, MessageFlags } = require("discord.js");
const { readFileSync, writeFileSync} = require('fs');
var config = JSON.parse(readFileSync('./config/config.json'));
module.exports = {
    name: 'modmailsend',
    aliases: [],
    description: "Sends messages to ModMail user",

    run: async (client, message) => {
        const userId = message.channel.topic.split(' - ')[0];
        // var user;
        const user = await message.guild.members.fetch(userId);
        // console.log(user);

        try {
            if(message.content.startsWith(`\\close`)) {
                let reason = message.content.split(/ +/).splice(1).join(' ');
                // console.log(reason);
                let embed = await makeEmbed(reason, `Ticket Closed`, false, message.author.username, message.author.displayAvatarURL(), false, message.guild.name, message.guild.iconURL());
                user.send(embed).then(async function() {
                   await message.channel.delete(`Reason: ${reason}`)
                })
            }
            else if (message.content.startsWith(`\\`)) {
                return;
            }
            else {
                let reply = message.content;
                let embed = await makeEmbed(reply, `Message Received`, false, message.author.tag, message.author.displayAvatarURL(), false, message.guild.name, message.guild.iconURL());
                user.send(embed).then(async function () {
                    let embed = await makeEmbed(reply, `Message Sent`, false, message.author.username, message.author.displayAvatarURL(), false, user.tag, user.user.displayAvatarURL());
                    await message.channel.send(embed).then(async() => await message.delete());
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
}