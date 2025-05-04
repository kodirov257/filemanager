const snakeToCamel = (text) => {
    return text.replace(/_([a-z])/g, (_, value) => value.toUpperCase());
};

const parseUsername = (args) => snakeToCamel(args['username'].charAt(0).toUpperCase() + args['username'].slice(1));

const helpers = {
    snakeToCamel,
    parseUsername,
};
export default helpers;