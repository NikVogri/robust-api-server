module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-namespace': 'off', // needed to type environmental variables
    },
};
