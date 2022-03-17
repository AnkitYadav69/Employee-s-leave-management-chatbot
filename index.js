//Requiring Modules

const restify=require('restify');
const path =require('path');
const {BotActivityHandler}=require('./BotActivityHandler');
const {BotFrameworkAdapter,ConversationState,MemoryStorage}=require('botbuilder');
const {RootDialog}=require('./Dialogs/RootDialog');

//dotenv setup
const dotenv=require('dotenv');
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

//Adapter setup
const adapter = new BotFrameworkAdapter({
    appID: '',
    appPassword:''
});

//onTurnError Method
adapter.onTurnError=async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

//Creating Server
const server = restify.createServer();
server.listen(process.env.Port || process.env.port || 3978,()=>{
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});
//Storage
const ms=new MemoryStorage();
const cs=new ConversationState(ms);

//Root Dialog
const rootDialog=new RootDialog(cs);

//ActivityHandler
const mainbot=new BotActivityHandler(cs,rootDialog);


server.post('/api/messages',(req,res)=>{
    adapter.processActivity(req,res,async (context)=>{
        await mainbot.run(context);
    })
})