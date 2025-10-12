const LeagueService = require('../League/index.js');
const MatchService = require('../Match/index.js');
const matchModel = require('../../models/matchModel.js');
const leagueModel = require('../../models/leagueModel.js');
const AppError = require('../../errors/app-error.js');

class StandingsService {
    
    /**
     * Initialize standings for a league with all teams
     */
    static async initializeStandings(leagueId) {
        try {
            console.log('🔄 Initializing standings for league:', leagueId);
            // Work directly with the model like other services
            const league = await leagueModel.findById(leagueId).populate('teams').lean();
            if (!league || !league.teams) {
                throw new AppError('League or teams not found', 404);
            }

            const standings = league.teams.map((team, index) => ({
                teamId: team._id,
                position: index + 1,
                matchesPlayed: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
                form: [],
                lastUpdated: new Date()
            }));

            console.log('✅ Created standings for teams:', standings.map(s => ({ teamId: s.teamId, position: s.position })));

            // Update league with initialized standings directly
            await leagueModel.findByIdAndUpdate(leagueId, { standings });
            return standings;
        } catch (error) {
            console.error('Error initializing standings:', error);
            throw new AppError('Failed to initialize standings', 500);
        }
    }

    /**
     * Calculate match result and points
     */
    static calculateMatchResult(homeScore, awayScore) {
        if (homeScore > awayScore) {
            return {
                homePoints: 3,
                awayPoints: 0,
                result: 'W', // Win for home team
                homeResult: 'W',
                awayResult: 'L'
            };
        } else if (homeScore < awayScore) {
            return {
                homePoints: 0,
                awayPoints: 3,
                result: 'L', // Loss for home team
                homeResult: 'L',
                awayResult: 'W'
            };
        } else {
            return {
                homePoints: 1,
                awayPoints: 1,
                result: 'D', // Draw
                homeResult: 'D',
                awayResult: 'D'
            };
        }
    }

    /**
     * Update standings based on match result
     */
    static async updateStandingsForMatch(matchId, oldScore = null) {
        try {
            // Get match with populated team data
            const match = await matchModel.findById(matchId).populate('homeTeam awayTeam league');
            if (!match || !match.score || !match.league) {
                throw new AppError('Match data incomplete for standings update', 400);
            }

            console.log('🔄 Updating standings for match:', {
                matchId,
                homeTeam: match.homeTeam?.name || match.homeTeam,
                awayTeam: match.awayTeam?.name || match.awayTeam,
                score: match.score,
                leagueId: match.league
            });

            // Work directly with the leagueModel like other services
            const league = await leagueModel.findById(match.league).lean(); // .lean() returns plain JS objects
            if (!league) {
                throw new AppError('League not found', 404);
            }

            let standings = league.standings || [];

            console.log('🔍 Current standings data:', {
                standingsLength: standings.length,
                standingsStructure: standings.map(s => ({
                    hasTeamId: !!s?.teamId,
                    teamId: s?.teamId,
                    position: s?.position,
                    keys: Object.keys(s || {})
                }))
            });

            // If standings don't exist, initialize them
            if (standings.length === 0) {
                console.log('📋 Initializing standings for league:', match.league);
                standings = await this.initializeStandings(match.league);
            }

            // Validate standings structure
            const invalidStandings = standings.filter(s => !s || !s.teamId);
            if (invalidStandings.length > 0) {
                console.error('❌ Found invalid standings:', invalidStandings);
                throw new AppError('Invalid standings data - some entries missing teamId', 500);
            }

            // Remove old score impact if updating existing match
            if (oldScore) {
                standings = this.removeMatchImpact(standings, match, oldScore);
            }

            // Add new score impact
            standings = this.addMatchImpact(standings, match);

            // Sort standings
            standings = this.sortStandings(standings);

            // Update positions
            standings = standings.map((team, index) => ({
                ...team,
                position: index + 1,
                lastUpdated: new Date()
            }));

            // Save updated standings directly to the model
            await leagueModel.findByIdAndUpdate(match.league, { standings });

            console.log('✅ Standings updated successfully for match:', matchId);
            return standings;

        } catch (error) {
            console.error('Error updating standings:', error);
            throw new AppError('Failed to update standings', 500);
        }
    }

