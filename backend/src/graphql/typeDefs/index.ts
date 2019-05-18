// import memo from './memo';
// import auth from './auth';

// export default {
//     ...memo,
//     ...auth,
// };

import { mergeTypes } from 'merge-graphql-schemas';
import auth from './auth';
import memo from './memo';

const types = [auth, memo];

export default mergeTypes(types, { all: true });
