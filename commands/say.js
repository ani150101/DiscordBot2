

module.exports = {
    name: 'say',
    aliases: ['send'],
    description: "Send a message in specified channel",

    run: async (client, message, args) => {
        const checkPerms = (author) => author.permissions.has(['BAN_MEMBERS' || 'ADMINISTRATOR'])
        const filter = (msg) => msg.author.id === message.author.id;

        if (!checkPerms(message.member)) {
            normalEmbed(message, `❌ You dont have the permissions to use the command!`)
                .then(msg => msg.delete({ timeout: 2500 }));
            message.delete()
            return;
        }

        let sayMsg = message.content.slice(message.content.indexOf(" ")).trim();

        if (sayMsg.length < 2) {
            normalEmbed(message, `❗ Please provide a message!\n\u200B\nSyntax: \`\`${process.env.PREFIX}say <message>\`\``)
                .then(msg => msg.delete({ timeout: 2500 }));
            message.delete()
            return;
        }

        let channelPrompt = await message.channel.send("Specify a #channel you want to send the message to. 'no' to abort")
        let channelMsg = await message.channel.awaitMessages(filter, { max: 1, errors: ['time'] });

        const deleteMsgs = async () => {
            channelPrompt.delete();
            channelMsg.first().delete();
            message.delete();
        }

        if (channelMsg.first().content.toLowerCase().trim() === "NO".toLowerCase()) {
            await deleteMsgs();
            return;
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
            await channel.send(sayMsg);
            await deleteMsgs();
        } catch (err) {
            console.log(err);
            normalEmbed(message, `❗ Something very bad happened. Try again or contact Robot`)
                    .then(msg => msg.delete({ timeout: 1500 }));
            return;
        }
    }
}