    /**
     * Add match impact to standings
     */
    static addMatchImpact(standings, match) {
        console.log('🔄 Adding match impact:', {
            matchId: match._id,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            score: match.score,
            standingsCount: standings.length
        });

        // Validate input data
        if (!standings || !Array.isArray(standings)) {
            throw new Error('Invalid standings data - must be an array');
        }

        if (!match || !match.homeTeam || !match.awayTeam || !match.score) {
            throw new Error('Invalid match data - missing required fields');
        }

        // Validate and ensure scores are numbers
        const homeScore = Number(match.score.home || match.score.homeScore || 0);
        const awayScore = Number(match.score.away || match.score.awayScore || 0);
        
        // Additional validation to ensure we have valid numbers
        if (isNaN(homeScore) || isNaN(awayScore)) {
            console.error('❌ Invalid scores:', { 
                originalScore: match.score, 
                homeScore, 
                awayScore 
            });
            throw new Error('Invalid score data - scores must be numbers');
        }

        console.log('🏈 Processing scores:', { homeScore, awayScore });
        const result = this.calculateMatchResult(homeScore, awayScore);

        console.log('📊 Match result calculated:', result);

        // Handle both populated and unpopulated team references - declare outside map for scope access
        const homeTeamId = (typeof match.homeTeam === 'object' && match.homeTeam._id) 
            ? match.homeTeam._id.toString() 
            : match.homeTeam.toString();
        const awayTeamId = (typeof match.awayTeam === 'object' && match.awayTeam._id) 
            ? match.awayTeam._id.toString() 
            : match.awayTeam.toString();

        const updatedStandings = standings.map(standing => {
            // Add null checks
            if (!standing || !standing.teamId) {
                console.error('❌ Invalid standing data:', standing);
                throw new Error('Standing has no teamId');
            }

            const standingTeamId = standing.teamId.toString();

            if (standingTeamId === homeTeamId) {
                // Update home team - ensure all values are valid numbers
                const newGoalsFor = (standing.goalsFor || 0) + homeScore;
                const newGoalsAgainst = (standing.goalsAgainst || 0) + awayScore;
                return {
                    ...standing,
                    matchesPlayed: (standing.matchesPlayed || 0) + 1,
                    wins: (standing.wins || 0) + (result.homeResult === 'W' ? 1 : 0),
                    draws: (standing.draws || 0) + (result.homeResult === 'D' ? 1 : 0),
                    losses: (standing.losses || 0) + (result.homeResult === 'L' ? 1 : 0),
                    goalsFor: newGoalsFor,
                    goalsAgainst: newGoalsAgainst,
                    goalDifference: newGoalsFor - newGoalsAgainst,
                    points: (standing.points || 0) + (result.homePoints || 0),
                    form: [...(standing.form || []).slice(-4), result.homeResult] // Keep last 5
                };
            } else if (standingTeamId === awayTeamId) {
                // Update away team - ensure all values are valid numbers
                const newGoalsFor = (standing.goalsFor || 0) + awayScore;
                const newGoalsAgainst = (standing.goalsAgainst || 0) + homeScore;
                return {
                    ...standing,
                    matchesPlayed: (standing.matchesPlayed || 0) + 1,
                    wins: (standing.wins || 0) + (result.awayResult === 'W' ? 1 : 0),
                    draws: (standing.draws || 0) + (result.awayResult === 'D' ? 1 : 0),
                    losses: (standing.losses || 0) + (result.awayResult === 'L' ? 1 : 0),
                    goalsFor: newGoalsFor,
                    goalsAgainst: newGoalsAgainst,
                    goalDifference: newGoalsFor - newGoalsAgainst,
                    points: (standing.points || 0) + (result.awayPoints || 0),
                    form: [...(standing.form || []).slice(-4), result.awayResult] // Keep last 5
                };
            }

            // Team not involved in this match
            return standing;
        });

        // Verify that both teams were found in standings
        const homeTeamFound = updatedStandings.some(s => s.teamId.toString() === homeTeamId);
        const awayTeamFound = updatedStandings.some(s => s.teamId.toString() === awayTeamId);

        if (!homeTeamFound) {
            console.warn('⚠️ Home team not found in standings:', homeTeamId);
        }
        if (!awayTeamFound) {
            console.warn('⚠️ Away team not found in standings:', awayTeamId);
        }

        console.log('✅ Match impact added successfully');
        return updatedStandings;
    }

