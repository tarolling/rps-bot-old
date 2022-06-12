const changeName = require('../../utils/db/changeName');

module.exports = {
    data: {
        name: 'change_username',
        description: 'PREMIUM | Change your username.',
        options: [
            {
                type: 6,
                name: 'username',
                description: 'Specify the username you would like to change to.',
                required: true
            }
        ],
        default_member_permissions: (1 << 35) // 0x0000000800000000 - ability to create public threads
        // idk how else to distinguish Premium members from normal ones based on perms, its kinda stupid
    },
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await changeName(interaction);
        } catch (err) {
            console.error(err);
            return interaction.editReply({ content: 'An error occurred while trying to change your username.', ephemeral: true });
        }
    }
};