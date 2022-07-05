const { ranks, serverRules } = require('../../utils/embeds');
const ranksObj = require('../../config/ranks.json');


module.exports = {
    data: {
        name: 'send',
        description: 'Sends information embeds.',
        options: [],
        default_member_permissions: (1 << 3) // ADMINISTRATOR
    },
    async execute(interaction) {
        const { guild } = interaction;

        const rulesChannel = guild.channels.cache.find(c => c.name === 'rules');
        const infoChannel = guild.channels.cache.find(c => c.name === 'info');

        try {
            await interaction.deferReply({ ephemeral: true });
            await rulesChannel.send({ embeds: [serverRules()] });
            for (const rank in ranksObj) {
                await infoChannel.send({ embeds: [ranks(rank, ranksObj[rank])] });
            }
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to send the embed.', ephemeral: true });
        }

        return interaction.editReply({ content: 'The embeds have been sent.', ephemeral: true });
    }
};