    /**
     * Remove match impact from standings (for updates)
     */
    static removeMatchImpact(standings, match, oldScore) {
        console.log('🔄 Removing match impact:', {
            matchId: match._id,
            oldScore,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam
        });

        // Validate input data
        if (!standings || !Array.isArray(standings)) {
            throw new Error('Invalid standings data - must be an array');
        }

        if (!match || !match.homeTeam || !match.awayTeam) {
            throw new Error('Invalid match data - missing required fields');
        }

        // Validate and ensure old scores are numbers
        const oldHomeScore = Number(oldScore.home || 0);
        const oldAwayScore = Number(oldScore.away || 0);
        
        if (isNaN(oldHomeScore) || isNaN(oldAwayScore)) {
            console.error('❌ Invalid old scores:', { oldScore, oldHomeScore, oldAwayScore });
            throw new Error('Invalid old score data - scores must be numbers');
        }

        const result = this.calculateMatchResult(oldHomeScore, oldAwayScore);

        // Handle both populated and unpopulated team references - declare outside map for scope access
        const homeTeamId = (typeof match.homeTeam === 'object' && match.homeTeam._id) 
            ? match.homeTeam._id.toString() 
            : match.homeTeam.toString();
        const awayTeamId = (typeof match.awayTeam === 'object' && match.awayTeam._id) 
            ? match.awayTeam._id.toString() 
            : match.awayTeam.toString();

        const updatedStandings = standings.map(standing => {
            // Add null checks
            if (!standing || !standing.teamId) {
                console.error('❌ Invalid standing data:', standing);
                throw new Error('Standing has no teamId');
            }

            const standingTeamId = standing.teamId.toString();

            if (standingTeamId === homeTeamId) {
                // Remove home team impact - ensure all values are valid numbers
                const newGoalsFor = Math.max(0, (standing.goalsFor || 0) - oldHomeScore);
                const newGoalsAgainst = Math.max(0, (standing.goalsAgainst || 0) - oldAwayScore);
                return {
                    ...standing,
                    matchesPlayed: Math.max(0, (standing.matchesPlayed || 0) - 1),
                    wins: Math.max(0, (standing.wins || 0) - (result.homeResult === 'W' ? 1 : 0)),
                    draws: Math.max(0, (standing.draws || 0) - (result.homeResult === 'D' ? 1 : 0)),
                    losses: Math.max(0, (standing.losses || 0) - (result.homeResult === 'L' ? 1 : 0)),
                    goalsFor: newGoalsFor,
                    goalsAgainst: newGoalsAgainst,
                    goalDifference: newGoalsFor - newGoalsAgainst,
                    points: Math.max(0, (standing.points || 0) - (result.homePoints || 0)),
                    form: (standing.form || []).slice(0, -1) // Remove last result
                };
            } else if (standingTeamId === awayTeamId) {
                // Remove away team impact - ensure all values are valid numbers
                const newGoalsFor = Math.max(0, (standing.goalsFor || 0) - oldAwayScore);
                const newGoalsAgainst = Math.max(0, (standing.goalsAgainst || 0) - oldHomeScore);
                return {
                    ...standing,
                    matchesPlayed: Math.max(0, (standing.matchesPlayed || 0) - 1),
                    wins: Math.max(0, (standing.wins || 0) - (result.awayResult === 'W' ? 1 : 0)),
                    draws: Math.max(0, (standing.draws || 0) - (result.awayResult === 'D' ? 1 : 0)),
                    losses: Math.max(0, (standing.losses || 0) - (result.awayResult === 'L' ? 1 : 0)),
                    goalsFor: newGoalsFor,
                    goalsAgainst: newGoalsAgainst,
                    goalDifference: newGoalsFor - newGoalsAgainst,
                    points: Math.max(0, (standing.points || 0) - (result.awayPoints || 0)),
                    form: (standing.form || []).slice(0, -1) // Remove last result
                };
            }

            // Team not involved in this match
            return standing;
        });

        console.log('✅ Match impact removed successfully');
        return updatedStandings;
    }

    /**
     * Sort standings by points, goal difference, goals for
     */
    static sortStandings(standings) {
        return standings.sort((a, b) => {
            // First by points (descending)
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            
            // Then by goal difference (descending)
            if (b.goalDifference !== a.goalDifference) {
                return b.goalDifference - a.goalDifference;
            }
            
            // Finally by goals for (descending)
            return b.goalsFor - a.goalsFor;
        });
    }

    /**
     * Recalculate all standings from scratch based on match results
     */
    static async recalculateStandings(leagueId) {
        try {
            console.log('🔄 Recalculating standings from scratch for league:', leagueId);

            // Initialize fresh standings
            await this.initializeStandings(leagueId);

            // Get all matches for this league with populated team data
            const matches = await matchModel.find({ league: leagueId }).populate('homeTeam awayTeam');

            // Process each completed match
            for (const match of matches) {
                if (match.score && match.score.home !== undefined && match.score.away !== undefined) {
                    await this.updateStandingsForMatch(match._id);
                }
            }

            console.log('✅ Standings recalculated successfully for league:', leagueId);
            return true;

        } catch (error) {
            console.error('Error recalculating standings:', error);
            throw new AppError('Failed to recalculate standings', 500);
        }
    }

    /**
     * Get league standings
     */
    static async getStandings(leagueId) {
        try {
            // Work directly with the model like other services
            const league = await leagueModel.findById(leagueId).lean();
            if (!league) {
                throw new AppError('League not found', 404);
            }

            return league.standings || [];
        } catch (error) {
            console.error('Error getting standings:', error);
            throw new AppError('Failed to get standings', 500);
        }
    }
}

module.exports = StandingsService;
