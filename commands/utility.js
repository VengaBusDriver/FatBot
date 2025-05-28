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

    static handleRollCommand(msg) {
        // accept a roll command like !ROLL and number of sides, e.g., !ROLL 6
        const rollCommand = msg.content.split(' ')[1];
        const sides = parseInt(rollCommand, 10); 
        if (isNaN(sides) || sides <= 0) {
            msg.reply("Please provide a valid number of sides for the roll.");
            return;
        } else {
            const rollResult = Math.floor(Math.random() * sides) + 1;
            msg.reply(`You rolled a ${rollResult} on a ${sides}-sided die!`);
        }  
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
• !ROLL - Roll a die with a specified number of sides (e.g., !ROLL 6)
• !HELP - Show this help message
\`\`\``;
        
        msg.reply(helpMessage);
    }
}

module.exports = UtilityCommands;
