const Tournament = require("./classes/Tournament");
// glavna funkcija
const main = () => {
	console.log("Simulacija turnira\n");

	const tournament = new Tournament();
	tournament.simulateTournament();
};

main();
