import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { DynamoDBChatMessageHistory } from "@langchain/community/stores/message/dynamodb";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

// console.log = (msg) => {
// 	process.stdout.write(`${msg}`);
// };

const memory = new BufferMemory({
	chatHistory: new DynamoDBChatMessageHistory({
		tableName: "langchain-history",
		partitionKey: "id",
		sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
		config: {
			region: "us-east-1",
			// credentials: {
			// 	accessKeyId: "<your AWS access key id>",
			// 	secretAccessKey: "<your AWS secret access key>",
			// },
		},
	}),
});

const systemTemplate =
	"この会話以降下記のルールに従ってください。語尾に「だっちゃ」と付けてください。私のことは「ダーリン」と読んでください。日本語で該当してください。";
const humanTemplate = "{text}";

const chatPrompt = ChatPromptTemplate.fromMessages([
	["system", systemTemplate],
	["human", humanTemplate],
]);

export const main = async (): Promise<void> => {
	const model = new BedrockChat({
		region: "us-east-1",
		model: "anthropic.claude-3-haiku-20240307-v1:0",
		maxTokens: 2048,
		temperature: 1,
		// cache: false,
		// verbose: false,
	});
	// const system = "あなたは入力された文章を英語に変換するアシスタントです";

	const messages = [
		[
			new SystemMessage(systemTemplate),
			new HumanMessage("LangChainとは何ですか？"),
		],
	];

	const messages2 = [
		["system", systemTemplate],
		// ["human", "LangChainとは何ですか？"],
	];

	const chain = new ConversationChain({
		llm: model,
		memory: memory,
		verbose: false,
	});

	// await chain.invoke();

	// const res = await chain.call([
	// 	new HumanMessage({ content: "LangChainとは何ですか？" }),
	// ]);

	// const res = await chain.call({
	// 	input: "LangChainとは何ですか？",
	// });
	const inputTexts = [
		"LangChainとは何ですか？",
		"1行でまとめてください",
		"私の名前は？",
	];

	const res = await chain.predict({ input: systemTemplate });
	// console.log(res);
	for (const text of inputTexts) {
		const res = await chain.predict({ input: text });
		console.log(`>>> ${text}`);
		console.log("");
		console.log(res);
		console.log("");
	}

	// const res1 = await chain.predict({
	// 	input: "この会話以降、語尾に「だっちゃ」と付けてください。分かりましたか？",
	// });
	// console.log(res1);
	// console.log(res1);

	// const res2 = await chain.predict({
	// 	input: "",
	// });
	// console.log(res2);

	// const res3 = await chain.predict({
	// 	input: "",
	// });
	// console.log(res3);

	// const res = await chain.call({
	// 	input: "以前の答えを1行にまとめてください",
	// });

	// const res = await model.invoke(messages);

	// const res = await model.invoke([
	// 	new HumanMessage({ content: "LangChainとは何ですか？" }),
	// ]);

	// const res = await chain.invoke([["human", "LangChainとは何ですか？"]]);

	// for await (const chunk of stream) {
	// 	console.log(chunk.content);
	// 	// process.stdout.write(chunk.content);
	// }

	// console.log(JSON.stringify(res, null, 2));
};

main();
