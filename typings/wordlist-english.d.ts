declare module 'wordlist-english' {
    type DictionaryKey =
    'english/10'|
    'english/20'|
    'english/35'|
    'english/40'|
    'english/50'|
    'english/55'|
    'english/60'|
    'english/70'|
    'english'|
    'english/american/10'|
    'english/american/20'|
    'english/american/35'|
    'english/american/40'|
    'english/american/50'|
    'english/american/55'|
    'english/american/60'|
    'english/american/70'|
    'english/american'|
    'english/australian/10'|
    'english/australian/20'|
    'english/australian/35'|
    'english/australian/40'|
    'english/australian/50'|
    'english/australian/55'|
    'english/australian/60'|
    'english/australian/70'|
    'english/australian'|
    'english/british/10'|
    'english/british/20'|
    'english/british/35'|
    'english/british/40'|
    'english/british/50'|
    'english/british/55'|
    'english/british/60'|
    'english/british/70'|
    'english/british'|
    'english/canadian/10'|
    'english/canadian/20'|
    'english/canadian/35'|
    'english/canadian/40'|
    'english/canadian/50'|
    'english/canadian/55'|
    'english/canadian/60'|
    'english/canadian/70'|
    'english/canadian'

    const words: { [P in DictionaryKey]: string[]}
    export default words
}
