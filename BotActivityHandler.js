const {ActivityHandler,CardFactory}=require('botbuilder');
const {dialogAccessor}=require('./Dialogs/constants/DialogIds');

class BotActivityHandler extends ActivityHandler{
    constructor(ConversationState,rootDialog){
        super();
        //checking that all objects are present or not
        if(!ConversationState) throw new Error('Conversation State Required');

        //intializing
        this.ConversationState=ConversationState;
        this.rootDialog=rootDialog;

        this.accessor=this.ConversationState.createProperty(dialogAccessor);


        //When user sends the msg
        this.onMessage(async(context,next)=>{

           await this.rootDialog.run(context,this.accessor);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        })


        //when new members are added
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity({
                        attachments:[ CardFactory.adaptiveCard(
                            {
                                "type": "AdaptiveCard",
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                "version": "1.0",
                                "body": [
                                    {
                                        "type": "Container",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://cliply.co/wp-content/uploads/2019/05/371905140_MEET_ROBOT_400px.gif"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Welcome,User i am your personal assistant.i can help you with leave application request.Type help to know all my features.how may i help you.",
                                        "wrap": true,
                                        "size": "Medium",
                                        "weight": "Bolder",
                                        "color": "Accent"
                                    }
                                ]
                            }
                        )]
                    });
                }
            }
            await context.sendActivity({
                attachments:[
                    CardFactory.heroCard('Here are the Suggestions that you can try',null,CardFactory.actions([
                        {
                            type:'imBack',
                            title:'Apply leave',
                            value:'Apply leave'
                        },
                        {
                            type:'imBack',
                            title:'leave status',
                            value:'leave status'
                        },
                        {
                            type:'imBack',
                            title:'Help',
                            value:'Help'
                        }

                    ]))
                ]
            });
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
   
    async run(context){
        await super.run(context);
        await this.ConversationState.saveChanges(context,false);
    }
}
module.exports.BotActivityHandler=BotActivityHandler;