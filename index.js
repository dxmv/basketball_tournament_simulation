const Tournament = require("./classes/Tournament");
// glavna funkcija
const main = () => {
	console.log("Olympic Basketball Tournament Simulation\n");

	const tournament = new Tournament();
	tournament.simulateTournament();
};

main();
