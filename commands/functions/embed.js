const BRIGHT_RED = '#ed0909'
const BRIGHT_GREEN = '#03b500'
const discord = require('discord.js');

const richEmbed = (message, description, title, titleUrl, authorBool, thumbnailUrl, fields, color, imageUrl) => {
    let embed = new discord.MessageEmbed();
    embed.setFooter('Developed by Robot', message.guild.iconURL());
    embed.setTimestamp();
    if(authorBool) embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
    if(description) embed.setDescription(description);
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    if(thumbnailUrl) embed.setThumbnail(thumbnailUrl);
    if(fields) embed.addFields(fields);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(imageUrl) embed.setImage(imageUrl);
    return message.channel.send(embed);
};
const normalEmbed = (message, description, color, title, titleUrl) => {
    let embed = new discord.MessageEmbed();
    if(description) embed.setDescription(description);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    return message.channel.send(embed);
};
const dmEmbed = (message, description, title, titleUrl, authorBool, thumbnailUrl, fields, color, imageUrl) => {
    let embed = new discord.MessageEmbed();
    embed.setFooter('Developed by Robot', message.guild.iconURL());
    embed.setTimestamp();
    if(authorBool) embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
    if(description) embed.setDescription(description);
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    if(thumbnailUrl) embed.setThumbnail(thumbnailUrl);
    if(fields) embed.addFields(fields);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(imageUrl) embed.setImage(imageUrl);
    return embed;
};

const makeEmbed = async (description, title, titleUrl, author, authorUrl, thumbnailUrl, footer, footerUrl, fields, color, imageUrl) => {
    let embed = new discord.MessageEmbed();
    if(footer) embed.setFooter(footer, footerUrl);
    embed.setTimestamp();
    if(author) embed.setAuthor(author, authorUrl);
    if(description) embed.setDescription(description);
    if(title) embed.setTitle(title);
    if(titleUrl) embed.setURL(titleurl);
    if(thumbnailUrl) embed.setThumbnail(thumbnailUrl);
    if(fields) embed.addFields(fields);
    if(color) {embed.setColor(color);}
    else {embed.setColor("#b33030");}
    if(imageUrl) embed.setImage(imageUrl);
    return embed;
};

module.exports = {
    richEmbed,
    normalEmbed,
    dmEmbed,
    makeEmbed,
};