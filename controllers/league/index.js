const AbstractController = require("../AbstractController.js")
const LeagueService = require("../../services/League/index.js")
const AppError = require("../../errors/app-error.js")
const userModel = require("../../models/userModel.js")
const userService = require("../../services/user/index.js")
const MatchService = require("../../services/Match/index.js")
const TeamService = require("../../services/Team/index.js")
const StandingsService = require("../../services/Standings/index.js")

class LeagueController extends AbstractController {
    constructor() {
      super()
    }

    static async createLeague(req, res) {
      try {
        const league = await LeagueService.createLeague(req.body)

        if(league) {
          AbstractController.successResponse(res, league, 201, "League created successfully")
        } 
      } catch (error) {
        console.log(error)
        throw new AppError('Error Creating League', 400);
      }
    }

    static async generateMatches(req, res) {
      try {
        const { leagueId, numberOfMatches, startDate, venue, postedBy } = req.body;
        
        // Validate required fields
        if (!leagueId || !numberOfMatches || !venue) {
          throw new AppError('Missing required fields: leagueId, numberOfMatches, venue', 400);
        }

        // Get league with teams
        const league = await LeagueService.getLeague(leagueId);
        if (!league || !league.teams || league.teams.length < 2) {
          throw new AppError('League must have at least 2 teams to generate matches', 400);
        }

        const teams = league.teams;
        const matches = [];
        
        // Create unique team pairings for matches
        const createUniqueTeamPairings = (teamsArray, numMatches) => {
          const pairings = [];
          const usedPairings = new Set();
          const teamIds = teamsArray.map(team => team._id);
          
          // Generate all possible unique pairings first
          const allPossiblePairings = [];
          for (let i = 0; i < teamIds.length; i++) {
            for (let j = i + 1; j < teamIds.length; j++) {
              // Create both home/away combinations for each pair
              allPossiblePairings.push({
                homeTeam: teamIds[i],
                awayTeam: teamIds[j]
              });
              allPossiblePairings.push({
                homeTeam: teamIds[j],
                awayTeam: teamIds[i]
              });
            }
          }
          
          // Shuffle all possible pairings
          for (let i = allPossiblePairings.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allPossiblePairings[i], allPossiblePairings[j]] = [allPossiblePairings[j], allPossiblePairings[i]];
          }
          
          // Select unique pairings up to the requested number
          let pairingIndex = 0;
          for (let i = 0; i < numMatches && pairingIndex < allPossiblePairings.length; i++) {
            const pairing = allPossiblePairings[pairingIndex];
            const pairingKey = `${pairing.homeTeam}-${pairing.awayTeam}`;
            const reversePairingKey = `${pairing.awayTeam}-${pairing.homeTeam}`;
            
            // Check if this exact pairing hasn't been used
            if (!usedPairings.has(pairingKey)) {
              pairings.push(pairing);
              usedPairings.add(pairingKey);
              // Optionally prevent reverse pairing in the same round
              // usedPairings.add(reversePairingKey);
            }
            
            pairingIndex++;
            
            // If we've gone through all possible pairings and need more matches,
            // allow duplicate pairings but with different home/away assignments
            if (pairingIndex >= allPossiblePairings.length && pairings.length < numMatches) {
              pairingIndex = 0;
              usedPairings.clear(); // Reset to allow duplicates
            }
          }
          
          return pairings;
        };

        const teamPairings = createUniqueTeamPairings(teams, numberOfMatches);
        
        // Generate matches with scheduling
        let currentDate = startDate ? new Date(startDate) : new Date();
        let matchesPerDay = 0;
        const maxMatchesPerDay = 2;
        let currentTime = 10; // Start at 10 AM
        
        for (let i = 0; i < teamPairings.length; i++) {
          const pairing = teamPairings[i];
          
          // Schedule match time
          const matchDateTime = new Date(currentDate);
          matchDateTime.setHours(currentTime, 0, 0, 0);
          
          const matchData = {
              homeTeam: pairing.homeTeam,
              awayTeam: pairing.awayTeam,
              league: leagueId,
              date: matchDateTime,
              venue: venue,
              status: 'scheduled',
              matchweek: Math.floor(i / maxMatchesPerDay) + 1,
              ...(postedBy && { postedBy: postedBy._id || postedBy })
          };

          // Create the match
          const createdMatch = await MatchService.createMatch(matchData);
          matches.push(createdMatch);
          
          // Update match scheduling
          matchesPerDay++;
          currentTime += 2; // 2 hours between matches
          
          if (matchesPerDay >= maxMatchesPerDay || currentTime >= 18) {
              // Move to next day
              currentDate.setDate(currentDate.getDate() + 1);
              matchesPerDay = 0;
              currentTime = 10; // Reset to 10 AM
          }
        }

        // Update teams with match references
        for (const match of matches) {
          try {
            // Update home team
            await TeamService.updateTeam(match.homeTeam, {
              $push: { matches: match._id }
            });
            
            // Update away team
            await TeamService.updateTeam(match.awayTeam, {
              $push: { matches: match._id }
            });
          } catch (teamUpdateError) {
              console.log('Error updating team with match:', teamUpdateError);
              // Continue processing other matches
          }
        }

        // Update league with match references
        try {
          const matchIds = matches.map(match => match._id);
          await LeagueService.updateLeague(leagueId, {
            $push: { matches: { $each: matchIds } }
          });
        } catch (leagueUpdateError) {
          console.log('Error updating league with matches:', leagueUpdateError);
        }

        // Initialize standings if they don't exist
        try {
          const updatedLeague = await LeagueService.getLeague(leagueId);
          if (!updatedLeague.standings || updatedLeague.standings.length === 0) {
            console.log('Initializing standings for league:', leagueId);
            await StandingsService.initializeStandings(leagueId);
            console.log('✅ Standings initialized successfully');
          }
        } catch (standingsError) {
          console.log('Error initializing standings:', standingsError);
        }

        AbstractController.successResponse(res, {
          matchesCreated: matches.length,
          matches: matches
        }, 200, `${matches.length} matches generated successfully`);
          
      } catch (error) {
          console.log(error);
          throw new AppError('Error generating matches', 400);
      }
    }

    static async getLeagues(req, res) {
      try {
        const leagues = await LeagueService.getLeagues()
        AbstractController.successResponse(res, leagues, 200, "Leagues fetched successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting leagues', 400);
      }
    }

    static async getLeague(req, res) {
      try {
        const league = await LeagueService.getLeague(req.params.id)
        AbstractController.successResponse(res, league, 200, "League fetched successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error getting league', 400);
      }
    }

    static async updateLeague(req, res) {
      try {
        const league = await LeagueService.updateLeague(req.params.id, req.body)
        AbstractController.successResponse(res, league, 200, "League updated successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error updating league', 400);
      }
    }

    static async deleteLeague(req, res) {
      try {
        const league = await LeagueService.deleteLeague(req.params.id)
        AbstractController.successResponse(res, league, 200, "League deleted successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error deleting league', 400);
      }
    }

    static async initializeLeagueStandings(req, res) {
      try {
        const leagueId = req.params.id;
        const standings = await StandingsService.initializeStandings(leagueId);
        AbstractController.successResponse(res, standings, 200, "League standings initialized successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error initializing league standings', 400);
      }
    }

    static async recalculateLeagueStandings(req, res) {
      try {
        const leagueId = req.params.id;
        const standings = await StandingsService.recalculateStandings(leagueId);
        AbstractController.successResponse(res, standings, 200, "League standings recalculated successfully")
      } catch (error) {
        console.log(error)
        throw new AppError('Error recalculating league standings', 400);
      }
    }
}

module.exports = LeagueController