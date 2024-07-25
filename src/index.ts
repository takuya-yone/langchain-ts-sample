import { BedrockChat } from "@langchain/community/chat_models/bedrock";

console.log = (msg) => {
	process.stdout.write(`${msg}`);
};

export const main = async (): Promise<void> => {
	const model = new BedrockChat({
		region: "us-east-1",
		model: "anthropic.claude-3-haiku-20240307-v1:0",
		maxTokens: 2048,
		temperature: 0,
		cache: false,
		verbose: false,
	});

	const stream = await model.stream([["human", "LangChainとは何ですか？"]]);
	for await (const chunk of stream) {
		console.log(chunk.content);
		// process.stdout.write(chunk.content);
	}

	// console.log(res.)
	// console.log(JSON.stringify(res, null, 2));
};

main();
