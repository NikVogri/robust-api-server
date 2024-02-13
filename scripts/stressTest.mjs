import axios from "axios";

let success = 0;
let failure = 0;

// Function to generate a random number within a range
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to delay execution
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to send GET request to retrieve all todos
async function getAllTodos() {
	try {
		const response = await axios.get("http://localhost:3001/todos");
		console.log("GET /todos:");
	} catch (error) {
		console.error("Error fetching todos:", error.message);
	}
}

// Function to send GET request to retrieve a specific todo by ID
async function getTodoById(id) {
	try {
		const response = await axios.get(`http://localhost:3001/todos/${id}`);
		console.log(`GET /todos/${id}:`, response.data);
		success++;
	} catch (error) {
		failure++;
		console.error(`Error fetching todo ${id}:`, error.message);
	}
}

// Function to send POST request to create a new todo
async function createTodo() {
	try {
		const response = await axios.post("http://localhost:3001/todos", {
			title: "New Todo " + Math.random(),
			completed: false,
		});

		success++;
		console.log("POST /todos:", response.data);
	} catch (error) {
		failure++;
		console.error("Error creating todo:", error.message);
	}
}

// Function to send DELETE request to delete a todo by ID
async function deleteTodoById(id) {
	try {
		const response = await axios.delete(`http://localhost:3001/todos/${id}`);
		console.log(`DELETE /todos/${id}:`, response.data);
	} catch (error) {
		console.error(`Error deleting todo ${id}:`, error.message);
	}
}

// Function to randomly choose an action and execute it
async function performRandomAction() {
	const actions = [createTodo];
	const randomIndex = getRandomInt(0, actions.length - 1);
	await actions[randomIndex](randomIndex + 1);
}

async function runTestAsyncWrite(actions) {
	console.log(`Starting async test`);

	let actionNum = 0;
	let totalActs = 0;

	const promises = [];

	while (totalActs <= actions) {
		promises.push(createTodo());

		actionNum++;
		totalActs++;

		if (actionNum > 200) {
			await sleep(350);
			actionNum = 0;
		}
	}

	await Promise.all(promises);

	console.log("Test complete.");
}

async function runTestSyncWrite(actions) {
	console.log(`Starting sync test`);

	let totalActs = 0;

	while (totalActs <= actions) {
		await createTodo();
		totalActs++;
	}

	console.log("Test complete.");
}

function getRandomId(min = 415185, max = 515186) {
	// Generate a random number between 0 (inclusive) and 1 (exclusive)
	const random = Math.random();
	// Scale the random number to fit the range [min, max]
	return Math.floor(random * (max - min + 1)) + min;
}

async function runTestAsyncRead(actions) {
	console.log(`Starting async test`);

	let actionNum = 0;
	let totalActs = 0;

	const promises = [];

	while (totalActs <= actions) {
		promises.push(getTodoById(getRandomId()));

		actionNum++;
		totalActs++;

		if (actionNum > 200) {
			await sleep(350);
			actionNum = 0;
		}
	}

	await Promise.all(promises);

	console.log("Test complete.");
}

async function runTestSyncRead(actions) {
	console.log(`Starting sync test`);

	let totalActs = 0;

	while (totalActs <= actions) {
		await getTodoById(getRandomId());
		totalActs++;
	}

	console.log("Test complete.");
}

console.time();
// await runTestAsyncWrite(25000);
// await runTestSyncWrite(25000);
// await runTestAsyncRead(25000);
await runTestSyncRead(25000);

console.log(`Success: ${success} | Failure: ${failure}`);
console.timeEnd();

// RESULTS:
// =========
// JAVASCRIPT:
//  WRITE:
//	[async 10 000 req] 18.3 seconds (09990 success 	| 011 failure)
//  [async 25 000 req] 72.3 seconds (24435 success 	| 566 failure)
//	[sync  10 000 req] 15.5 seconds (10001 success  | 000 failures)
//	[sync  25 000 req] 42.6 seconds (25001 success 	| 000 failures)
//
//  READ:
//	[async 10 000 req] 18.0 seconds (10001 success 	| 000 failure)
//  [async 25 000 req] 66.6 seconds (24507 success 	| 494 failure)
//	[sync  10 000 req] 06.0 seconds (10001 success 	| 000 failures)
//	[sync  25 000 req] 41.8 seconds (25000 success 	| 001 failures)
//
// GOLANG:
//  WRITE:
//	[async 10 000 req] 0.0 seconds (000 success 	| 000 failure)
//  [async 25 000 req] 0.0 seconds (000 success 	| 000 failure)
//	[sync  10 000 req] 0.0 seconds (000 success 	| 000 failures)
//	[sync  25 000 req] 0.0 seconds (000 success 	| 000 failures)
//
//  READ:
//	[async 10 000 req] 0.0 seconds (0 success 		| 0 failure)
//  [async 25 000 req] 0.0 seconds (0 success 		| 0 failure)
//	[sync  10 000 req] 0.0 seconds (000 success 	| 000 failures)
//	[sync  25 000 req] 0.0 seconds (000 success 	| 000 failures)
