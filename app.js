const Discord = require('discord.js');

const client = new Discord.Client();

const config = require('./config.json');

let request = require('request');
const https = require('https')
// Require inside your project
var NutritionixClient = require('nutritionix');
var nutritionix = new NutritionixClient({
    appId: config.NutrID,
    appKey: config.NutrKey
    // debug: true, // defaults to false
});



const yelp = require('yelp-fusion');



const clienty = yelp.client(config.yelptoken);











client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity('On Taco Island')

});





client.on('guildMemberAdd', member => {

    // Send the message to a designated channel on a server:

    const channel = member.guild.channels.find('name', 'member-log');

    // Do nothing if the channel wasn't found on this server

    if (!channel) return;

    // Send the message, mentioning the member

    channel.send(`Welcome to the server, ${member}`);

  });

  

  

client.on('message', msg => {

 

 

 

//Wednesday 

 switch (new Date().getDay()) {

    

   case 5:

   msg.react(config.react_emoji);

       

       break;

 }


//nutritionix
if (msg.content.toUpperCase().includes('!FOOD')) {
  let FoodQry = msg.content.substring(6);
 
//console.log(msg.author.id)
// || msg.author.id === '478729351903313932'
if (FoodQry.length < 1 ){
msg.reply("Stop trying to break the app asshole")
}else{


const data = JSON.stringify({
  "query": FoodQry
})

  const options = {
    hostname: 'trackapi.nutritionix.com',
    port: 443,
    path: '/v2/natural/nutrients/',
    method: 'POST',
    
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-app-key' : config.NutrKey,
      'x-app-id': config.NutrID
     
    }
  }
  
  const req = https.request(options, res => {
  //  console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
    //  process.stdout.write(d)
      let FoodApi = JSON.parse(d)
     // console.log(FoodApi);
     if (res.statusCode == '404') {
      let message  = FoodApi.message;
      msg.reply(message);
     }else{
let message = ` ${FoodApi.foods[0].food_name} contain ${FoodApi.foods[0].nf_calories} calories per 1 serving at ${FoodApi.foods[0].serving_weight_grams} grams! \n ${FoodApi.foods[0].photo.highres}`;
msg.reply(message);
     }
      

     
    })
  })
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
}
}

// exercise
if (msg.content.toUpperCase().includes('!EXER')) {
  let exerqry = msg.content.substring(6);
//console.log(FoodQry)
var exerval = exerqry.split("|")

var splcount = (exerqry.split("|").length - 1) //4

if(splcount != 4){

  msg.reply("Please format your question correctly. Exercise|Gender|Weight|Height|Age")
    
}else{

const data = JSON.stringify({
  "query": '"'+exerval[0] +'"',
  "gender": '"'+exerval[1] +'"',
  "weight_kg": exerval[2],
  "height_cm": exerval[3],
  "age": exerval[4],
})

  const options = {
    hostname: 'trackapi.nutritionix.com',
    port: 443,
    path: '/v2/natural/exercise/',
    method: 'POST',
    
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-app-key' : config.NutrKey,
      'x-app-id': config.NutrID
     
    }
  }
  
  const req = https.request(options, res => {
  //  console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
    //  process.stdout.write(d)
      let exerapi = JSON.parse(d)
     // console.log(exerapi);
     if (res.statusCode == '404') {
      let message  = exerapi.message;
      msg.reply(message);
    
     }else{
 let message = `If you did the exercise of ${exerapi.exercises[0].name} for ${exerapi.exercises[0].duration_min} minutes, you would burn ${exerapi.exercises[0].nf_calories} calories `;
 msg.reply(message);
 
     }
      

     
    })
  })
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()

}
 

}






// YELP Food Request

    if (msg.content.toUpperCase().includes('!YELP')) {

        let state = msg.content.substring(6);

    //console.log(state);

    let city = msg.content.slice(9);

        clienty.search({

            location: state ,

            limit:'50',
            radius:'7000',

            categories: 'restaurants, All'

          }).then(response => {

            if (response.jsonBody.total == '0') {

              msg.reply('Sorry there is nothing close to you ');

              } else {

            var randomnumbey=Math.floor((Math.random()*response.jsonBody.total));
            msg.reply('Try out: '+ response.jsonBody.businesses[randomnumbey].name+ ' URL: '+ response.jsonBody.businesses[randomnumbey].url);

            }
          }).catch(e => {

            console.log(e);

          });  

       

        }

         //YELP BAR REQUEST

         if (msg.content.toUpperCase().includes('!BAR')) {

            let state = msg.content.substring(5);

        //console.log(state);

        let city = msg.content.slice(8);

            clienty.search({

                location: state ,

                limit:'50',
                radius:'2100',
                categories:'bars, All'

               

              }).then(response => {

                if (response.jsonBody.total == '0') {

                  msg.reply('Sorry there is nothing close to you ');
    
                  } else {
    
                var randomnumbey=Math.floor((Math.random()*response.jsonBody.total));
                msg.reply('Try out: '+ response.jsonBody.businesses[randomnumbey].name+ ' URL: '+ response.jsonBody.businesses[randomnumbey].url);
    
                }
              }).catch(e => {

                console.log(e);

              });  

           

            }

        //YELP BAR REQUEST

        if (msg.content.toUpperCase().includes('!CBAR')) {

            let state = msg.content.substring(6);

       // console.log(state);

        let city = msg.content.slice(9);

            clienty.search({

                location: state ,

                limit:'50',
                radius:'2100',
                categories:'bars, All',

                price:'1'

              }).then(response => {

                if (response.jsonBody.total == '0') {

                  msg.reply('Sorry there is nothing close to you ');

                  } else {

                var randomnumbey=Math.floor((Math.random()*response.jsonBody.total));
                msg.reply('Try out: '+ response.jsonBody.businesses[randomnumbey].name+ ' URL: '+ response.jsonBody.businesses[randomnumbey].url);

                }

               // console.log(randomnumbey)

                

              }).catch(e => {

                console.log(e);

              });  

           

            }

//Blizzard

if (msg.content == '!CATFACT'){
  var request=require("request");
request.get("https://catfact.ninja/fact",function(error,response,body)
{
           if(error){
                 console.log(error);
           }else{
             jsonstuff = JSON.parse(response.body);
               //  console.log(jsonstuff.fact);
                 msg.reply(" Did you know " + jsonstuff.fact)
         }
});
}



// Help Funtion

if (msg.content.toUpperCase().includes('!HELP')) {
msg.reply("``` +++ Welcome To Help +++ \n type \"!\" plus the following: \n \"FOOD\" + the food you want to get the basic nutrition information \n \"CBAR\" + your city and state (Oregon,OH) will get you the cheapest bars \n \"YELP\" + the city and state will find you a random close restaurant \n \"EXER\" followed by this delimeted list the exercise | Gender | Weight (kg) | Height (cm) | Age```")
//msg.reply('Welcome to Discord bot ``` Use !RPS "ROCK/PAPER/SCISSORS" to play```');

}






 // PONG

    if (msg.content === '!Ping') {

    msg.reply('Pong!');

  }







  // 8BALL

  if (msg.content.includes('!8ball')) {

    var randomnumber=Math.floor((Math.random()*5) + 1);

   // console.log(randomnumber)

    switch(randomnumber){

        case 5:

        msg.reply('YES!');

        break;

        case 1:

        msg.reply('No!');

        break;

        case 2:

        msg.reply('Outlook not so good!');

        break;

        case 3:

        msg.reply('Ask again later!');

        break;

        case 4:

        msg.reply('You may rely on it!');

        break;

      

    }

}






});



client.login(config.token);