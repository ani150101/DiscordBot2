
const { richEmbed, normalEmbed } = require('./functions/embed.js');

module.exports = {
    name: 'user',
    aliases: ['userinfo', 'whois', 'info'],
    description: "Displays information about a user in the server",

    run: async (client, message, args) => {
        let user;
        let userFields;
        const userInfoEmbed = (user, message) => {
            let createdDate = `${user.user.createdAt.toDateString().substring(4)}`;
            let joinedDate = `${user.joinedAt.toDateString().substring(4)}`;
            let activities = user.presence.activities[0];
            let presence = () => {
                let arr = new Array();
                try {
                    (user.presence.clientStatus.desktop)?arr.push('Desktop'):false;
                    (user.presence.clientStatus.mobile)?arr.push('Mobile'):false;
                    (user.presence.clientStatus.web)?arr.push('Web'):false;
                    return arr;
                } catch (err) {}};

                userFields = [
                    {name: 'ID', value: user.user.id, inline: false},
                    {name: 'Nickname', value: (user.nickname)?user.nickname:'None set', inline: false},
                    {name: 'Presence', value: presence()?presence().toString():'None', inline: true},
                    {name: 'Status', value: user.presence.status, inline: true},
                    {name: 'Highest Role', value: user.roles.highest.toString(), inline: false}, 
                    {name: 'Created', value: createdDate, inline: true},
                    {name: 'Joined', value: joinedDate, inline: true},  
                ]
            if(activities) {
                activityType = activities.type.charAt(0) + activities.type.toLowerCase().slice(1); //Capitalize
                if(activities.details) {
                    if(activities.state) userFields.push({name: `${activityType} ${activities.name}`, value: `${activities.details}, ${activities.state}`, inline: false})
                    else userFields.push({name: `${activityType} ${activities.name}`, value: activities.details, inline: false})
                }
                else userFields.push({name: `${activityType} ${activities.name}`, value: '\u200B', inline: false});
            }
            richEmbed(message, `<@!${user.user.id}> (${user.user.tag})`,false, false, true, user.user.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}), userFields);
        };

        if(!args[0]) {
            user = message.member;
            userInfoEmbed(user, message);
            return;
        }

        if(args[0].match(/\d+/g) && (args[0].search(/[a-z]/i) < 0) && !args[0].includes('<')) {
            user = message.guild.members.resolve(args[0]);
            if(!user) {
                normalEmbed(message, `:exclamation: Please provide a valid 18-digit User ID (from this server)`);
                return;
            }
            userInfoEmbed(user, message);
        }
        else if(message.mentions.members.first()) {
            user = message.mentions.members.first();
            userInfoEmbed(user, message);
        }
    }
}