import cliParserService from "./services/cliParserService.js";
import helpers from "./services/helpers.js";

const username = helpers.parseUsername(cliParserService.parseCliArguments());
console.log(`Welcome to the File Manager, ${username}!`);