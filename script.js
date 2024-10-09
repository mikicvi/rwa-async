// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
	const outputDiv = document.getElementById("output");

	/**
	 * Fetches data synchronously from multiple JSON files and displays the combined data.
	 *
	 * Note: This function uses synchronous HTTP requests, which blocks the main thread.
	 * It is not recommended to use synchronous requests in production code, as it can cause performance issues.
	 * If the large data is being fetched, the browser will be unresponsive until the data is fetched.
	 * This is only for demonstration purposes.
	 *
	 */
	function fetchDataSynchronous() {
		outputDiv.innerHTML = "Fetching data synchronously...";
		// the reference.json is known - we get the location for the next file from it
		const referenceData = JSON.parse(syncGet("data/reference.json"));
		// data1 is not known, but we can get it from the reference.json
		const data1 = JSON.parse(syncGet(`data/${referenceData.data_location}`));
		// data2 is not known, but we can get it from data1
		const data2 = JSON.parse(syncGet(`data/${data1.data_location}`));
		// data3 is known
		const data3 = JSON.parse(syncGet("data/data3.json"));
		displayData([...data1.data, ...data2.data, ...data3.data]);
	}

	/**
	 * Synchronously retrieves data from the specified URL.
	 *
	 * @param {string} url - The URL to send the GET request to.
	 * @returns {string} The response text from the GET request.
	 */
	function syncGet(url) {
		// Create a new XMLHttpRequest object
		const xhr = new XMLHttpRequest();
		// Open a synchronous GET request to the specified URL
		xhr.open("GET", url, false);
		xhr.send();
		return xhr.responseText;
	}

	/**
	 * Fetches data asynchronously from multiple JSON files and displays the combined data.
	 * This function uses asynchronous HTTP requests, which do not block the main thread.
	 * This is the recommended way to fetch data in production code.
	 * The browser will not be unresponsive while the data is being fetched.
	 *
	 */
	async function fetchDataAsync() {
		const outputDiv = document.getElementById("output");
		outputDiv.innerHTML = "Fetching data asynchronously...";

		try {
			const referenceData = await asyncGet("data/reference.json");
			const data1 = await asyncGet(`data/${referenceData.data_location}`);
			const data2 = await asyncGet(`data/${data1.data_location}`);
			const data3 = await asyncGet("data/data3.json");

			displayData([...data1.data, ...data2.data, ...data3.data]);
		} catch (error) {
			outputDiv.innerHTML = `Error fetching data: ${error.message}`;
		}
	}

	/**
	 * Fetches JSON data from the specified URL.
	 *
	 * @param {string} url - The URL to fetch data from.
	 * @returns {Promise<Object>} - A promise that resolves to the JSON data.
	 */
	function asyncGet(url) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			// Set the responseType to JSON
			xhr.onreadystatechange = function () {
				// Check if the request is complete
				if (xhr.readyState === 4) {
					// Check if the request was successful
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.responseText));
					} else {
						reject(new Error(`Failed to fetch data from ${url}`));
					}
				}
			};
			xhr.send();
		});
	}

	/**
	 * Asynchronously fetches and processes data using the Fetch API.
	 * This function uses the Fetch API to fetch data asynchronously.
	 * The Fetch API is a modern alternative to XMLHttpRequest and provides a more powerful and flexible feature set.
	 * It returns a Promise that resolves to the Response to that request, whether it is successful or not.
	 * It also allows us to define the data format we want to receive (JSON, Blob, Text, etc.).
	 *
	 *
	 * @async
	 * @function fetchDataUsingFetch
	 * @returns {Promise<void>} A promise that resolves when all data has been fetched and displayed.
	 */
	async function fetchDataUsingFetch() {
		outputDiv.innerHTML = "Fetching data with Fetch API...";
		const referenceData = await fetchJSON("data/reference.json");
		const data1 = await fetchJSON(`data/${referenceData.data_location}`);
		const data2 = await fetchJSON(`data/${data1.data_location}`);
		const data3 = await fetchJSON("data/data3.json");
		// Combine the data from all sources and display it, destructuring the data property from each object in the array
		displayData([...data1.data, ...data2.data, ...data3.data]);
	}

	/**
	 * JSON Wrapper for fetch API.
	 *
	 * @async
	 * @function fetchJSON
	 * @param {string} url - The URL to fetch the JSON data from.
	 * @returns {Promise<Object>} A promise that resolves to the JSON data.
	 * @throws {Error} Will throw an error if the fetch operation fails.
	 */
	async function fetchJSON(url) {
		const response = await fetch(url);
		// JSON.parse() will throw an error if the response is not valid JSON https://developer.mozilla.org/en-US/docs/Web/API/Request/json
		return await response.json();
	}

	/**
	 * Displays data in a table format.
	 *
	 * @param {Array<Object>} data - An array of objects containing the data to be displayed.
	 */
	function displayData(data) {
		const table = document.createElement("table");

		// Create the header row
		const headerRow = document.createElement("tr");
		["Name", "ID", "Address"].forEach((header) => {
			const th = document.createElement("th");
			th.textContent = header;
			headerRow.appendChild(th);
		});
		table.appendChild(headerRow);

		// Create the data rows
		data.forEach((item) => {
			const row = document.createElement("tr");
			["name", "id", "address"].forEach((key) => {
				const cell = document.createElement("td");
				cell.textContent = item[key];
				row.appendChild(cell);
			});
			table.appendChild(row);
		});

		// Clear the output div and append the table
		outputDiv.appendChild(table);
	}

	/**
	 * Clears the content of the outputDiv element.
	 */
	function clearData() {
		outputDiv.innerHTML = "";
	}

	// Expose functions to the global scope for button click handlers
	window.fetchDataSynchronous = fetchDataSynchronous;
	window.fetchDataAsync = fetchDataAsync;
	window.fetchDataUsingFetch = fetchDataUsingFetch;
	window.clearData = clearData;
});
