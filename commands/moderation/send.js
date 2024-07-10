const ranksObj = require('../../config/ranks.json');
const { ranksEmbed } = require('../../src/utils/embeds');


module.exports = {
    data: {
        name: 'send',
        description: 'Sends information embeds.',
        options: [],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        const { guild } = interaction;

        const infoChannel = guild.channels.cache.find(c => c.name === 'info');

        try {
            await interaction.deferReply({ ephemeral: true });
            for (const rank in ranksObj) {
                await infoChannel.send({ embeds: [ranksEmbed(rank, ranksObj[rank])] });
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to send the embed.', ephemeral: true });
        }

        return interaction.editReply({ content: 'The embeds have been sent.', ephemeral: true });
    }
};