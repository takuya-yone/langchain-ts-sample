
import { BedrockChat } from "@langchain/community/chat_models/bedrock";

export const main = async (): Promise<void> => {
  const model = new BedrockChat({
    region: 'us-east-1',
    model: 'anthropic.claude-v2:1',
    maxTokens: 2048,
    temperature: 0,
    cache: false,
    verbose: true,
  });

  const res = await model.invoke([['human', 'LangChainとは何ですか？']]);
  console.log(JSON.stringify(res, null, 2));
};

main()
