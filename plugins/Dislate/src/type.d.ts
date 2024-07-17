export interface GoogleTranslateResponse {
    src: string;
    sentences: Array<{ trans: string }>;
}

export interface TranslationValue {
    source_lang: string;
    text: string;
}
