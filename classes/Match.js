// simulacija meca
class Match {
	constructor(team1, team2) {
		this.team1 = team1;
		this.team2 = team2;
		this.match = this.simulateMatch();
	}

	/**
	 * Simulira mec izmedju dva tima
	 * @returns Objekat koji sadrzi pobednika, gubitnika i skor
	 */
	simulateMatch() {
		// Odredjivanje slabijeg tima
		const weakerTeam =
			this.team1.ranking > this.team2.ranking ? this.team2 : this.team1;
		const strongerTeam = weakerTeam === this.team1 ? this.team2 : this.team1;

		// prvo racunamo apsolutnu razliku ranga timova
		// kada je razlika veca od 10, sanse su mnogo vece da drugi tim odustane
		// taj broj mnozimo sa veoma malim brojem zato sto su sanse odustajanja veoma male
		const forfeitChance =
			(Math.abs(this.team1.ranking - this.team2.ranking) / 10) * 0.001;
		// provera da li slabiji tim odustaje
		if (Math.random() < forfeitChance) {
			strongerTeam.updateStats(0, 0, "WIN");
			weakerTeam.updateStats(0, 0, "FOREFIT");

			return {
				winner: strongerTeam,
				loser: weakerTeam,
				winnerScore: 0,
				loserScore: 0,
			};
		}

		// Pretpostavimo da igraju 2. najjaci tim i 8. najjaci tim
		// totalRanking = 2 + 8 = 10
		// team1Probability = 8 / 10 = 0.8
		// Tim 1 ima 80% sanse da pobedi
		const totalRanking = this.team1.ranking + this.team2.ranking;
		let team1Probability = this.team2.ranking / totalRanking;
		team1Probability += this.team1.form; // dodajemo i formu koja je izmedju -0.1 i 0.1

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
		winner.updateStats(winnerScore, loserScore, "WIN");
		loser.updateStats(loserScore, winnerScore, "LOSS");

		return {
			winner,
			loser,
			winnerScore,
			loserScore,
		};
	}

	// Australija - Španija (92:80)
	toString() {
		const team1Winner = this.match.winner.name === this.team1.name;
		if (team1Winner) {
			return `${this.team1.name} - ${this.team2.name} (${this.match.winnerScore} - ${this.match.loserScore})`;
		}
		return `${this.team1.name} - ${this.team2.name} (${this.match.loserScore} - ${this.match.winnerScore})`;
	}
}

module.exports = Match;
