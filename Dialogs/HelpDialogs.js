const {ComponentDialog,WaterfallDialog}=require('botbuilder-dialogs');
const {helpDialog,helpDialogWF1}=require('./constants/DialogIds');
const {CardFactory}=require('botbuilder');


class HelpDialog extends ComponentDialog{
    constructor(conversationstate){
        super(helpDialog);
        if(!conversationstate) throw new Error('Conversation State Required');
        this.conversationstate=conversationstate;
        this.addDialog(new WaterfallDialog(helpDialogWF1,[
            this.sendHelpSuggestions.bind(this)
        ]))
        this.initialDialogId=helpDialogWF1;
    }
    async sendHelpSuggestions(stepContext){
        await stepContext.context.sendActivity('I can help you with your application request.click Apply Leave button below or type Apply leave');
        await stepContext.context.sendActivity({
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
        return await stepContext.endDialog();
    }
}
module.exports.HelpDialog=HelpDialog;