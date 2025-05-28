const NutritionCommands = require('./nutrition');
const YelpCommands = require('./yelp');
const UtilityCommands = require('./utility');

class CommandHandler {
    constructor(config) {
        this.nutrition = new NutritionCommands(config);
        this.yelp = new YelpCommands(config);
    }

    async handleMessage(msg) {
        const content = msg.content.toUpperCase();

        // Nutrition commands
        if (content.includes('!FOOD')) {
            await this.nutrition.handleFoodCommand(msg);
            return;
        }

        if (content.includes('!EXER')) {
            await this.nutrition.handleExerciseCommand(msg);
            return;
        }

        // Yelp commands
        if (content.includes('!YELP')) {
            await this.yelp.handleRestaurantCommand(msg);
            return;
        }

        if (content.includes('!BAR') && !content.includes('!CBAR')) {
            await this.yelp.handleBarCommand(msg);
            return;
        }

        if (content.includes('!CBAR')) {
            await this.yelp.handleCheapBarCommand(msg);
            return;
        }

        // Utility commands
        if (content === '!PING') {
            UtilityCommands.handlePingCommand(msg);
            return;
        }

        if (content.includes('!8BALL')) {
            UtilityCommands.handleEightBallCommand(msg);
            return;
        }

        if (content === '!CATFACT') {
            UtilityCommands.handleCatFactCommand(msg);
            return;
        }

        if (content.includes('!ROLL')) {
            UtilityCommands.handleRollCommand(msg);
            return;
        }

        if (content.includes('!HELP')) {
            UtilityCommands.handleHelpCommand(msg);
            return;
        }
    }
}

module.exports = CommandHandler;
