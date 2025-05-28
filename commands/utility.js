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
    }    static handleHelpCommand(msg) {        const helpMessage = `\`\`\`
+++ Welcome To Help +++

Available commands:
• !FOOD <food name> - Get nutrition information for a food item
• !EXER <exercise|gender|weight(kg)|height(cm)|age> - Calculate calories burned
• !YELP <city, state> - Find a random restaurant near you
• !BAR <city, state> - Find a random bar near you  
• !CBAR <city, state> - Find a cheap bar near you
• !WEATHER <location> - Get current weather information for a location
• !QUOTE - Get a random inspirational quote (posts to #quotes channel)
• !URBAN <term> - Get Urban Dictionary definition for a term
• !URBANRANDOM - Get a random Urban Dictionary definition
• !CATFACT - Get a random cat fact
• !8BALL <question> - Get a magic 8-ball response
• !PING - Test bot responsiveness
• !ROLL - Roll a die with a specified number of sides (e.g., !ROLL 6)
• !HELP - Show this help message
\`\`\``;
        
        msg.reply(helpMessage);
    }

    static handleWeatherCommand(msg, config) {
        const location = msg.content.substring(9).trim(); // Remove "!WEATHER " from the command
        
        if (!location) {
            return msg.reply("Please provide a location. Example: !WEATHER New York");
        }

        const weatherUrl = `${config.WeatherAPIURL}?key=${config.WeatherAPIKey}&q=${encodeURIComponent(location)}&aqi=no`;

        request.get(weatherUrl, (error, response, body) => {
            if (error) {
                console.error('Weather API error:', error);
                msg.reply("Sorry, couldn't fetch weather information right now.");
            } else {
                try {
                    const weatherData = JSON.parse(body);
                    
                    if (weatherData.error) {
                        msg.reply(`Weather error: ${weatherData.error.message}`);
                        return;
                    }

                    const current = weatherData.current;
                    const location = weatherData.location;
                    
                    const weatherMessage = `🌤️ **Current Weather for ${location.name}, ${location.region}, ${location.country}**\n` +
                        `🌡️ **Temperature:** ${current.temp_c}°C (${current.temp_f}°F)\n` +
                        `☁️ **Condition:** ${current.condition.text}\n` +
                        `💨 **Wind:** ${current.wind_kph} km/h (${current.wind_mph} mph) ${current.wind_dir}\n` +
                        `💧 **Humidity:** ${current.humidity}%\n` +
                        `👁️ **Visibility:** ${current.vis_km} km (${current.vis_miles} miles)\n` +
                        `🕒 **Local Time:** ${location.localtime}`;                    msg.reply(weatherMessage);
                } catch (parseError) {
                    console.error('Error parsing weather response:', parseError);
                    msg.reply("Sorry, couldn't parse weather information.");
                }
            }
        });
    }

    static handleTheListCommand(msg) {
        // Try to find the quotes channel
        const quotesChannel = msg.guild.channels.cache.find(channel => 
            channel.name === 'the-list' && channel.type === 'text'
        );
        
        if (!quotesChannel) {
            return msg.reply("No the-list channel found! Please create a #quotes channel first.");
        }

        // Fetch messages from the quotes channel
        quotesChannel.messages.fetch({ limit: 100 })
            .then(messages => {
                // Filter out bot messages and empty messages
                const userMessages = messages.filter(message => 
                    !message.author.bot && message.content.trim().length > 0
                );
                
                if (userMessages.size === 0) {
                    return msg.reply("No quotes found in the #quotes channel! Add some messages there first.");
                }
                
                // Get a random message
                const randomMessage = userMessages.random();
                
                // Format and send the quote
                const quoteMessage = `💭 **Random Slur from #the-list**\n\n"${randomMessage.content}"\n\n*— ${randomMessage.author.username}* (${randomMessage.createdAt.toDateString()})`;
                
                msg.reply(quoteMessage);
            })            .catch(error => {
                console.error('Error fetching messages from quotes channel:', error);
                msg.reply("Sorry, couldn't fetch quotes from the channel right now.");
            });
    }


      static handleQuoteCommand(msg) {
        // Try to find the quotes channel
        const quotesChannel = msg.guild.channels.cache.find(channel => 
            channel.name === 'quotes' && channel.type === 'text'
        );
        
        if (!quotesChannel) {
            return msg.reply("No quotes channel found! Please create a #quotes channel first.");
        }

        // Fetch messages from the quotes channel
        quotesChannel.messages.fetch({ limit: 100 })
            .then(messages => {
                // Filter out bot messages and empty messages
                const userMessages = messages.filter(message => 
                    !message.author.bot && message.content.trim().length > 0
                );
                
                if (userMessages.size === 0) {
                    return msg.reply("No quotes found in the #quotes channel! Add some messages there first.");
                }
                
                // Get a random message
                const randomMessage = userMessages.random();
                
                // Format and send the quote
                const quoteMessage = `💭 **Random Quote from #Quotes**\n\n"${randomMessage.content}"\n\n*— ${randomMessage.author.username}* (${randomMessage.createdAt.toDateString()})`;
                
                msg.reply(quoteMessage);
            })            .catch(error => {
                console.error('Error fetching messages from quotes channel:', error);
                msg.reply("Sorry, couldn't fetch quotes from the channel right now.");
            });
    }

    static handleUrbanCommand(msg) {
        const term = msg.content.substring(7).trim(); // Remove "!URBAN " from command
        
        let apiUrl;
        if (term) {
            apiUrl = `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`;
        } else {
            return msg.reply("Please provide a term to look up. Example: !URBAN javascript");
        }
        
        request.get(apiUrl, (error, response, body) => {
            if (error) {
                console.error('Urban Dictionary API error:', error);
                msg.reply("Sorry, couldn't fetch definition right now.");
                return;
            }
            
            try {
                const data = JSON.parse(body);
                if (data.list && data.list.length > 0) {
                    const definition = data.list[0];
                    
                    // Clean up and truncate long definitions
                    let def = definition.definition.replace(/\[|\]/g, ''); // Remove brackets
                    if (def.length > 400) {
                        def = def.substring(0, 400) + "...";
                    }
                    
                    let example = definition.example ? definition.example.replace(/\[|\]/g, '') : 'No example provided';
                    if (example.length > 200) {
                        example = example.substring(0, 200) + "...";
                    }
                    
                    const urbanMessage = `📚 **${definition.word}**\n\n` +
                        `**Definition:** ${def}\n\n` +
                        `**Example:** ${example}\n\n`;
                    
                    msg.reply(urbanMessage);
                } else {
                    msg.reply(`No definition found for "${term}". Try a different term or check your spelling.`);
                }
            } catch (parseError) {
                console.error('Error parsing Urban Dictionary response:', parseError);
                msg.reply("Sorry, couldn't parse the definition.");
            }
        });
    }

    static handleUrbanRandomCommand(msg) {
        const apiUrl = 'https://api.urbandictionary.com/v0/random';
        
        request.get(apiUrl, (error, response, body) => {
            if (error) {
                console.error('Urban Dictionary API error:', error);
                msg.reply("Sorry, couldn't fetch a random definition right now.");
                return;
            }
            
            try {
                const data = JSON.parse(body);
                if (data.list && data.list.length > 0) {
                    const definition = data.list[0];
                    
                    // Clean up and truncate long definitions
                    let def = definition.definition.replace(/\[|\]/g, ''); // Remove brackets
                    if (def.length > 400) {
                        def = def.substring(0, 400) + "...";
                    }
                    
                    let example = definition.example ? definition.example.replace(/\[|\]/g, '') : 'No example provided';
                    if (example.length > 200) {
                        example = example.substring(0, 200) + "...";
                    }
                    
                    const urbanMessage = `🎲 **Random Urban Dictionary Definition**\n\n` +
                        `📚 **${definition.word}**\n\n` +
                        `**Definition:** ${def}\n\n` +
                        `**Example:** ${example}\n\n`; 

                    msg.reply(urbanMessage);
                } else {
                    msg.reply("Couldn't fetch a random definition right now. Try again later.");
                }
            } catch (parseError) {
                console.error('Error parsing Urban Dictionary response:', parseError);
                msg.reply("Sorry, couldn't parse the definition.");
            }
        });
    }
}

module.exports = UtilityCommands;
