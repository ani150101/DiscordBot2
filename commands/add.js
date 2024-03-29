
const { BRIGHT_RED, BRIGHT_GREEN, richEmbed, normalEmbed, dmEmbed } = require('../commands/functions/embed.js');

module.exports = {
    name: 'add',
    aliases: ['a', 'addrole', 'roleadd', 'promote'],
    description: "Adds a role to the user mentioned",

    run: async (client, message, args) => {
        const checkMemberPermissions = (member) => member.permissions.has('ADMINISTRATOR') || member.permissions.has('MANAGE_ROLES') || message.author.id === '426234414255570959';
        if(!checkMemberPermissions(message.member)) {
            normalEmbed(message, `:x: Missing Permissions.\n*${message.insult}*`, BRIGHT_RED);
            return;
        }
        let role, roleId;
        let roleArgs = message.content.substring(message.content.indexOf(' ')+1, message.content.lastIndexOf(' '));
        let { cache } = message.guild.roles;
        try {
            if(roleArgs.startsWith('<')) {
                roleId = roleArgs = roleArgs.match(/\d+/)[0];
                role = cache.find(role => role.id === roleArgs);
            }
            else {
                role = cache.find(role => role.name.toLowerCase() === roleArgs);
                roleId = role.id;
            }
        } catch (err) {
            // console.log(err);
            normalEmbed(message, `:x: Wrong usage of command! \n\u200B\nSyntax: \`\`${process.env.PREFIX}add <role name/mention> <@member>\`\``, BRIGHT_RED); // Please refer to ${process.env.PREFIX}help.
            return;
        }
        
        
        let member = message.mentions.members.first(); //message.mentions.members.find(member => member.roles.add(role).catch(err => console.log(err)));
        if(!member) {
            normalEmbed(message, `:x: Wrong usage of command! \n\u200B\nSyntax: \`\`${process.env.PREFIX}add <role name/mention> <@member>\`\``, BRIGHT_RED);
            return;
        }
        if(role) {
            if(message.member.roles.highest.position <= role.position) {
                normalEmbed(message, `:x: You cannot add <@&${roleId}> role!\n*${message.insult}*`, BRIGHT_RED);
                return;
            }
            if(member.roles.cache.has(role.id)) {
                normalEmbed(message, `<@!${member.id}> already has <@&${roleId}> role!`, BRIGHT_RED);
                return;
            }
            else {
                member.roles.add(role)
                    .then(memb => normalEmbed(message, `:white_check_mark: <@&${roleId}> role added!`, BRIGHT_GREEN))
                    .catch(err => {
                        normalEmbed(message, ":exclamation: Missing permissions!", BRIGHT_RED);
                        return;
                    })
            }
        }
        else {
            normalEmbed(message, ":exclamation: Role does not exist!", BRIGHT_RED);
            return;
        }
    }
}