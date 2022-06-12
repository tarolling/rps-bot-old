import { Interaction } from 'discord.js';
import { footer } from '../../config/embeds';

module.exports = (interaction: Interaction) => {
    return {
        color: null,
        title: 'New Challenger Approaching',
        description: `**${interaction.user.username}** has challenged you to a game of RPS!`,
        footer
    };
};

export default module.exports;