const { serverRules } = require('../../utils/embeds');

module.exports = {
    data: {
        name: 'send',
        description: 'Sends an embed.',
        options: [],
        default_member_permissions: (1 << 3) // 0x0000000000000008 - admin
    },
    async execute(interaction) {
        const rulesChannel = interaction.guild.channels.cache.find(c => c.name === 'rules');
        try {
            await rulesChannel.send({ embeds: [serverRules()] });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: 'An error occurred while trying to send the embed.', ephemeral: true });
        }

        return interaction.reply({ content: 'The embed has been sent.', ephemeral: true });
    }
};