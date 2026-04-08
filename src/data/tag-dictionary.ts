/**
 * Static keyword-to-tag mapping for auto-tagging.
 * Keys are lowercase. Values are tag slugs.
 * Supports both English and Georgian keywords.
 */
export const TAG_DICTIONARY: Record<string, string[]> = {
    // --- Companies & Brands ---
    'openai': ['openai', 'ai'],
    'gpt': ['openai', 'gpt', 'ai'],
    'chatgpt': ['openai', 'chatgpt', 'ai'],
    'claude': ['anthropic', 'claude', 'ai'],
    'anthropic': ['anthropic', 'ai'],
    'meta': ['meta', 'big-tech'],
    'google': ['google', 'big-tech'],
    'deepmind': ['google', 'deepmind', 'ai'],
    'gemini': ['google', 'gemini', 'ai'],
    'microsoft': ['microsoft', 'big-tech'],
    'copilot': ['microsoft', 'copilot', 'ai'],
    'apple': ['apple', 'big-tech'],
    'nvidia': ['nvidia', 'ai-hardware'],
    'tesla': ['tesla', 'elon-musk'],
    'xai': ['xai', 'elon-musk', 'ai'],
    'grok': ['grok', 'xai', 'ai'],
    'neuralink': ['neuralink', 'elon-musk', 'neurotechnology'],
    'midjourney': ['midjourney', 'image-ai'],
    'stability': ['stability-ai', 'image-ai'],
    'runway': ['runway', 'video-ai'],
    'sora': ['sora', 'openai', 'video-ai'],
    'perplexity': ['perplexity', 'ai-search'],
    'hugging face': ['hugging-face', 'open-source-ai'],
    'huggingface': ['hugging-face', 'open-source-ai'],
    'mistral': ['mistral', 'open-source-ai'],
    'llama': ['llama', 'meta', 'open-source-ai'],
    'cursor': ['cursor', 'ai-coding'],
    'devin': ['devin', 'ai-coding'],

    // --- People ---
    'musk': ['elon-musk', 'tech-industry'],
    'altman': ['sam-altman', 'openai'],
    'zuckerberg': ['zuckerberg', 'meta'],
    'pichai': ['sundar-pichai', 'google'],
    'nadella': ['satya-nadella', 'microsoft'],
    // Georgian
    'მასკ': ['elon-musk', 'tech-industry'],
    'ოლტმენ': ['sam-altman', 'openai'],
    'ილონ': ['elon-musk', 'tech-industry'],
    'ცუკერბერგ': ['zuckerberg', 'meta'],

    // --- Tech Concepts ---
    'agent': ['ai-agents', 'ai'],
    'აგენტ': ['ai-agents', 'ai'],
    'token': ['ai-tokens', 'ai'],
    'ტოკენ': ['ai-tokens', 'ai'],
    'superintelligence': ['superintelligence', 'ai-safety'],
    'სუპერინტელექტ': ['superintelligence', 'ai-safety'],
    'agi': ['agi', 'ai-safety'],
    'api': ['api', 'developer-tools'],
    'automation': ['automation', 'ai'],
    'ავტომატიზაც': ['automation', 'ai'],
    'llm': ['llm', 'ai'],
    'transformer': ['transformer', 'ai'],
    'fine-tuning': ['fine-tuning', 'ai'],
    'prompt': ['prompt-engineering', 'ai'],
    'პრომპტ': ['prompt-engineering', 'ai'],
    'neural': ['neural-networks', 'ai'],
    'ნეირონ': ['neural-networks', 'ai'],
    'robotics': ['robotics', 'ai'],
    'რობოტ': ['robotics', 'ai'],
    'autonomous': ['autonomous-systems', 'ai'],
    'ავტონომიურ': ['autonomous-systems', 'ai'],
    'blockchain': ['blockchain', 'web3'],
    'crypto': ['crypto', 'web3'],
    'open source': ['open-source'],
    'open-source': ['open-source'],
    'startup': ['startup', 'tech-industry'],
    'სტარტაპ': ['startup', 'tech-industry'],

    // --- Domains ---
    'healthcare': ['healthcare', 'ai-applications'],
    'education': ['education', 'ai-applications'],
    'განათლება': ['education', 'ai-applications'],
    'cybersecurity': ['cybersecurity'],
    'კიბერუსაფრთხოება': ['cybersecurity'],
    'regulation': ['ai-regulation', 'policy'],
    'რეგულაცია': ['ai-regulation', 'policy'],
    'copyright': ['copyright', 'ai-regulation'],
    'lawsuit': ['legal', 'tech-industry'],
    'სარჩელ': ['legal', 'tech-industry'],
};

/**
 * Common Georgian stop-words to filter out during TF extraction.
 */
export const GEORGIAN_STOP_WORDS = new Set([
    'და', 'არის', 'რომ', 'ეს', 'იყო', 'მაგრამ', 'ან', 'თუ', 'კი', 'რა',
    'ვინ', 'სად', 'როგორ', 'რატომ', 'როდის', 'უფრო', 'ყველა', 'ერთ',
    'ისე', 'ასე', 'მხოლოდ', 'უკვე', 'ჯერ', 'აქ', 'იქ', 'ახლა', 'მაშინ',
    'რადგან', 'ამიტომ', 'თუმცა', 'ხოლო', 'მიუხედავად', 'შესაძლოა',
    'უნდა', 'შეიძლება', 'საჭიროა', 'აუცილებელია', 'დიდი', 'პატარა',
    'ახალი', 'ძველი', 'კარგი', 'ცუდი', 'ბევრი', 'ცოტა', 'სხვა', 'იგივე',
    'ჩემი', 'შენი', 'მისი', 'ჩვენი', 'თქვენი', 'მათი', 'ამ', 'იმ',
    'რომელიც', 'რომელსაც', 'რომლის', 'რასაც', 'ვინც', 'სადაც',
    'არა', 'კი', 'დიახ', 'ჰო', 'ვერ', 'არ', 'ნუ', 'იყოს',
    'იქნება', 'ხდება', 'აქვს', 'გააჩნია', 'შეუძლია',
    'ის', 'მე', 'შენ', 'ჩვენ', 'თქვენ', 'ისინი',
    'მას', 'მათ', 'ჩემს', 'შენს',
    'ზე', 'ში', 'დან', 'კენ', 'თან', 'ით', 'სთვის', 'ამდე',
    'წინ', 'უკან', 'შემდეგ', 'წინათ', 'შორის', 'გარეშე',
]);

export const ENGLISH_STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'must', 'need',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
    'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
    'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
    'if', 'then', 'else', 'when', 'where', 'why', 'how',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
    'up', 'about', 'into', 'over', 'after', 'before', 'between',
    'all', 'each', 'every', 'some', 'any', 'no', 'more', 'most',
    'very', 'just', 'also', 'now', 'here', 'there', 'than',
]);
