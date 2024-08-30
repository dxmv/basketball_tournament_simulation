const fs = require("fs");
// podaci za tim
class Team {
	constructor(name, isoCode, ranking, groupName) {
		// osnovni podaci
		this.name = name;
		this.isoCode = isoCode;
		this.ranking = ranking;
		this.groupName = groupName;
		// statistika
		this.points = 0;
		this.wins = 0;
		this.losses = 0;
		this.pointsScored = 0;
		this.pointsConceded = 0;
		this.form = this.friendlyTraining();
	}

	/**
	 * Updatuje statistiku tima
	 * @param {*} scored koliko je koseva ovaj tim dao
	 * @param {*} conceded koliko je primio
	 * @param {*} won da li je pobedio
	 */
	updateStats(scored, conceded, result) {
		this.pointsScored += scored;
		this.pointsConceded += conceded;
		// razlika poena i zbir poena utakmice
		this.form += (scored - conceded) / (scored + conceded);
		if (result == "WIN") {
			this.wins++;
			this.points += 2;
			this.form = parseFloat(this.form) + 0.002;
		} else if (result == "LOSS") {
			this.losses++;
			this.points += 1;
			this.form = parseFloat(this.form) - 0.002;
		}
		// predaja
		else {
			this.losses++;
			this.form = parseFloat(this.form) - 0.002;
		}
		// Forma izmedju -0.1 i 0.1
		this.form = Math.max(-0.1, Math.min(0.1, this.form));
		this.form = parseFloat(this.form.toFixed(3));
	}

	/**
	 * Igranje prijateljskih meceva
	 *
	 * */
	friendlyTraining() {
		// citamo fajl
		const games = JSON.parse(fs.readFileSync("./exibitions.json", "utf8"))[
			this.isoCode
		];
		// rezultat utakmice izgleda ovako "100-11", gde je prvi deo rezultata, broj poena trenutne ekipe
		// izracunacemo ukupnu razliku poena za ove prijateljske utakmice
		// ukupan broj poena i broj pobeda
		let pd = 0,
			totalPoints = 0,
			wins = 0;
		for (let game of games) {
			let res = game["Result"].split("-");
			let ourRes = parseInt(res[0]);
			let oppRes = parseInt(res[1]);

			const currentPD = ourRes - oppRes;
			wins += currentPD > 0 ? 1 : 0;
			totalPoints += ourRes;
			pd += currentPD;
		}
		// izmedju -0.1 i 0.1
		return (wins / games.length) * 0.1 + (pd / totalPoints) * 0.1;
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

	/**
	 * Gleda da li su dva tima iz iste grupe
	 * @param {*} groupName2 ime druge grupe
	 * @returns boolean da li su u istoj grupi
	 */
	sameGroup(groupName2) {
		return this.groupName === groupName2;
	}
}

module.exports = Team;
