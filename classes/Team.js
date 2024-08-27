// podaci za tim
class Team {
	constructor(name, isoCode, ranking) {
		// osnovni podaci
		this.name = name;
		this.isoCode = isoCode;
		this.ranking = ranking;
		// statistika
		this.points = 0;
		this.wins = 0;
		this.losses = 0;
		this.pointsScored = 0;
		this.pointsConceded = 0;
	}

	/**
	 * Updatuje statistiku tima
	 * @param {*} scored koliko je koseva ovaj tim dao
	 * @param {*} conceded koliko je primio
	 * @param {*} won da li je pobedio
	 */
	updateStats(scored, conceded, won) {
		this.pointsScored += scored;
		this.pointsConceded += conceded;
		if (won) {
			this.wins++;
			this.points += 2;
		} else {
			this.losses++;
			this.points += 1;
		}
	}

	getPointDifference() {
		return this.pointsScored - this.pointsConceded;
	}

	// Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika
	toString() {
		return `${this.name}\t${this.wins}/${this.losses}/${this.points}/${
			this.pointsScored
		}/${this.pointsConceded}/${this.getPointDifference()}`;
	}
}

module.exports = Team;
