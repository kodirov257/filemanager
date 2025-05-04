const parseCliArguments = () => {
    let result = {};
    const args = process.argv;
    const length = args.length;

    for (var i = 2; i < length; i++) {
        const argument = args[i].split('=');
        result[argument[0].replace('--', '')] = argument[1];
    }

    return result;
}

const cliParserService = {
    parseCliArguments
};
export default cliParserService;