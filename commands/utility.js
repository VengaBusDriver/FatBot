const request = require('request');

class UtilityCommands {
    static handlePingCommand(msg) {
        msg.reply('Pong!');
    }

    static handleEightBallCommand(msg) {
        const responses = [
            'No!',
            'Outlook not so good!',
            'Ask again later!',
            'You may rely on it!',
            'YES!'
        ];
        
        const randomIndex = Math.floor(Math.random() * responses.length);
        msg.reply(responses[randomIndex]);
    }

    static handleCatFactCommand(msg) {
        request.get("https://catfact.ninja/fact", (error, response, body) => {
            if (error) {
                console.error('Cat fact API error:', error);
                msg.reply("Sorry, couldn't fetch a cat fact right now.");
            } else {
                try {
                    const catFact = JSON.parse(response.body);
                    msg.reply(`Did you know: ${catFact.fact}`);
                } catch (parseError) {
                    console.error('Error parsing cat fact response:', parseError);
                    msg.reply("Sorry, couldn't fetch a cat fact right now.");
                }
            }
        });
    }

    static handleHelpCommand(msg) {
        const helpMessage = `\`\`\`
+++ Welcome To Help +++

Available commands:
• !FOOD <food name> - Get nutrition information for a food item
• !EXER <exercise|gender|weight(kg)|height(cm)|age> - Calculate calories burned
• !YELP <city, state> - Find a random restaurant near you
• !BAR <city, state> - Find a random bar near you  
• !CBAR <city, state> - Find a cheap bar near you
• !CATFACT - Get a random cat fact
• !8BALL <question> - Get a magic 8-ball response
• !PING - Test bot responsiveness
• !HELP - Show this help message
\`\`\``;
        
        msg.reply(helpMessage);
    }
}

module.exports = UtilityCommands;
