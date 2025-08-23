import express from 'express';
import pc from 'picocolors';

import Models from './models/index';
import { createAuthRouter } from './routes/auth';
import { createUserRouter } from './routes/users';
import { createTweetsRouter } from './routes/tweets';
import { createLikesRouter } from './routes/likes';
import { createRetweetRouter } from './routes/retweets';
import { createBookmarksRouter } from './routes/bookmarks';
import { createFollowsRouter } from './routes/follows';
import { createNotificcationsRouter } from './routes/notifications';
import { createQueryRouter } from './routes/query';

import cookieParser from 'cookie-parser';
import logger from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import cors from './middlewares/cors';

const PORT = process.env.PORT ?? 3000;
const SERVER_URL = process.env.RENDER_EXTERNAL_URL ?? `http://localhost:${PORT}`;
const app = express();

app.use(express.json());
app.use(logger);
app.use(cors);
app.use(cookieParser());

app.use('/users', createUserRouter({ userModel: Models.UsersModel, tweetsModel: Models.TweetsModel }));
app.use('/auth', createAuthRouter({ authModel: Models.AuthModel }));
app.use('/tweets', createTweetsRouter({ tweetModel: Models.TweetsModel }));
app.use('/likes', createLikesRouter({ likesModel: Models.LikesModel }));
app.use('/retweets', createRetweetRouter({ retweetModel: Models.RetweetsModel }));
app.use('/bookmarks', createBookmarksRouter({ bookmarksModel: Models.BookmarksModel }));
app.use('/follows', createFollowsRouter({ followsModel: Models.FollowsModel }));
app.use('/notifications', createNotificcationsRouter({ notificationsModel: Models.NotificationsModel }));
app.use('/search', createQueryRouter({ queryModel: Models.QueryModel }));


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(pc.blue(`Server running on ${pc.reset(SERVER_URL)}`));
});
