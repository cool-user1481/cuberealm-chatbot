let gambleData = JSON.parse(localStorage.getItem("gambleData")) || {};
setInterval(()=>{
    localStorage.setItem("gambleData", JSON.stringify(gambleData));
}, 10000)

// gamble function is called on every chat message recived with the argument, text, of whatever the server sends.
function gamble(text) {
    const parts = text.split(": ");
    const user = parts[0];
    const messageContents = parts.slice(1).join(": ");

    try {
        if (messageContents.startsWith("$gamble signup")) {
            gambleSignup(user, messageContents, gambleData);

        } else if (messageContents.startsWith("$gamble coinflip ")) {
            gambleCoinflip(user, messageContents, gambleData);

        } else if (messageContents.startsWith("$gamble stats")) {
            gambleStats(user, messageContents, gambleData);
           
        } else if (messageContents.startsWith("$gamble daily")) {
            gambleDaily(user, messageContents, gambleData);
            
        }
    } catch {
        //silent error discarding for like when the message does not have : in it so like no console spam plz.
    }
}

function gambleSignup(user, messageContent, gambleData) {
    if (gambleData[user]) {
        sendChat(`@${user}, Error, you have already signed up.`)
        return
    }

    gambleData[user] = {
        name: user,
        money: 100,
        upgrades: [0.5, 0, 50], //formatt: % win rate-coinflip, money gained on lost coinflip bet, money gained from daily,
        last: Math.floor(Date.now() / 1000 / 60 / 60 / 24),
    };

    console.log(JSON.stringify(gambleData))
    sendChat(`@${user}, Thank you for signing up! Your chatbucks balance is now $100.`)
}

function gambleCoinflip(user, messageContent, gambleData) {
    if (!gambleData[user]) {
        sendChat(`@${user}: Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`)
        return
    }

    const regex = /^(heads|tails) (\d+)/;
    const match = regex.exec(text.split(": $gamble coinflip ")[1]);

    if (Number(match[2]) > gambleData[user].money) {
        sendChat(`@${user} You only have $${gambleData[user].money} chatbucks, so you cannot afford that bet.`)
        return
    }

    if (Math.random() < gambleData[user].upgrades[0]) {
        gambleData[user].money += Number(match[2]);
        sendChat(`@${user}: success! It landed on ${match[1]}. You earned ${match[2]} chatbucks, bringing your total to ${gambleData[user].money}!`)
    } else {
        gambleData[user].money -= Number(match[2]);
        gambleData[user].money += Math.floor(Number(match[2]) * (gambleData[user].money / 100));

        if (gambleData[user].upgrades[1] !== 0) {
            sendChat(`Oh no! It did not land on ${match[1]} You lost ${match[2]} chatbucks, but got back ${gambleData[user].upgrades[1]}%`)
        } else {
            sendChat(`Oh no! It did not land on ${match[1]} You lost ${match[2]} chatbucks.`)
        }
    }
}

function gambleStats(user, messageContent, gambleData) {
    if (gambleData[user]) {
        sendChat(`@${user} $${gambleData[user].money} chatbucks, a ${(gambleData[user].upgrades[0]) * 100}% chance of sucess on coinflips, and you get back ${gambleData[user].upgrades[1]}% on a failed bet of over $100.`)
    } else {
        sendChat(`@${user} Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`)
    }
}

function gambleDaily(user, messageContent, gambleData) {
    if (!gambleData[user]) {
        sendChat(`@${user}: Error, you appear to not yet have a chabot gamble account. Create one with $gamble signup`)
        return
    }

    if (Math.floor(Date.now() / 1000 / 60 / 60 / 24) > gambleData[user].last) {
        gambleData[user].money += gambleData[user].upgrades[2];
        gambleData[user].last = Math.floor(Date.now() / 1000 / 60 / 60 / 24);
        sendChat(`@${user}: Gained $${gambleData[user].upgrades[2]} for daily money, come back tomorrow for more!`);
    } else {
        sendChat(`@${user}: You have already collected your daily for today, come back tomorrow`);
    }
}
