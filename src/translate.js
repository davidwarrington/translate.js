export const renderString = (
    renderTarget,
    variables,
    options = {
        delimiters: [
            ['{{\\s*', '\\s*}}'],
            ['%{', '}'],
        ],
    }
) => {
    return Object.entries(variables).reduce((translation, [key, value]) => {
        const replacePattern = options.delimiters
            .map(([start, end]) => {
                return `${start}${key}${end}`;
            })
            .join('|');

        return translation.replace(new RegExp(replacePattern, 'g'), value);
    }, renderTarget);
};

export const translate = (source, options) => (
    translationPath,
    variables = {}
) => {
    const errors = {
        incorrectSourceType: 'Source must be an object.',
        noSource: 'Source has not been set.',
        noTranslation: 'Translation does not exist.',
    };

    if (!source) {
        throw new Error(errors.noSource);
    }

    if (typeof source !== 'object') {
        throw new Error(errors.incorrectSourceType);
    }

    const translationFromSource = translationPath
        .split('.')
        .reduce((filteredSource, key) => {
            if (!filteredSource[key]) {
                throw new Error(errors.noTranslation);
            }

            return filteredSource[key];
        }, source);

    if (typeof translationFromSource !== 'string') {
        throw new Error(errors.noTranslation);
    }

    const transformedTranslation = renderString(
        translationFromSource,
        variables,
        options
    );

    return transformedTranslation;
};
