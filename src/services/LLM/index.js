import { currentLLM } from './configLLM.js';
import * as openrouterClient from './openrouter/client.js';
import * as openaiClient from './openai/client.js';

const LLM_PROVIDERS = {
    openrouter: openrouterClient,
    openai: openaiClient,
};

export const askLLM = async (prompt) => {
    const provider = LLM_PROVIDERS[currentLLM];
    if (!provider) throw new Error(`Proveedor LLM no válido: ${currentLLM}`);
    return await provider.ask(prompt);
};
