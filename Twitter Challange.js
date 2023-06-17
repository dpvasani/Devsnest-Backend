const express = require('express');
const app = express();
app.use(express.json());

// Sample data
const users = [
  {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    createdAt: new Date(),
    updatedAt: new Date(),
    following: [],
    followers: []
  },
  // More users
];

const tweets = [
  {
    id: 1,
    text: 'First tweet',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // More tweets
];

// GET /api/user
app.get('/api/user', (req, res) => {
  res.status(200).json(users);
});

// POST /api/user
app.post('/api/user', (req, res) => {
  const { name, username } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    username,
    createdAt: new Date(),
    updatedAt: new Date(),
    following: [],
    followers: []
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// POST /api/user/follow
app.post('/api/user/follow', (req, res) => {
  const { fromUserId, toUserId } = req.body;

  // Check if fromUserId and toUserId are valid (existing users)
  const fromUser = users.find((user) => user.id === fromUserId);
  const toUser = users.find((user) => user.id === toUserId);

  if (!fromUser) {
    return res.status(404).json({ message: 'fromUserId is invalid' });
  }

  if (!toUser) {
    return res.status(404).json({ message: 'toUserId is invalid' });
  }

  // Check if the users are already following each other
  const isAlreadyFollowing = fromUser.following.includes(toUserId);
  const isAlreadyFollowed = toUser.followers.includes(fromUserId);

  if (isAlreadyFollowing && isAlreadyFollowed) {
    return res.status(400).json({ message: 'Users are already following each other' });
  }

  // Add toUserId to the following list of fromUser
  fromUser.following.push(toUserId);

  // Add fromUserId to the followers list of toUser
  toUser.followers.push(fromUserId);

  res.status(200).json({ message: 'Follow successful' });
});

// POST /api/user/unfollow
app.post('/api/user/unfollow', (req, res) => {
  const { fromUserId, toUserId } = req.body;

  // Check if fromUserId and toUserId are valid (existing users)
  const fromUser = users.find((user) => user.id === fromUserId);
  const toUser = users.find((user) => user.id === toUserId);

  if (!fromUser) {
    return res.status(404).json({ message: 'fromUserId is invalid' });
  }

  if (!toUser) {
    return res.status(404).json({ message: 'toUserId is invalid' });
  }

  // Check if the users are already not following each other
  const isFollowing = fromUser.following.includes(toUserId);
  const isFollowed = toUser.followers.includes(fromUserId);

  if (!isFollowing && !isFollowed) {
    return res.status(400).json({ message: 'Users are not following each other' });
  }

  // Remove toUserId from the following list of fromUser
  const fromUserFollowingIndex = fromUser.following.indexOf(toUserId);
  fromUser.following.splice(fromUserFollowingIndex, 1);

  // Remove fromUserId from the followers list of toUser
  const toUserFollowersIndex = toUser.followers.indexOf(fromUserId);
  toUser.followers.splice(toUserFollowersIndex, 1);

  res.status(200).json({ message: 'Unfollow successful' });
});

// POST /api/tweet
app.post('/api/tweet', (req, res) => {
  const { userId, text } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'Invalid user' });
  }

  const newTweet = {
    id: tweets.length + 1,
    text,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tweets.push(newTweet);

  res.status(201).json(newTweet);
});

// POST /api/user/feed
app.post('/api/user/feed', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User Id is required' });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get the tweets from user and people he follows
  const followedUserIds = user.following;
  const feedTweets = tweets
    .filter((tweet) => followedUserIds.includes(tweet.userId) || tweet.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);

  res.status(200).json(feedTweets);
});

// POST /api/user/timeline
app.post('/api/user/timeline', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User Id is required' });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get the 10 most recent tweets from the user
  const userTweets = tweets
    .filter((tweet) => tweet.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10);

  res.status(200).json(userTweets);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
