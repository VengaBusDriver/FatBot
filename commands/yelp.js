const yelp = require('yelp-fusion');

class YelpCommands {
    constructor(config) {
        this.client = yelp.client(config.yelptoken);
    }

    async handleRestaurantCommand(msg) {
        const location = msg.content.substring(6).trim();
        
        if (!location) {
            return msg.reply("Please provide a location (city, state).");
        }

        try {
            const response = await this.client.search({
                location: location,
                limit: 50,
                radius: 2000,
                categories: 'restaurants, All'
            });

            if (response.jsonBody.total === 0) {
                msg.reply('Sorry, there are no restaurants close to you.');
            } else {
                const randomIndex = Math.floor(Math.random() * response.jsonBody.businesses.length);
                const business = response.jsonBody.businesses[randomIndex];
                msg.reply(`Try out: ${business.name}\nURL: ${business.url}\n Image: ${business.image_url} : 'No image available`);
            }
        } catch (error) {
            console.error('Restaurant search error:', error);
            msg.reply("Sorry, there was an error finding restaurants in your area.");
        }
    }

    async handleBarCommand(msg) {
        const location = msg.content.substring(5).trim();
        
        if (!location) {
            return msg.reply("Please provide a location (city, state).");
        }

        try {
            const response = await this.client.search({
                location: location,
                limit: 50,
                radius: 2100,
                categories: 'bars, All'
            });

            if (response.jsonBody.total === 0) {
                msg.reply('Sorry, there are no bars close to you.');
            } else {
                const randomIndex = Math.floor(Math.random() * response.jsonBody.businesses.length);
                const business = response.jsonBody.businesses[randomIndex];
                msg.reply(`Try out: ${business.name}\nURL: ${business.url}\n Image: ${business.image_url} : 'No image available`);
            }
        } catch (error) {
            console.error('Bar search error:', error);
            msg.reply("Sorry, there was an error finding bars in your area.");
        }
    }

    async handleCheapBarCommand(msg) {
        const location = msg.content.substring(6).trim();
        
        if (!location) {
            return msg.reply("Please provide a location (city, state).");
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
                msg.reply('Sorry, there are no cheap bars close to you.');
            } else {
                const randomIndex = Math.floor(Math.random() * response.jsonBody.businesses.length);
                const business = response.jsonBody.businesses[randomIndex];
                msg.reply(`Try out: ${business.name}\nURL: ${business.url}`);
            }
        } catch (error) {
            console.error('Cheap bar search error:', error);
            msg.reply("Sorry, there was an error finding cheap bars in your area.");
        }
    }
}

module.exports = YelpCommands;
