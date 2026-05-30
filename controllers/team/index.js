const AbstractController = require('../AbstractController');
const TeamService = require('../../services/Team');
const AppError = require('../../errors/app-error');
const userModel = require('../../models/userModel');
const teamModel = require('../../models/teamModel');
const teamInviteModel = require('../../models/teamInviteModel');
const crypto = require('crypto');
const { sendTeamInviteEmail } = require('../../util/Email/sendMail');

const normalizeMemberIds = (members = []) => members
    .map((member) => member?._id || member)
    .filter(Boolean);

class TeamController extends AbstractController {
    constructor() {
        super();
    }

    static async createTeam(req, res) {
        try {
            const details = req.body; 
            const team = await TeamService.createTeam(details);
            console.log(team);

            if (team) {
                const { data } = details;
                AbstractController.successResponse(res, team, 200, 'Team Created');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error creating team', 400);
        }
    }

    static async getTeams(req, res) {
        try {
            const teams = await TeamService.getTeams();
            AbstractController.successResponse(res, teams, 200, 'Teams fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting teams', 400);
        }
    }

    static async getTeam(req, res) {
        try {
            const team = await TeamService.getTeam(req.params.id);
            AbstractController.successResponse(res, team, 200, 'Team fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting team', 400);
        }
    }

    static async getManagedTeam(req, res) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json({ status: false, message: 'Authentication required' });
            }

            let team = await teamModel.findOne({ captain: userId })
                .populate('members')
                .populate('captain')
                .populate({
                    path: 'matches',
                    populate: [
                        { path: 'homeTeam', model: 'Team', select: 'name' },
                        { path: 'awayTeam', model: 'Team', select: 'name' },
                        { path: 'field', model: 'Field', select: 'name' },
                        { path: 'participants.user', model: 'User', select: 'first_name second_name email' }
                    ]
                });

            if (!team && req.user.team_id) {
                team = await teamModel.findById(req.user.team_id)
                    .populate('members')
                    .populate('captain')
                    .populate({
                        path: 'matches',
                        populate: [
                            { path: 'homeTeam', model: 'Team', select: 'name' },
                            { path: 'awayTeam', model: 'Team', select: 'name' },
                            { path: 'field', model: 'Field', select: 'name' },
                            { path: 'participants.user', model: 'User', select: 'first_name second_name email' }
                        ]
                    });
            }

            if (!team) {
                return res.status(404).json({ status: false, message: 'No team found for this account' });
            }

            AbstractController.successResponse(res, team, 200, 'Team fetched successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error getting managed team', 400);
        }
    }

    static async inviteTeamMember(req, res) {
        try {
            const userId = req.user?._id;
            const { id } = req.params;
            const email = String(req.body.email || '').trim().toLowerCase();

            if (!userId) {
                return res.status(401).json({ status: false, message: 'Authentication required' });
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ status: false, message: 'Valid email is required' });
            }

            const team = await teamModel.findById(id).populate('captain').populate('members');
            if (!team) {
                return res.status(404).json({ status: false, message: 'Team not found' });
            }

            if (team.captain?._id?.toString() !== userId.toString()) {
                return res.status(403).json({ status: false, message: 'Only the team captain can invite members' });
            }

            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                await teamModel.findByIdAndUpdate(id, { $addToSet: { members: existingUser._id } });
                existingUser.team_id = id;
                await existingUser.save();
            }

            const token = crypto.randomBytes(32).toString('hex');
            const invite = await teamInviteModel.findOneAndUpdate(
                { email, team: id, status: 'pending' },
                {
                    email,
                    team: id,
                    invitedBy: userId,
                    token,
                    status: 'pending',
                    expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000))
                },
                { new: true, upsert: true }
            );

            const appUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
            const inviteLink = existingUser
                ? `${appUrl.replace(/\/$/, '')}/auth/login`
                : `${appUrl.replace(/\/$/, '')}/auth/register?teamInvite=${invite.token}&email=${encodeURIComponent(email)}`;
            const captainName = team.captain ? `${team.captain.first_name || ''} ${team.captain.second_name || ''}`.trim() : '';

            try {
                await sendTeamInviteEmail(email, {
                    teamName: team.name,
                    captainName,
                    inviteLink,
                    existingUser: !!existingUser
                });
            } catch (emailError) {
                console.error('Failed to send team invitation email:', emailError);
                return res.status(502).json({
                    status: false,
                    message: 'Invitation saved, but the email could not be sent'
                });
            }

            AbstractController.successResponse(res, {
                invite,
                existingUserAdded: !!existingUser
            }, 200, existingUser ? 'Existing user added and notified' : 'Invitation sent successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error inviting team member', 400);
        }
    }
    
    static async updateTeam(req, res) {
        console.log("update team called", req.body);
        try {
            const id = req.params.id;
            const data = req.body;
            const memberIds = normalizeMemberIds(data.members);
            const captainId = data.captain?._id || data.captain;

            if (memberIds.length > 0) {
                data.members = captainId && !memberIds.includes(captainId)
                    ? [...memberIds, captainId]
                    : memberIds;
            }

            if (captainId) {
                data.captain = captainId;
            }

            const team = await TeamService.updateTeam(id, data);
            console.log(team);

            if (team) {
                const assignedUserIds = [
                    ...(data.members || []),
                    ...(captainId ? [captainId] : [])
                ];

                if (assignedUserIds.length > 0) {
                    await userModel.updateMany(
                        { _id: { $in: assignedUserIds } },
                        { $set: { team_id: id } }
                    );
                }

                AbstractController.successResponse(res, team, 200, 'Team updated successfully');
            }
        } catch (error) {
            console.log(error);
            throw new AppError('Error updating team', 400);
        }
    }

    static async deleteTeam(req, res) {
        try {
            const team = await TeamService.deleteTeam(req.params.id);
            AbstractController.successResponse(res, team, 200, 'Team deleted successfully');
        } catch (error) {
            console.log(error);
            throw new AppError('Error deleting team', 400);
        }
    }

}

module.exports = TeamController;
