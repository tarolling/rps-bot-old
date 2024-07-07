const changeName = require('../../src/db/changeName');


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
        default_member_permissions: (1 << 35) // CREATE_PUBLIC_THREADS
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