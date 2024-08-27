const Match = require("./Match");

class Group {
	constructor(name, teams) {
		this.name = name;
		this.teams = teams;
		this.matches = {};
	}

	/**
	 * Simuliranje meceva
	 *
	 */
	simulateMatches() {
		// u grupi imamo 3 kola
		// kombinacije ko igra sa kim u svakom kolu
		// za svaku grupu je ista kombinacija
		const combinations = [
			[
				[0, 2],
				[1, 3],
			],
			[
				[3, 0],
				[2, 1],
			],
			[
				[0, 1],
				[2, 3],
			],
		];

		combinations.forEach((comb, i) => {
			this.matches[i] = [];
			// idemo kroz svaki mec za kolo
			comb.forEach(index => {
				this.matches[i].push(
					new Match(this.teams[index[0]], this.teams[index[1]])
				);
			});
		});
	}

	/**
	 * Rangira timove po zadatim pravilima
	 */
	rankTeams() {
		// sortiranje timova po poenima
		this.teams.sort((a, b) => b.points - a.points);

		// Check for ties and resolve them
		for (let i = 0; i < this.teams.length - 1; i++) {
			if (this.teams[i].points === this.teams[i + 1].points) {
				// Check if we have a three-way tie
				if (
					i + 2 < this.teams.length &&
					this.teams[i].points === this.teams[i + 2].points
				) {
					this.resolveThreeWayTie(i, i + 1, i + 2);
					i += 2; // Skip the next two teams as we've already handled them
				} else {
					this.resolveTwoWayTie(i, i + 1);
					i++; // Skip the next team as we've already handled it
				}
			}
		}
	}
}

module.exports = Group;
