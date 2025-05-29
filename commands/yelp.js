const yelp = require('yelp-fusion');
const UtilityCommands = require('./utility');

class YelpCommands {
    constructor(config) {
        this.client = yelp.client(config.yelptoken);
        this.config = config;
    }

    async handleRestaurantCommand(msg) {
        const location = msg.content.substring(6).trim();
          if (!location) {
            return UtilityCommands.replyWithRareResponse(msg, "Please provide a location (city, state).", this.config);
        }

        try {
            const response = await this.client.search({
                location: location,
                limit: 50,
                radius: 2000,
                categories: 'restaurants, All'
            });

            if (response.jsonBody.total === 0) {
                UtilityCommands.replyWithRareResponse(msg, 'Sorry, there are no restaurants close to you.', this.config);
            } else {
                const randomIndex = Math.floor(Math.random() * response.jsonBody.businesses.length);
                const business = response.jsonBody.businesses[randomIndex];
                UtilityCommands.replyWithRareResponse(msg, `Try out: ${business.name}\nURL: ${business.url}\n Image: ${business.image_url} : 'No image available`, this.config);
            }
        } catch (error) {
            console.error('Restaurant search error:', error);
            UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error finding restaurants in your area.", this.config);
        }
    }

    async handleBarCommand(msg) {
        const location = msg.content.substring(5).trim();
          if (!location) {
            return UtilityCommands.replyWithRareResponse(msg, "Please provide a location (city, state).", this.config);
        }

        try {
            const response = await this.client.search({
                location: location,
                limit: 50,
                radius: 2100,
                categories: 'bars, All'
            });

            if (response.jsonBody.total === 0) {
                UtilityCommands.replyWithRareResponse(msg, 'Sorry, there are no bars close to you.', this.config);
            } else {
                const randomIndex = Math.floor(Math.random() * response.jsonBody.businesses.length);
                const business = response.jsonBody.businesses[randomIndex];
                UtilityCommands.replyWithRareResponse(msg, `Try out: ${business.name}\nURL: ${business.url}\n Image: ${business.image_url}`, this.config);
            }
        } catch (error) {
            console.error('Bar search error:', error);
            UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error finding bars in your area.", this.config);
        }
    }

    async handleCheapBarCommand(msg) {
        const location = msg.content.substring(6).trim();
          if (!location) {
            return UtilityCommands.replyWithRareResponse(msg, "Please provide a location (city, state).", this.config);
        }

        try {
            const response = await this.client.search({
                location: location,
                limit: 50,
                radius: 2100,
                categories: 'bars, All',
                price: '1'
            });

            if (response.jsonBody.total === 0) {
                UtilityCommands.replyWithRareResponse(msg, 'Sorry, there are no cheap bars close to you.', this.config);
            } else {
                const randomIndex = Math.floor(Math.random() * response.jsonBody.businesses.length);
                const business = response.jsonBody.businesses[randomIndex];
                UtilityCommands.replyWithRareResponse(msg, `Try out: ${business.name}\nURL: ${business.url}`, this.config);
            }
        } catch (error) {
            console.error('Cheap bar search error:', error);
            UtilityCommands.replyWithRareResponse(msg, "Sorry, there was an error finding cheap bars in your area.", this.config);
        }
    }
}

module.exports = YelpCommands;
