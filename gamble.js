// features is defined earlier in chatbot
// This is a workaround for setups without it
let gambleOn;
if (features)
    gambleOn = features.gamble;
else
    gambleOn = true;

let gambleData = JSON.parse(localStorage.getItem("gambleData")) || {};
setInterval(()=>{
    localStorage.setItem("gambleData", JSON.stringify(gambleData));
}, 10000);

// gamble function is called on every chat message recived with the argument, text, of whatever the server sends.
function gamble(text) {
    if(!text.includes(": $gamble")){
        return;
    }
    if(!gambleOn){
        sendChat("gamble is temporarily unavalible");
        return;
    }
    
    const parts = text.split(": ");
    const user = parts[0];
    const messageContents = parts.slice(1).join(": ").toLowerCase();
    
    switch (true){
        case messageContents.startsWith("$gamble signup"):
            gambleSignup(user, messageContents, gambleData);
            break;
        case messageContents.startsWith("$gamble coinflip "):
            gambleCoinflip(user, messageContents, gambleData);
            break;
        case messageContents.startsWith("$gamble stats"):
            gambleStats(user, messageContents, gambleData);
            break;
        case messageContents.startsWith("$gamble daily"):
            gambleDaily(user, messageContents, gambleData);
            break;
        case messageContents.startsWith("$gamble addmoney"):
            gambleAddMoney(user, messageContents, gambleData);
            break;
        case messageContents.startsWith("$gamble top") || messageContents.startsWith("$gamble lb") || messageContents.startsWith("$gamble leaderboard"):
            gambleLeaderboard(user, messageContents, gambleData);
            break;
        default:
            sendChat("error: your command is invalid. Check spelling.");
    }
}

function gambleSignup(user, messageContent, gambleData) {
    if (gambleData[user.toLowerCase()]) {
        sendChat(`@${user}, Error, you have already signed up.`);
        return;
    }

    gambleData[user.toLowerCase()] = {
        name: user,
        money: 100,
        upgrades: [0.5, 0, 50], //formatt: % win rate-coinflip, money gained on lost coinflip bet, money gained from daily,
        last: Math.floor(Date.now() / 1000 / 60 / 60 / 24),
    };
    sendChat(`@${user}, Thank you for signing up! Your chatbucks balance is now $100.`);
}

function gambleCoinflip(user, messageContent, gambleData) {
    if (!gambleData[user.toLowerCase()]) {
        sendChat(`@${user}: Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`);
        return;
    }

    const regex = /^(heads |tails |)(\d+)/;
    const match = regex.exec(messageContent.split("$gamble coinflip ")[1]);
    match[1] = match[1] || "default";

    if (Number(match[2]) > gambleData[user.toLowerCase()].money) {
        sendChat(`@${user} You only have $${gambleData[user.toLowerCase()].money} chatbuck${gambleData[user.toLowerCase()].money === "" ? "" : "s"}, so you cannot afford that bet.`);
        return;
    }

    if (Math.random() < gambleData[user.toLowerCase()].upgrades[0]) {
        gambleData[user.toLowerCase()].money += Number(match[2]);
        sendChat(`@${user}: success! It landed on ${match[1]}. You earned ${match[2]} chatbuck${match[2] === "1" ? "" : "s"}, bringing your total to ${gambleData[user.toLowerCase()].money}!`);
    } else {
        gambleData[user.toLowerCase()].money -= Number(match[2]);
        gambleData[user.toLowerCase()].money += Math.floor(Number(match[2]) * (gambleData[user.toLowerCase()].upgrades[1] / 100));

        if (gambleData[user.toLowerCase()].upgrades[1] !== 0) {
            sendChat(`Oh no! It did not land on ${match[1]} You lost ${match[2]} chatbuck${match[2] === "1" ? "" : "s"}, but got back ${gambleData[user.toLowerCase()].upgrades[1]}%`);
        } else {
            sendChat(`Oh no! It did not land on ${match[1]} You lost ${match[2]} chatbuck${match[2] === "1" ? "" : "s"}.`);
        }
    }
}

function gambleStats(user, messageContent, gambleData) {
    if (gambleData[user.toLowerCase()]) {
        sendChat(`@${user} $${gambleData[user.toLowerCase()].money} chatbuck${gambleData[user.toLowerCase()].money === 1 ? "" : "s"}, a ${(gambleData[user.toLowerCase()].upgrades[0]) * 100}% chance of sucess on coinflips, and you get back ${gambleData[user.toLowerCase()].upgrades[1]}% on a failed bet (rounds down).`);
    } else {
        sendChat(`@${user} Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`);
    }
}

function gambleDaily(user, messageContent, gambleData) {
    if (!gambleData[user.toLowerCase()]) {
        sendChat(`@${user}: Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`);
        return;
    }

    if (Math.floor(Date.now() / 1000 / 60 / 60 / 24) > gambleData[user.toLowerCase()].last) {
        gambleData[user.toLowerCase()].money += gambleData[user.toLowerCase()].upgrades[2];
        gambleData[user.toLowerCase()].last = Math.floor(Date.now() / 1000 / 60 / 60 / 24);
        sendChat(`@${user}: Gained $${gambleData[user.toLowerCase()].upgrades[2]} for daily money, come back tomorrow for more!`);
    } else {
        sendChat(`@${user}: You have already collected your daily for today, come back tomorrow`);
    }
}

function gambleAddMoney(user, messageContent, gambleData){
    if(["coolussr", "chatbot", "coolussr1481", "coolussr1482"].includes(user)){
        let parts = messageContent.trim().split(" ");
        let addTo = parts[2];
        let amount = Number(parts[3]);
        if(isNaN(amount))
        sendChat("Syntax error: NaN");
        else
        gambleData[addTo.toLowerCase()].money += amount;
    } else {
        sendChat("Authentication error: nuh uh");
    }
}

function gambleLeaderboard(user, messageContent, gambleData) {
    function getTopNames(o){
        return Object.values(gambleData)
            .sort((a, b) => b.money - a.money)
            .map(item => item.name);
    }
    let offset = 0; // Add param later
    let top5 = getTopNames().slice(offset, 5 + offset);
    let temp = `top ${offset + 1}-${offset + 5}:       `; // Note: this contains nbsp's for lines to look good
    for(let i=0; i<5; i++)
        temp += `${i + 1 + offset}. ${gambleData[top5[i].toLowerCase()].name}": $${gambleData[top5[i + offset].toLowerCase()].money}${i === 4 ? '' : '   '}`; // As does this
    sendChat(temp);
}
