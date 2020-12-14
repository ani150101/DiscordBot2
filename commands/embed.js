
const { normalEmbed } = require('../commands/functions/embed.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['emb', 'e'],
    description: "Send an embedded message in specified channel",

    run: async (client, message, args) => {
        let embed = new MessageEmbed().setColor('#b33030').setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
        const checkPerms = (author) => author.permissions.has(['BAN_MEMBERS' || 'ADMINISTRATOR'])
        const filter = (msg) => msg.author.id === message.author.id;
        if (!checkPerms(message.member)) {
            normalEmbed(message, `❌ You dont have the permissions to use the command!`)
                .then(msg => msg.delete({ timeout: 2500 }));
            message.delete()
            return;
        }

        let description = message.content.slice(message.content.indexOf(" ")).trim();
        // console.log(description);

        if (description.length < 2) {
            normalEmbed(message, `❗ Please provide a message!\n\u200B\nSyntax: \`\`${process.env.PREFIX}embed <message>\`\``)
                .then(msg => msg.delete({ timeout: 2500 }));
            message.delete()
            return;
        }

        embed.setDescription(description);
        let titlePrompt = await message.channel.send("Add a title to your embed message? Type the title or 'no' to skip");
        let titleMsg = await message.channel.awaitMessages(filter, { max: 1, errors: ['time'] });
        let channelPrompt = await message.channel.send("Specify a #channel you want to send the message to. 'no' to abort")
        let channelMsg = await message.channel.awaitMessages(filter, { max: 1, errors: ['time'] });
        const deleteMsgs = async () => {
            titlePrompt.delete();
            titleMsg.first().delete();
            channelPrompt.delete();
            channelMsg.first().delete();
            message.delete();
        }

        if (channelMsg.first().content.toLowerCase().trim() === "NO".toLowerCase()) {
            await deleteMsgs();
            return;
        }

        if (titleMsg.first().content.toLowerCase().trim() !== "NO".toLowerCase()) {
            var title = titleMsg.first().content;
            embed.setTitle(title);
        }
        
        try {

            let channelId = channelMsg.first().content.slice(2, -1);
            // console.log(channelId);
            let channel = message.guild.channels.resolve(channelId);
            if (!channel) {
                normalEmbed(message, `❗ Please provide a valid Text channel.`)
                    .then(msg => msg.delete({ timeout: 1500 }));
                await deleteMsgs();
                return;
            }
            await channel.send(embed);
            await deleteMsgs();
        } catch (err) {
            console.log(err);
            normalEmbed(message, `❗ Something very bad happened. Try again or contact Robot`)
                    .then(msg => msg.delete({ timeout: 1500 }));
            return;
        }
    }
}