const Discord = require('discord.js');
const config = require('./config.json');
const CommandHandler = require('./commands');

// Initialize Discord client
const client = new Discord.Client();

// Initialize command handler
const commandHandler = new CommandHandler(config);

// Bot ready event
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('On Taco Island');
});

// New member joined event
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find('name', 'member-log');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}!`);
});

// Message event handler
client.on('message', async msg => {
    // Ignore bot messages
    if (msg.author.bot) return;

    // Special Friday behavior (optional)
    if (new Date().getDay() === 5) {
        // You can add Friday-specific reactions here
        // msg.react(config.react_emoji);
    }

    // Handle commands
    try {
        await commandHandler.handleMessage(msg);
    } catch (error) {
        console.error('Error handling command:', error);
        msg.reply('Sorry, there was an error processing your command.');
    }
});

// Login to Discord
client.login(config.token);