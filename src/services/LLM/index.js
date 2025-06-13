import { currentLLM } from './configLLM.js';
import * as openrouterClient from './openrouter/client.js';

const LLM_PROVIDERS = {
    openrouter: openrouterClient,
};

export const askLLM = async (prompt) => {
    const provider = LLM_PROVIDERS[currentLLM];
    if (!provider) throw new Error(`Proveedor LLM no válido: ${currentLLM}`);
    return await provider.ask(prompt);
};
