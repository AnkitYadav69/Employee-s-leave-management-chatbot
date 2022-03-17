
const {ComponentDialog,WaterfallDialog,DialogTurnStatus,DialogSet}=require('botbuilder-dialogs');
const {rootDialog,parseMessageWF,helpDialog,applyLeaveDialog,leaveStatus}=require('./constants/DialogIds');
const {ApplyLeaveDialog,HelpDialog,LeaveStatus}=require('./requireDialog');


class RootDialog extends ComponentDialog{
    constructor(conversationstate){
        super(rootDialog);
        if(!conversationstate) throw new Error('Conversation state is not present in Root Dialog');
        this.conversationstate=conversationstate;
      
        this.addDialog(new WaterfallDialog(parseMessageWF,[
            this.routeMessage.bind(this),
            this.Message.bind(this)
        ]));

        this.addDialog(new HelpDialog(conversationstate));
        this.addDialog(new LeaveStatus());
        this.addDialog(new ApplyLeaveDialog(conversationstate));
        this.initialDialogId=parseMessageWF;
    }
    async run(context,accessor){
        try{
            const dialogSet=new DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext= await dialogSet.createContext(context);
            const results=await dialogContext.continueDialog();

            if(results && results.status===DialogTurnStatus.empty)
            {
               await dialogContext.beginDialog(this.id);
            }
            else{
                console.log("Dialog stack is empty");
            }
        }
        catch(err){
            console.log(err);
        }
    }
    async routeMessage(stepContext){
    
       
        switch(stepContext.context.activity.text.toLowerCase())
        {
            case 'apply leave':
                return await stepContext.beginDialog(applyLeaveDialog);

            case 'leave status':
                return await stepContext.beginDialog(leaveStatus);
            case 'help':
               return await stepContext.beginDialog(helpDialog);
                
            default:
                await stepContext.context.sendActivity('sorry i am stilling learning can you please refresh your query');
        }
       return await stepContext.next();
    }
    async Message(stepContext){
        console.log(stepContext.result);
        return await stepContext.endDialog();
    }
}
module.exports.RootDialog=RootDialog;