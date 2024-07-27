const { EmbedBuilder, escapeMarkdown, userMention } = require('discord.js');
const { defaultColor, footer } = require('./embed');

module.exports = (club) => {
    const { leader, name, abbreviation, members } = club;
    return new EmbedBuilder()
        .setColor(defaultColor)
        .setTitle(`[${escapeMarkdown(abbreviation)}] ${escapeMarkdown(name)}`)
        .setDescription(`Led by ${escapeMarkdown(leader.username)} (${userMention(leader.id)})`)
        .addFields(members.map(({ username, id }) => ({
            name: 'Member',
            value: `${username} (${userMention(id)})`
        })))
        .setFooter(footer);
};