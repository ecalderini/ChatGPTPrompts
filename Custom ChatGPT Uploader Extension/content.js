// Create the button
const button = document.createElement("button");
button.innerText = "Submit File";
button.style.backgroundColor = "#00A67E";
button.style.color = "white";
button.style.padding = "3px";
button.style.border = "none";
button.style.borderRadius = "3px";
button.style.margin = "3px";

//Sleep Functions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create the progress bar container
const progressContainer = document.createElement("div");
progressContainer.style.width = "99%";
progressContainer.style.height = "5px";
progressContainer.style.backgroundColor = "grey";
progressContainer.style.margin = "3px";
progressContainer.style.borderRadius = "5px";

// Create the progress bar element
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "white";
progressContainer.appendChild(progressBar);

// Create the chunk size input
const chunkSizeInput = document.createElement("input");
chunkSizeInput.type = "number";
chunkSizeInput.min = "1";
chunkSizeInput.value = "14000";
chunkSizeInput.style.margin = "3px";
chunkSizeInput.style.margin = "3px";
chunkSizeInput.style.width = "80px"; // Set the width of the input element
chunkSizeInput.style.height = "28px"; // Set the width of the input element
chunkSizeInput.style.color = "black"; // Set the font color inside the input element
chunkSizeInput.style.fontSize = "14px"; // Set the font size inside the input element
// Create the chunk size label
const chunkSizeLabel = document.createElement("label");
chunkSizeLabel.innerText = "Chunk Size: ";
chunkSizeLabel.style.display = "none";
chunkSizeLabel.appendChild(chunkSizeInput);
chunkSizeLabel.style.color = "white"; // Set the font color of the label text

//chunkSizeLabel.style.color = "black";
chunkSizeLabel.appendChild(chunkSizeInput);

// Add a click event listener to the button
button.addEventListener("click", async () => {
  // Create the input element
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt,.js,.py,.html,.css,.json,.csv,.ps1,.lua,.log,.css,.html";

  // Add a change event listener to the input element
  input.addEventListener("change", async () => {
    // Reset progress bar once a new file is inserted
    progressBar.style.width = "0%";
    progressBar.style.backgroundColor = "white";

    // Read the file as text
    const file = input.files[0];
    const text = await file.text();

    // Get the chunk size from the input element
    const chunkSize = parseInt(chunkSizeInput.value);

    // Split the text into chunks of the specified size
    const numChunks = Math.ceil(text.length / chunkSize);
    for (let i = 0; i < numChunks; i++) {
      const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);
	  try{document.querySelector('.scroll-convo').click()}catch{}
	  try{document.querySelectorAll("[class^='react-scroll-to-bottom--css']").forEach(element => {const maxScrollHeight = element.scrollHeight; element.scrollTo(0, maxScrollHeight);});}catch{}
      // Submit the chunk to the conversation
      await submitConversation(chunk, i + 1, file.name, numChunks);
	  await sleep(2000);
	  try{document.querySelector('.scroll-convo').click()}catch{}
	  try{document.querySelectorAll("[class^='react-scroll-to-bottom--css']").forEach(element => {const maxScrollHeight = element.scrollHeight; element.scrollTo(0, maxScrollHeight);});}catch{}
      // Update the progress bar
      progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

      // Wait for ChatGPT to be ready
      let chatgptReady = false;
      while (!chatgptReady) {
		await sleep(1000);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        chatgptReady = !document.querySelector(
          ".text-2xl > span:not(.invisible)"
        );
      }
    }

    // Finish updating the progress bar
    progressBar.style.backgroundColor = "#00A67E";
	await sleep(3000);
	progressBar.style.backgroundColor = "gray";
  });

  // Click the input element to trigger the file selection dialog
  input.click();
});

// Define the submitConversation function
async function submitConversation(text, part, filename, numChunks) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });

  if (part === numChunks) {
    textarea.value = `Do not respond to this prompt with a breakdown or description, Only respond with: "All Parts of <code>${filename}</code> have been Received Successfully". Sending Part ${part} of ${filename}:\n\n${text} \n\n When The user refers to ${filename} or "This Script" Or "This File" etc, Assume they are referring to all of its parts in the Previous Conversation in order by part # as if it was one whole file called ${filename}`;
  } else {
    textarea.value = `Do not respond to this prompt with a breakdown or description, Only respond with: "Received Part <code>${part}</code> of <code>${filename}</code>, Waiting for Next Part...". Sending Part ${part} of ${filename}:\n\n${text}`;
  }

  textarea.dispatchEvent(enterKeyEvent);
}

// Periodically check if the button has been added to the page and add it if it hasn't
const targetSelector =
  ".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4";
const intervalId = setInterval(() => {
  const targetElement = document.querySelector(targetSelector);
  if (targetElement && !targetElement.contains(button)) {
    // Insert the button before the target element
    targetElement.parentNode.insertBefore(button, targetElement);

    // Insert the progress bar container before the target element
    targetElement.parentNode.insertBefore(progressContainer, targetElement);

    // Insert the chunk size label and input before the target element
    targetElement.parentNode.insertBefore(chunkSizeLabel, targetElement);
  }
}, 5000);
