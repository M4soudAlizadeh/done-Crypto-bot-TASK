const Telegraf = require("telegraf");
const bot = new Telegraf("2010615183:AAEYkSXCLQSVOJLdSPECaknUMrT0GHh2y8U");
const axios = require("axios");

const apiKey =
  "eb8b2b714c214d17ebe25fa22050fed7c0f1afbd49417da3e82bfdf625d73126";

bot.command("start", (ctx) => {
  sendStartMessage(ctx);
});

bot.action("start", (ctx) => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
});

function sendStartMessage(ctx) {
  const startMessage = "Welcome, this bot give you Cryptocurrency information";
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Crypto Prices", callback_data: "price" }],
        [{ text: "CoinMarketCap", url: "https://www.coinmarketcap.com/" }],
        [{ text: "Bot info", callback_data: "info" }],
      ],
    },
  });
}

bot.action("price", (ctx) => {
  const priceMessage =
    "Get price information. Select one of the Cryptocurrencies below";
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BTC", callback_data: "price-BTC" },
          { text: "ETH", callback_data: "price-ETH" },
        ],
        [
          { text: "BCH", callback_data: "price-BCH" },
          { text: "LTC", callback_data: "price-LTC" },
        ],
        [{ text: "Back to Menu", callback_data: "start" }],
      ],
    },
  });
});

let priceActionList = ["price-BTC", "price-ETH", "price-BCH", "price-LTC"];
bot.action(priceActionList, async (ctx) => {
  let symbol = ctx.match.split("-")[1];
  try {
    const res = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`
    );
    let data = res.data.DISPLAY[symbol].USD;

    let message = `
    symbol: ${symbol}
    Price: ${data.PRICE}
    Open: ${data.OPENDAY}
    High: ${data.HIGHDAY}
    Low: ${data.LOWDAY}
    Supply: ${data.SUPPLY}
    Market Cap: ${data.MKTCAP}
    `;

    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: [[{ text: "Back to Price", callback_data: "price" }]],
      },
    });
  } catch (err) {
    ctx.reply("Error Encountered");
  }
});

bot.action("info", (ctx) => {
  ctx.answerCbQuery();
  bot.telegram.sendMessage(ctx.chat.id, "Bot info", {
    reply_markup: {
      keyboard: [
        [{ text: "Credits" }, { text: "API" }],
        [{ text: "Remove keyboard" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});
bot.hears("Remove keyboard", (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, "Remove keyboard", {
    reply_markup: { remove_keyboard: true },
  });
});
bot.hears("Credits", (ctx) => {
  ctx.reply("this bot was make");
});
bot.hears("API", (ctx) => {
  ctx.reply("this bot uses Cryptocompare API");
});
// bot.command("test", (ctx) => {
//   bot.telegram.sendMessage(ctx.chat.id, "Main menu", {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: "See Fruits list", callback_data: "fruits" }],
//         [{ text: "See Meats list", callback_data: "meats" }],
//       ],
//     },
//   });
// });
// bot.action("fruits", (ctx) => {
//   ctx.deleteMessage();
//   bot.telegram.sendMessage(
//     ctx.chat.id,
//     "List of fruits:\n-Apples\n-Oranges\n-Pears",
//     {
//       reply_markup: {
//         inline_keyboard: [[{ text: "Back to menu", callback_data: "menu" }]],
//       },
//     }
//   );
// });

// bot.action("menu", (ctx) => {
//   ctx.deleteMessage();
//   bot.telegram.sendMessage(ctx.chat.id, "Main menu", {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: "See Fruits list", callback_data: "fruits" }],
//         [{ text: "See Meats list", callback_data: "meats" }],
//       ],
//     },
//   });
// });
// bot.action("one", (ctx) => {
//   ctx.answerCbQuery("Hello world");
//   ctx.reply("you click the button");
// });
bot.launch();
