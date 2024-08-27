// simulacija meca
class Match {
	constructor(team1, team2) {
		this.team1 = team1;
		this.team2 = team2;
		this.mec = this.simulateMatch();
	}

	/**
	 * Simulira mec izmedju dva tima
	 * @returns Objekat koji sadrzi pobednika, gubitnika i skor
	 */
	simulateMatch() {
		// Pretpostavimo da igraju 2. najjaci tim i 8. najjaci tim
		// totalRanking = 2 + 8 = 10
		// team1Probability = 1 - (2 / 10) = 1 - 0.2 = 0.8
		// Tim 1 ima 80% sanse da pobedi
		const totalRanking = this.team1.ranking + this.team2.ranking;
		const team1Probability = 1 - this.team1.ranking / totalRanking;

		let winner;
		let loser;
		// Simulate the match
		if (Math.random() < team1Probability) {
			winner = this.team1;
			loser = this.team2;
		} else {
			winner = this.team2;
			loser = this.team1;
		}

		// racunanje poena
		const winnerScore = Math.floor(Math.random() * 50) + 60; // 60 - 110
		const loserScore = winnerScore - Math.floor(Math.random() * 40) - 1; // 1-40 poena manje

		// updateovanje tog tima
		winner.updateStats(winnerScore, loserScore, true);
		loser.updateStats(loserScore, winnerScore, false);

		return {
			winner,
			loser,
			winnerScore,
			loserScore,
		};
	}

	// Australija - Španija (92:80)
	toString() {
		const team1Winner = this.mec.winner.name === this.team1.name;
		if (team1Winner) {
			return `${this.team1.name} - ${this.team2.name} (${this.mec.winnerScore} - ${this.mec.loserScore})`;
		}
		return `${this.team1.name} - ${this.team2.name} (${this.mec.loserScore} - ${this.mec.winnerScore})`;
	}
}

module.exports = Match;
