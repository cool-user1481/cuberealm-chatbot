let gambleData = {};

// gamble function is called on every chat message recived with the argument, text, of whatever the server sends.
function gamble(text){
    const user = text.split(": ")[0];
    
    try{if(text.split(": ")[1].startsWith("$gamble signup")){
    
      if(!gambleData[user]){
        gambleData[user]={
            "name": user,
            "money": 100,
            "upgrades": [0.5, 0, 50], //formatt: % win rate-coinflip, money gained on lost coinflip bet, money gained from daily,
            "last": Math.floor(Date.now()/1000/60/60/24),
        };
        console.log(JSON.stringify(gambleData))
        sendChat("@"+user + ", Thank you for signing up! Your chatbucks balance is now $100.")
    }else{
        sendChat("@"+user + ", Error, you have already signed up.")
    }}
    
    if(text.split(": ")[1].startsWith("$gamble coinflip ")){
      if(gambleData[user]){
        const regex = /^(heads|tails) (\d+)/;
		const match = regex.exec(text.split(": $gamble coinflip ")[1]);
       if(Number(match[2]) <= gambleData[user].money){
           if(Math.random() < gambleData[user].upgrades[0]){
               gambleData[user].money += Number(match[2]);
               sendChat(`@${user}: success! It landed on ${match[1]}. You earned ${match[2]} chatbucks, bringing your total to ${gambleData[user].money}!`)
           } else {
               gambleData[user].money += 0-Number(match[2]);
               gambleData[user].money += Math.floor(Number(match[2]) * (gambleData[user].money / 100));
               if(gambleData[user].upgrades[1] !== 0)
               sendChat(`Oh no! It did not land on ${match[1]} You lost ${match[2]} chatbucks, but got back ${gambleData[user].upgrades[1]}%`)
               else
               sendChat(`Oh no! It did not land on ${match[1]} You lost ${match[2]} chatbucks.`)
           }
       } else {
           sendChat(`@${user} You only have $${gambleData[user].money} chatbucks, so you cannot afford that bet.`)
       }
  }else{sendChat(`@${user}: Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`)}}
    if(text.split(": ")[1].startsWith("$gamble stats")){
        if(gambleData[user]){
          sendChat(`@${user} $${gambleData[user].money} chatbucks, a ${(gambleData[user].upgrades[0]) * 100}% chance of sucess on coinflips, and you get back ${gambleData[user].upgrades[1]}% on a failed bet of over $100.`)
        } else{ sendChat(`@${user} Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`)}
        
    }
    if(text.split(": ")[1].startsWith("$gamble daily")){
        if(gambleData[user]){
          if(Math.floor(Date.now()/1000/60/60/24) > gambleData[user].last){
          gambleData[user].money += gambleData[user].upgrades[2];
          gambleData[user].last = Math.floor(Date.now()/1000/60/60/24);
          sendChat(`@${user}: Gained $${gambleData[user].upgrades[2]} for daily money, come back tomorrow for more!`);
          } else {
            sendChat(`@${user}: You have already collected your daily for today, come back tomorrow`); 
          }
        } else{ sendChat(`@${user}: Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`)}
        
    }
    } catch{} //silent error discarding for like when the message does not have : in it so like no console spam plz.
}
