// za citanje fajlova
const fs = require("fs");
const Team = require("./Team");
const Group = require("./Group");

// klasa za sve podatke o turniru
class Tournament {
	constructor() {
		this.groups = this.loadGroups();
	}

	/**
	 * Cita grupe i timove iz fajla "groups.json"
	 * @returns Listu klasa Grupa
	 */
	loadGroups() {
		// citamo fajl
		const groupsData = JSON.parse(fs.readFileSync("./groups.json", "utf8"));

		// primer reda
		// [ 'A', [ [Ime1], [Ime2], [Ime3], [Ime4] ] ],
		return Object.entries(groupsData).map(el => {
			const nameOfGroup = el[0];
			const teams = el[1].map(t => new Team(t.Team, t.ISOCode, t.FIBARanking));
			return new Group(nameOfGroup, teams);
		});
	}

	simulateGroupStage() {
		// samo pozivamo funkciju za simuliranje meceva za svaku grupu
		this.groups.forEach(group => {
			group.simulateMatches();
			group.rankTeams();
		});
	}

	/**
	 * Ispisi rezultata po kolima i tabela za svaku grupu
	 */
	printGroupStageResults() {
		console.log("Rezulatati grupne faze:");
		// Grupna faza - I kolo:
		// 	Grupa A:
		// 		Mec 1
		//    Mec 2
		//    .....
		for (let i = 0; i < 3; i++) {
			console.log(`Grupna faza - ${i == 0 ? "I" : i == 1 ? "II" : "III"} kolo`);
			this.groups.forEach(group => {
				console.log(`\tGrupa ${group.name}`);
				const matches = group.matches[i];
				matches.forEach(match => console.log(`\t\t${match.toString()}`));
			});
			console.log("\n");
		}

		console.log("\n");
		// ispisivanje tabela
		this.groups.forEach(group => {
			console.log(
				`Grupa ${group.name} - (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika)\n---------------------------------------------------------`
			);
			group.teams.forEach((team, index) => {
				console.log(`${index + 1}. ${team.toString()}`);
			});
			console.log("\n");
		});

		console.log("\n\n\n");
	}

	/**
	 *
	 */
	knockoutStageTeams() {
		// prvo plasi
	}

	// simulate the whole tournament
	simulateTournament() {
		this.loadGroups();
		this.simulateGroupStage();
		this.printGroupStageResults();
		// this.simulateGroupStage();
		// this.printGroupStageResults();
	}
}

module.exports = Tournament;
