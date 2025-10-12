const AbstractService = require("../AbstractService.js")
const leagueModel = require("../../models/leagueModel.js")
const AppError = require("../../errors/app-error.js")

class LeagueService extends AbstractService {
    constructor() {
      super()
    }

    static async createLeague(league) {
        try {
            const newLeague = await AbstractService.createDocument(leagueModel, league)
            if(!newLeague) throw new AppError("could not create league", 400)
            return newLeague
        } catch (error) {
            console.log(error)
            throw new AppError('Error creating league', 400);
        }
    }

    static async getLeagues() {
        try {
            const leagues = await leagueModel.find()
                .populate({
                    path: 'teams',
                    model: 'Team',
                    select: 'name members coach captain status points achievements',
                    populate: [
                        {
                            path: 'coach',
                            model: 'User',
                            select: 'first_name second_name email'
                        },
                        {
                            path: 'captain',
                            model: 'User',
                            select: 'first_name second_name email'
                        }
                    ]
                })
                .populate({
                    path: 'matches',
                    model: 'Match',
                    select: 'homeTeam awayTeam date venue status score',
                    populate: [
                        {
                            path: 'homeTeam',
                            model: 'Team',
                            select: 'name'
                        },
                        {
                            path: 'awayTeam',
                            model: 'Team',
                            select: 'name'
                        }
                    ]
                });

            // Manually populate standings teamId after the main query
            if (leagues && leagues.length > 0) {
                for (let league of leagues) {
                    if (league.standings && league.standings.length > 0) {
                        await leagueModel.populate(league, {
                            path: 'standings.teamId',
                            model: 'Team',
                            select: 'name logo'
                        });
                    }
                }
            }

            console.log('Found leagues:', leagues.length);
            if (leagues.length > 0) {
                console.log('First league teams populated:', leagues[0].teams.length);
                console.log('First league matches populated:', leagues[0].matches.length);
                console.log('First league standings populated:', leagues[0].standings.length);
                if (leagues[0].teams.length > 0) {
                    console.log('First team details:', leagues[0].teams[0].name);
                }
                if (leagues[0].matches.length > 0) {
                    console.log('First match details:', leagues[0].matches[0].homeTeam?.name, 'vs', leagues[0].matches[0].awayTeam?.name);
                }
                if (leagues[0].standings.length > 0) {
                    console.log('First standings team:', leagues[0].standings[0].teamId?.name || 'Not populated');
                }
            }

            if(!leagues) throw new AppError("could not get all the leagues", 400)
            return leagues
        } catch (error) {
            console.log('Error in getLeagues populate:', error)
            throw new AppError('Error getting all leagues', 400);
        }
    }

    static async getLeague(id) {
        try {
            const league = await leagueModel.findById(id)
                .populate({
                    path: 'teams',
                    model: 'Team',
                    select: 'name members coach captain status points achievements',
                    populate: [
                        {
                            path: 'coach',
                            model: 'User',
                            select: 'first_name second_name email'
                        },
                        {
                            path: 'captain',
                            model: 'User',
                            select: 'first_name second_name email'
                        },
                        {
                            path: 'members',
                            model: 'User',
                            select: 'first_name second_name email'
                        }
                    ]
                }).populate({
                    path: 'matches',
                    model: 'Match',
                    select: 'homeTeam awayTeam date venue status score',
                    populate: [
                        {
                            path: 'homeTeam',
                            model: 'Team',
                            select: 'name'
                        },
                        {
                            path: 'awayTeam',
                            model: 'Team',
                            select: 'name'
                        }
                    ]
                });

            // Manually populate standings teamId after the main query
            if (league && league.standings && league.standings.length > 0) {
                await leagueModel.populate(league, {
                    path: 'standings.teamId',
                    model: 'Team',
                    select: 'name logo'
                });
            }

            console.log('Found league with populated teams:', league ? league.teams.length : 'No league found');
            if (league && league.matches.length > 0) {
                console.log('First match populated data:', JSON.stringify(league.matches[0], null, 2));
            }
            
            if(!league) throw new AppError("could not get the league data", 400)
            return league
        } catch (error) {
            console.log('Error in getLeague populate:', error)
            throw new AppError('Error getting league', 400);
        }
    }

    static async updateLeague(id, data) {
        try {
            const league = await AbstractService.editDocument(leagueModel, id, data)
            if(!league) throw new AppError("could not update the league data", 400)
            return league
        } catch (error) {
            console.log(error)
            throw new AppError('Error updating league', 400);
        }
    }

    static async deleteLeague(id) {
        try {
            const league = await AbstractService.deleteDocument(leagueModel, id)
            if(!league) throw new AppError("could not delete the league data", 400)
            return league
        } catch (error) {
            console.log(error)
            throw new AppError('Error deleting league', 400);
        }
    }

}

module.exports = LeagueService