// za citanje fajlova
const fs = require("fs");
const Team = require("./Team");
const Group = require("./Group");
const Match = require("./Match");

// klasa za sve podatke o turniru
class Tournament {
	constructor() {
		this.groups = this.loadGroups();
		this.knockoutTeams = [];
		this.pots = [];
		this.knockoutStages = {
			quarterFinals: [],
			semiFinals: [],
			finals: null,
			thirdPlace: null,
		};
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
			const teams = el[1].map(
				t => new Team(t.Team, t.ISOCode, t.FIBARanking, nameOfGroup)
			);
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
	 * Dobijamo timove koji su prosli grupnu fazu
	 * @returns Listu timova koji su prosli grupnu fazu
	 */
	knockoutStageTeams() {
		// sortiramo timove
		const sortTeams = (a, b) => {
			if (b.points !== a.points) return b.points - a.points;
			if (b.getPointDifference() !== a.getPointDifference())
				return b.getPointDifference() - a.getPointDifference();
			return b.pointsScored - a.pointsScored;
		};

		// tri niza za odgovarajuce pozicije
		const firstPlace = [];
		const secondPlace = [];
		const thirdPlace = [];

		// prolazimo kroz sve grupe i dodajemo timove u odgovarajuci niz
		this.groups.forEach(group => {
			firstPlace.push(group.teams[0]);
			secondPlace.push(group.teams[1]);
			thirdPlace.push(group.teams[2]);
		});

		// sortiramo svaki od ovih nizova
		firstPlace.sort(sortTeams);
		secondPlace.sort(sortTeams);
		thirdPlace.sort(sortTeams);
		const res = [...firstPlace, ...secondPlace, ...thirdPlace];
		res.pop(); // izbacujemo 9. tim
		return res;
	}

	/**
	 * Deljenje timova u sesire
	 * @returns Listu timova podeljenih u sesire
	 */
	createPots() {
		return {
			D: this.knockoutTeams.slice(0, 2),
			E: this.knockoutTeams.slice(2, 4),
			F: this.knockoutTeams.slice(4, 6),
			G: this.knockoutTeams.slice(6, 8),
		};
	}

	/**
	 * Ispisuje sadrzaj knockout faze
	 */
	printKnockoutStage() {
		// ispis sesira
		console.log("Sesiri:");
		for (const [potName, teams] of Object.entries(this.pots)) {
			console.log(
				`\tSesir ${potName}:\n\t\t${teams
					.map(team => team.name)
					.join("\n\t\t")}`
			);
		}
		// ispis cetvrt finala
		console.log("Cetvrt finale:");
		this.knockoutStages.quarterFinals.map(match =>
			console.log(`\t\t${match.toString()}`)
		);

		// ispis polu finala
		console.log("Polu finale:");
		this.knockoutStages.semiFinals.map(match =>
			console.log(`\t\t${match.toString()}`)
		);

		// ispis treceg mesta
		console.log("Trece mesto:");
		console.log(`\t\t${this.knockoutStages.thirdPlace.toString()}`);

		// ispis finala
		console.log("Finale:");
		console.log(`\t\t${this.knockoutStages.finals.toString()}`);

		// ispis prva 3 mesta
		console.log("Medalje");
		console.log(`\t 1. ${this.knockoutStages.finals.match.winner.name}`);
		console.log(`\t 2. ${this.knockoutStages.finals.match.loser.name}`);
		console.log(`\t 3. ${this.knockoutStages.thirdPlace.match.winner.name}`);
	}

	drawKnockoutStage() {
		const drawQuarterFinals = () => {
			const matches = [];

			this.createMatches(this.pots.D, this.pots.G, matches);
			this.createMatches(this.pots.E, this.pots.F, matches);

			this.knockoutStages.quarterFinals = matches;
		};

		const drawSemiFinals = teams => {
			const matches = [];

			// znamo da su prva dva pobednika iz sesira d i g
			// druga dva su iz sesira e i f
			this.createMatches(teams.slice(0, 2), teams.slice(2, 4), matches);

			this.knockoutStages.semiFinals = matches;
		};

		this.pots = this.createPots();
		drawQuarterFinals();
		// pobednici meceva
		const semiFinalTeams = this.knockoutStages.quarterFinals.map(
			match => match.match.winner
		);
		drawSemiFinals(semiFinalTeams);
		// pobednici polu finala idu u finale
		this.knockoutStages.finals = new Match(
			this.knockoutStages.semiFinals[0].match.winner,
			this.knockoutStages.semiFinals[1].match.winner
		);
		// gubitnici idu za trece mesto
		this.knockoutStages.thirdPlace = new Match(
			this.knockoutStages.semiFinals[0].match.loser,
			this.knockoutStages.semiFinals[1].match.loser
		);
	}

	/**
	 * Kreira meceve izmedju timova iz datih lista i dodaje ih u listu iz arugmenta
	 * @param {*} arr1
	 * @param {*} arr2
	 * @param matches
	 */
	createMatches(arr1, arr2, matches) {
		// kopija arr2
		const availableTeams = [...arr2];

		for (const team1 of arr1) {
			// validni su oni koji nisu u istoj grupi
			const validOpponents = availableTeams.filter(
				team2 => !team1.sameGroup(team2.groupName)
			);
			const team2 = this.getRandomElement(validOpponents);
			matches.push(new Match(team1, team2));
			// brisemo tim iz kopije arr2
			availableTeams.splice(availableTeams.indexOf(team2), 1);
		}
	}

	/**
	 *
	 * @param {*} array Niz iz koga trazimo random element
	 * @returns Random element iz datog niza
	 */
	getRandomElement(array) {
		const index = Math.floor(Math.random() * array.length);
		return array[index];
	}

	// simulate the whole tournament
	simulateTournament() {
		this.loadGroups();
		this.simulateGroupStage();
		this.printGroupStageResults();
		this.knockoutTeams = this.knockoutStageTeams();
		this.drawKnockoutStage();
		this.printKnockoutStage();
	}
}

module.exports = Tournament;
