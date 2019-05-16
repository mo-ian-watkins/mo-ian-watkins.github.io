console.time("Contrived example"); // Start the timer!

try {
    console.group("TRY BLOCK ACTIONS:"); // Create a console grouping
    console.log("Trying to reach server...")
    console.warn("It's taking awhile...."); // Use the console warn utility so we don't miss it in the console
    console.log("Still trying...");
    console.groupEnd(); // Close the "TRY BLOCK ACTIONS" grouping
    throw new Error("Can't reach server, sorry!"); // Throw an error to be caught in the catch block
} catch(e) {
    console.error(e.message); // Log the error thrown from the try block
} finally { // Block of code to execute regardless of errors
    console.group("FINALLY BLOCK ACTIONS:"); // Create another console grouping
    setTimeout(function() { // Arbitrarily delay code execution for the sake of timing
        console.log("Let's run some code independent of the server response:");
        coolFunction(); // Call external function
        console.log("Finally done with the example!");
        console.groupEnd(); // Close the "FINALLY BLOCK ACTIONS" grouping
        console.timeEnd("Contrived example"); // Stop timing the code and log the time taken to execute
    }, 900);
}

function coolFunction() {
    console.log("Hello from coolFunction");
}