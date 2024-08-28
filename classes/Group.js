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

		// Fixujemo tamo gde imamo isti broj poena
		for (let i = 0; i < this.teams.length - 1; i++) {
			if (this.teams[i].points === this.teams[i + 1].points) {
				// Da li tri tima imaju isti broj bodova
				if (
					i + 2 < this.teams.length &&
					this.teams[i].points === this.teams[i + 2].points
				) {
					this.resolveThreeWayTie(i, i + 1, i + 2);
					i += 2; // Preskacemo naredna dva tima, jer smo njih vec fixali
				} else {
					this.resolveTwoWayTie(i, i + 1);
					i++; // Preskacemo sledeci jer smo ga vec fixali
				}
			}
		}
	}

	/**
	 * Rangira timove kada imaju isti broj poena
	 * @param {*} index1 index prvog tima
	 * @param {*} index2 index drugog tima
	 */
	resolveTwoWayTie(index1, index2) {
		const team1 = this.teams[index1];
		const team2 = this.teams[index2];
		const headToHeadMatch = this.findHeadToHeadMatch(team1, team2);

		if (!headToHeadMatch) {
			return;
		}
		// samo gledamo ako je drugi tim pobedio, jer onda moramo da menjamo mesta
		if (headToHeadMatch.match.winner === team2) {
			[this.teams[index1], this.teams[index2]] = [
				this.teams[index2],
				this.teams[index1],
			];
		}
	}

	/**
	 * Rangira timove kada imaju isti broj poena
	 * @param {*} index1 Prvi tim
	 * @param {*} index2 Drugi tim
	 * @param {*} index3 Treci tim
	 */
	resolveThreeWayTie(index1, index2, index3) {
		const updatePoints = (a, b) => {
			const headToHeadMatch = this.findHeadToHeadMatch(a.team, b.team);

			if (!headToHeadMatch) {
				return;
			}
			// gledamo ko je pobedio
			let winner, loser;
			if (headToHeadMatch.match.winner === a) {
				winner = a;
				loser = b;
			} else {
				winner = b;
				loser = a;
			}

			winner.pd +=
				headToHeadMatch.match.winnerScore - headToHeadMatch.match.loserScore;
			loser.pd +=
				headToHeadMatch.match.loserScore - headToHeadMatch.match.winnerScore;
		};

		const teams = [this.teams[index1], this.teams[index2], this.teams[index3]];

		const stats = teams.map(team => ({
			team: team,
			pd: 0,
		}));

		// 1 vs 2
		updatePoints(stats[0], stats[1]);
		// 2 vs 3
		updatePoints(stats[1], stats[2]);
		// 3 vs 1
		updatePoints(stats[2], stats[0]);

		// Sortiramo timove na osnovu razlike poena
		stats.sort((a, b) => b.pd - a.pd);

		// Updajetujemo listu
		this.teams[index1] = stats[0].team;
		this.teams[index2] = stats[1].team;
		this.teams[index3] = stats[2].team;
	}

	/**
	 * Trazi mec izmedju datih timova
	 * @param {*} team1
	 * @param {*} team2
	 * @returns Mec izmedju ovih timova ili null ako nisu igrali
	 */
	findHeadToHeadMatch(team1, team2) {
		for (const round of Object.values(this.matches)) {
			for (const match of round) {
				if (
					(match.team1 === team1 && match.team2 === team2) ||
					(match.team1 === team2 && match.team2 === team1)
				) {
					return match;
				}
			}
		}
		return null;
	}
}

module.exports = Group;
