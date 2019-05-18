// import auth from './auth';
// import memo from './memo';

// export default {
//     ...auth,
//     ...memo,
// };
import { mergeResolvers } from 'merge-graphql-schemas';

import auth from './auth';
import memo from './memo';

const resolvers = [auth, memo];

export default mergeResolvers(resolvers);
