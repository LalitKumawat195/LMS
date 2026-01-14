const express = require('express');
const jwt = require('jsonwebtoken');
const Chat = require('./Chat');
const User = require('./User');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's chats
router.get('/', verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.userId': req.user.id
    }).sort({ lastMessageAt: -1 });

    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p.userId.toString() !== req.user.id);
      const currentUserParticipant = chat.participants.find(p => p.userId.toString() === req.user.id);
      
      // Hide Admin from Members unless Admin initiated the chat
      if (req.user.role === 'Member' && otherParticipant?.role === 'Admin') {
        if (chat.initiatedBy && chat.initiatedBy.toString() !== otherParticipant.userId.toString()) {
          return null;
        }
      }
      
      return {
        id: chat._id,
        name: otherParticipant?.name || 'Unknown User',
        role: otherParticipant?.role || 'Member',
        profilePicture: otherParticipant?.profilePicture,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: currentUserParticipant?.unreadCount || 0
      };
    }).filter(chat => chat !== null);

    res.json(formattedChats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new chat
router.post('/', verifyToken, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role-based chat restrictions
    if (req.user.role === 'Member' && participant.role === 'Admin') {
      return res.status(403).json({ message: 'Members cannot initiate chats with Admin' });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      $and: [
        { 'participants.userId': req.user.id },
        { 'participants.userId': participantId }
      ]
    });

    if (existingChat) {
      const otherParticipant = existingChat.participants.find(p => p.userId.toString() !== req.user.id);
      return res.json({
        id: existingChat._id,
        name: participant.name,
        role: participant.role,
        profilePicture: participant.profilePicture,
        lastMessage: existingChat.lastMessage,
        lastMessageAt: existingChat.lastMessageAt
      });
    }

    const currentUser = await User.findById(req.user.id);
    
    const chat = new Chat({
      participants: [
        {
          userId: req.user.id,
          name: currentUser.name,
          role: currentUser.role,
          profilePicture: currentUser.profilePicture
        },
        {
          userId: participantId,
          name: participant.name,
          role: participant.role,
          profilePicture: participant.profilePicture
        }
      ],
      initiatedBy: req.user.id
    });

    await chat.save();

    res.status(201).json({
      id: chat._id,
      name: participant.name,
      role: participant.role,
      profilePicture: participant.profilePicture,
      lastMessage: '',
      lastMessageAt: chat.lastMessageAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate('messages.senderId', 'profilePicture');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.userId.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Reset unread count for current user
    const currentUserParticipant = chat.participants.find(p => p.userId.toString() === req.user.id);
    if (currentUserParticipant) {
      currentUserParticipant.unreadCount = 0;
      await chat.save();
    }

    // Add profile pictures to messages
    const messagesWithProfiles = chat.messages.map(msg => ({
      ...msg.toObject(),
      senderProfilePicture: msg.senderId?.profilePicture || msg.senderProfilePicture
    }));

    res.json(messagesWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/:chatId/messages', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.userId.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const currentUser = await User.findById(req.user.id);
    
    const message = {
      content,
      senderId: req.user.id,
      senderName: req.user.name,
      senderProfilePicture: currentUser.profilePicture
    };

    chat.messages.push(message);
    chat.lastMessage = content;
    chat.lastMessageAt = new Date();

    // Increment unread count for other participants
    chat.participants.forEach(p => {
      if (p.userId.toString() !== req.user.id) {
        p.unreadCount = (p.unreadCount || 0) + 1;
      }
    });

    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users for starting new chats
router.get('/users/all', verifyToken, async (req, res) => {
  try {
    let users;
    
    if (req.user.role === 'Admin') {
      // Admin can see all users
      users = await User.find({ _id: { $ne: req.user.id } })
        .select('name role profilePicture')
        .sort({ name: 1 });
    } else if (req.user.role === 'Librarian') {
      // Librarian can see Admin and Members, but not other Librarians
      users = await User.find({ 
        _id: { $ne: req.user.id },
        role: { $in: ['Admin', 'Member'] }
      })
        .select('name role profilePicture')
        .sort({ name: 1 });
    } else {
      // Members can see Librarians and other Members, but not Admin
      users = await User.find({ 
        _id: { $ne: req.user.id },
        role: { $in: ['Librarian', 'Member'] }
      })
        .select('name role profilePicture')
        .sort({ name: 1 });
    }
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;