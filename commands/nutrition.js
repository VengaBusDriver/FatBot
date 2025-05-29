const https = require('https');
const UtilityCommands = require('./utility');

class NutritionCommands {
    constructor(config) {
        this.config = config;
    }

    async handleFoodCommand(msg) {
        const foodQuery = msg.content.substring(6).trim();
          if (foodQuery.length < 1) {
            return UtilityCommands.replyWithRareResponse(msg, "Please provide a food item to search for.", this.config);
        }

        try {
            const data = JSON.stringify({
                "query": foodQuery
            });

            const options = {
                hostname: 'trackapi.nutritionix.com',
                port: 443,
                path: '/v2/natural/nutrients/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'x-app-key': this.config.NutrKey,
                    'x-app-id': this.config.NutrID
                }
            };

            const req = https.request(options, res => {
                let responseData = '';
                
                res.on('data', chunk => {
                    responseData += chunk;
                });

                res.on('end', () => {                    try {
                        const foodApi = JSON.parse(responseData);
                        
                        if (res.statusCode === 404) {
                            UtilityCommands.replyWithRareResponse(msg, foodApi.message || "Food not found.", this.config);
                        } else if (foodApi.foods && foodApi.foods.length > 0) {
                            const food = foodApi.foods[0];
                            const pic = food.photo?.highres || "No picture available";
                            const message = `${food.food_name} contains ${food.nf_calories} calories per ${food.serving_qty} serving(s) at ${food.serving_weight_grams} grams!\n${pic}`;
                            UtilityCommands.replyWithRareResponse(msg, message, this.config);
                        } else {
                            UtilityCommands.replyWithRareResponse(msg, "No nutrition information found for that food.", this.config);
                        }
                    } catch (error) {
                        console.error('Error parsing food API response:', error);
                        UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error processing the food information.", this.config);
                    }
                });
            });            req.on('error', error => {
                console.error('Food API request error:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error retrieving food information.", this.config);
            });

            req.write(data);
            req.end();
        } catch (error) {
            console.error('Food command error:', error);
            UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error processing your request.", this.config);
        }
    }

    async handleExerciseCommand(msg) {
        const exerciseQuery = msg.content.substring(6).trim();
        const exerciseValues = exerciseQuery.split("|");
          if (exerciseValues.length !== 5) {
            return UtilityCommands.replyWithRareResponse(msg, "Please format your question correctly: Exercise|Gender|Weight(kg)|Height(cm)|Age", this.config);
        }

        try {
            const data = JSON.stringify({
                "query": exerciseValues[0].trim(),
                "gender": exerciseValues[1].trim(),
                "weight_kg": parseFloat(exerciseValues[2].trim()),
                "height_cm": parseFloat(exerciseValues[3].trim()),
                "age": parseInt(exerciseValues[4].trim())
            });

            const options = {
                hostname: 'trackapi.nutritionix.com',
                port: 443,
                path: '/v2/natural/exercise/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'x-app-key': this.config.NutrKey,
                    'x-app-id': this.config.NutrID
                }
            };

            const req = https.request(options, res => {
                let responseData = '';
                
                res.on('data', chunk => {
                    responseData += chunk;
                });

                res.on('end', () => {                    try {
                        const exerciseApi = JSON.parse(responseData);
                        
                        if (res.statusCode === 404 || !exerciseApi.exercises || exerciseApi.exercises.length === 0) {
                            UtilityCommands.replyWithRareResponse(msg, "That's not a valid exercise. Please try again.", this.config);
                        } else {
                            const exercise = exerciseApi.exercises[0];
                            const message = `If you did ${exercise.name} for ${exercise.duration_min} minutes, you would burn ${exercise.nf_calories} calories.`;
                            UtilityCommands.replyWithRareResponse(msg, message, this.config);
                        }
                    } catch (error) {
                        console.error('Error parsing exercise API response:', error);
                        UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error processing the exercise information.", this.config);
                    }
                });
            });            req.on('error', error => {
                console.error('Exercise API request error:', error);
                UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error retrieving exercise information.", this.config);
            });

            req.write(data);
            req.end();
        } catch (error) {
            console.error('Exercise command error:', error);
            UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error processing your request.", this.config);
        }
    }
}

module.exports = NutritionCommands;
