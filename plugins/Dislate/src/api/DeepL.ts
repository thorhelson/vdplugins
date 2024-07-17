import { GoogleTranslateResponse, TranslationValue } from "../type";

const translate = async (text: string, source_lang: string = "auto", target_lang: string, original: boolean = false): Promise<TranslationValue> => {
    try {
        if (original) return { source_lang, text };

        const url = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
            client: "gtx",
            sl: source_lang,
            tl: target_lang,
            dt: "t",
            dj: "1",
            source: "input",
            q: text
        });

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to translate "${text}" (${source_lang} -> ${target_lang})\n${res.status} ${res.statusText}`);
        }

        const { src, sentences }: GoogleTranslateResponse = await res.json();

        return {
            source_lang: src,
            text: sentences.map(s => s?.trans).filter(Boolean).join("")
        };
    } catch (e) {
        throw new Error(`Failed to fetch from Google Translate: ${e}`);
    }
}

export default { translate };
